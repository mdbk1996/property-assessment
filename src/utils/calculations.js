/**
 * All pure financial calculation functions.
 * No React dependencies — safe to call from hooks or tests.
 */

/** Standard amortizing mortgage payment */
export function calcMonthlyMortgage(loanAmount, annualRate, termYears) {
  if (loanAmount <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Loan balance after k payments */
export function loanBalanceAfter(loanAmount, annualRate, termYears, monthsPaid) {
  if (loanAmount <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return Math.max(0, loanAmount - (loanAmount / n) * monthsPaid);
  return loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, monthsPaid)) / (Math.pow(1 + r, n) - 1);
}

/** Gross rent from state (handles room vs unit mode) */
export function calcGrossRent(rentalMode, rooms, bedCount, wholeUnitRent) {
  if (rentalMode === 'unit') return wholeUnitRent;
  return rooms.slice(0, bedCount).reduce((sum, r) => sum + r, 0);
}

/** Rehab cost: manual overrides per-sqft */
export function calcRehabCost(sqft, rehabCostPerSqft, rehabCostManual) {
  if (rehabCostManual != null && rehabCostManual > 0) return rehabCostManual;
  return sqft * rehabCostPerSqft;
}

/** Core hold metrics */
export function calcHoldMetrics({
  purchasePrice,
  downPct,
  interestRate,
  loanTermYears,
  closingCostPct,
  propTaxRate,
  specialAssessments,
  hoa,
  insurance,
  maintenance,
  propMgmtPct,
  vacancyPct,
  grossRent,
}) {
  const downPayment = purchasePrice * (downPct / 100);
  const loanAmount = purchasePrice - downPayment;
  const closingCosts = purchasePrice * (closingCostPct / 100);
  const monthlyMortgage = calcMonthlyMortgage(loanAmount, interestRate, loanTermYears);

  const annualPropTax = purchasePrice * (propTaxRate / 100);
  const monthlyPropTax = (annualPropTax + specialAssessments) / 12;

  const vacancyLoss = grossRent * (vacancyPct / 100);
  const effectiveRent = grossRent - vacancyLoss;
  const propMgmtCost = effectiveRent * (propMgmtPct / 100);

  // OpEx = everything except mortgage
  const monthlyOpEx = insurance + maintenance + propMgmtCost + monthlyPropTax + hoa;
  const monthlyOpExTotal = monthlyOpEx + monthlyMortgage;
  const holdCashFlow = effectiveRent - monthlyOpExTotal;

  const annualNOI = (effectiveRent - monthlyOpEx) * 12;
  const capRate = purchasePrice > 0 ? (annualNOI / purchasePrice) * 100 : 0;

  const totalCashInvested = downPayment + closingCosts;
  const holdCoCReturn = totalCashInvested > 0 ? ((holdCashFlow * 12) / totalCashInvested) * 100 : 0;

  const grm = grossRent > 0 ? purchasePrice / (grossRent * 12) : 0;

  return {
    downPayment,
    loanAmount,
    closingCosts,
    monthlyMortgage,
    annualPropTax,
    monthlyPropTax,
    vacancyLoss,
    effectiveRent,
    propMgmtCost,
    monthlyOpEx,
    monthlyOpExTotal,
    holdCashFlow,
    annualNOI,
    capRate,
    totalCashInvested,
    holdCoCReturn,
    grm,
  };
}

/** Flip metrics */
export function calcFlipMetrics({
  purchasePrice,
  closingCosts,
  rehabCost,
  rehabTimelineMonths,
  flipMarketingMonths,
  monthlyOpExTotal,
  arvPerSqft,
  sqft,
  sellingCostPct,
}) {
  const totalHoldMonths = rehabTimelineMonths + flipMarketingMonths;
  const rehabCarryCost = monthlyOpExTotal * rehabTimelineMonths;
  const marketingCarryCost = monthlyOpExTotal * flipMarketingMonths;
  const flipCarryingCosts = rehabCarryCost + marketingCarryCost;

  const arv = arvPerSqft * sqft;
  const sellingCosts = arv * (sellingCostPct / 100);
  const totalFlipCost = purchasePrice + closingCosts + rehabCost + flipCarryingCosts;
  const flipProfit = arv - totalFlipCost - sellingCosts;
  const flipROI = totalFlipCost > 0 ? (flipProfit / totalFlipCost) * 100 : 0;
  const flipAnnualizedROI = totalHoldMonths > 0 ? (flipROI / (totalHoldMonths / 12)) : 0;
  const breakEvenArv = totalFlipCost + sellingCosts;

  return {
    totalHoldMonths,
    rehabCarryCost,
    marketingCarryCost,
    flipCarryingCosts,
    arv,
    sellingCosts,
    totalFlipCost,
    flipProfit,
    flipROI,
    flipAnnualizedROI,
    breakEvenArv,
  };
}

/** BRRRR metrics */
export function calcBrrrrMetrics({
  arv,
  brrrrRefiLTV,
  brrrrRefiRate,
  brrrrRefiTermYears,
  loanAmount,          // original purchase loan
  totalCashInvested,   // down + closing + rehab
  effectiveRent,
  monthlyOpEx,         // WITHOUT mortgage
  rehabCost,
}) {
  const totalCashIn = totalCashInvested + rehabCost;
  const refiLoanAmount = arv * (brrrrRefiLTV / 100);
  const cashPulledOut = refiLoanAmount - loanAmount;
  const refiPayment = calcMonthlyMortgage(refiLoanAmount, brrrrRefiRate, brrrrRefiTermYears);
  const postRefiCashFlow = effectiveRent - monthlyOpEx - refiPayment;
  const remainingCapital = totalCashIn - cashPulledOut;
  const effectiveCoC = remainingCapital > 0
    ? ((postRefiCashFlow * 12) / remainingCapital) * 100
    : Infinity; // full recovery
  const equityInDeal = arv - refiLoanAmount;
  const fullRecovery = remainingCapital <= 0;

  return {
    totalCashIn,
    refiLoanAmount,
    cashPulledOut,
    refiPayment,
    postRefiCashFlow,
    remainingCapital,
    effectiveCoC,
    equityInDeal,
    fullRecovery,
  };
}

/** Year-by-year amortization / equity schedule */
export function calcAmortizationSchedule({
  purchasePrice,
  loanAmount,
  interestRate,
  loanTermYears,
  holdCashFlow,
  annualAppreciation,
  years,
  totalCashInvested,
}) {
  const rows = [];

  // Year 0 baseline
  rows.push({
    year: 0,
    balance: loanAmount,
    cumPrincipal: 0,
    cumCashFlow: 0,
    propValue: purchasePrice,
    totalEquity: purchasePrice - loanAmount,
    totalReturn: purchasePrice - loanAmount - totalCashInvested,
  });

  for (let y = 1; y <= years; y++) {
    const balance = loanBalanceAfter(loanAmount, interestRate, loanTermYears, y * 12);
    const cumPrincipal = loanAmount - balance;
    const cumCashFlow = holdCashFlow * y * 12;
    const propValue = purchasePrice * Math.pow(1 + annualAppreciation / 100, y);
    const totalEquity = propValue - balance;
    const totalReturn = totalEquity + cumCashFlow - totalCashInvested;

    rows.push({ year: y, balance, cumPrincipal, cumCashFlow, propValue, totalEquity, totalReturn });
  }

  return rows;
}
