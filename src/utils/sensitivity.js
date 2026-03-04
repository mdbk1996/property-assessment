import { calcGrossRent, calcRehabCost, calcHoldMetrics, calcFlipMetrics } from './calculations.js';

/**
 * Generate a 5x5 sensitivity matrix.
 * Returns { xValues, yValues, grid } where grid[row][col] = output value.
 * xVar varies across columns, yVar varies across rows.
 */
export function buildSensitivityMatrix({ state, xVar, yVar, outputVar }) {
  const xRange = getRange(xVar, state[xVar]);
  const yRange = getRange(yVar, state[yVar]);

  const grid = yRange.map((yVal) =>
    xRange.map((xVal) => computeOutput({ state, xVar, xVal, yVar, yVal, outputVar }))
  );

  return { xValues: xRange, yValues: yRange, grid };
}

function getRange(varName, center) {
  const steps = stepsFor(varName);
  const [s1, s2, s3, s4] = steps; // offsets from center: [-2, -1, 0, +1, +2]
  return [center - 2 * s1, center - s2, center, center + s3, center + 2 * s4].map((v) =>
    parseFloat(v.toFixed(4))
  );
}

function stepsFor(varName) {
  const map = {
    purchasePrice:    [25000, 25000, 25000, 25000],
    interestRate:     [0.25, 0.25, 0.25, 0.25],
    arvPerSqft:       [10, 10, 10, 10],
    rehabCostPerSqft: [5, 5, 5, 5],
    wholeUnitRent:    [100, 100, 100, 100],
    downPct:          [5, 5, 5, 5],
  };
  return map[varName] || [1, 1, 1, 1];
}

function computeOutput({ state, xVar, xVal, yVar, yVal, outputVar }) {
  const s = { ...state, [xVar]: xVal, [yVar]: yVal };

  const grossRent = calcGrossRent(s.rentalMode, s.rooms, s.bedCount, s.wholeUnitRent);
  const rehabCost = calcRehabCost(s.sqft, s.rehabCostPerSqft, s.rehabCostManual);

  const hold = calcHoldMetrics({
    purchasePrice: s.purchasePrice,
    downPct: s.downPct,
    interestRate: s.interestRate,
    loanTermYears: s.loanTermYears,
    closingCostPct: s.closingCostPct,
    propTaxRate: s.propTaxRate,
    specialAssessments: s.specialAssessments,
    hoa: s.hoa,
    insurance: s.insurance,
    maintenance: s.maintenance,
    propMgmtPct: s.propMgmtPct,
    vacancyPct: s.vacancyPct,
    grossRent,
  });

  if (outputVar === 'holdCashFlow') return hold.holdCashFlow;
  if (outputVar === 'holdCoCReturn') return hold.holdCoCReturn;
  if (outputVar === 'capRate') return hold.capRate;

  if (outputVar === 'flipProfit') {
    const flip = calcFlipMetrics({
      purchasePrice: s.purchasePrice,
      closingCosts: hold.closingCosts,
      rehabCost,
      rehabTimelineMonths: s.rehabTimelineMonths,
      flipMarketingMonths: s.flipMarketingMonths,
      monthlyOpExTotal: hold.monthlyOpExTotal,
      arvPerSqft: s.arvPerSqft,
      sqft: s.sqft,
      sellingCostPct: s.sellingCostPct,
    });
    return flip.flipProfit;
  }

  return 0;
}
