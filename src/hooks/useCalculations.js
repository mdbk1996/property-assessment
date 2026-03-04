import { useMemo } from 'react';
import {
  calcGrossRent,
  calcRehabCost,
  calcHoldMetrics,
  calcFlipMetrics,
  calcBrrrrMetrics,
  calcAmortizationSchedule,
} from '../utils/calculations.js';

/**
 * Derives all financial metrics from app state.
 * Returns a flat object of all computed values.
 */
export function useCalculations(state) {
  return useMemo(() => {
    const {
      purchasePrice, downPct, interestRate, loanTermYears, closingCostPct,
      propTaxRate, specialAssessments, hoa,
      insurance, maintenance, propMgmtPct, vacancyPct,
      rentalMode, rooms, bedCount, wholeUnitRent,
      rehabCostPerSqft, rehabCostManual, rehabTimelineMonths,
      arvPerSqft, flipMarketingMonths, sellingCostPct,
      brrrrRefiLTV, brrrrRefiRate, brrrrRefiTermYears,
      annualAppreciation, sqft, amortYears,
    } = state;

    const grossRent = calcGrossRent(rentalMode, rooms, bedCount, wholeUnitRent);
    const rehabCost = calcRehabCost(sqft, rehabCostPerSqft, rehabCostManual);

    const hold = calcHoldMetrics({
      purchasePrice, downPct, interestRate, loanTermYears, closingCostPct,
      propTaxRate, specialAssessments, hoa,
      insurance, maintenance, propMgmtPct, vacancyPct,
      grossRent,
    });

    const flip = calcFlipMetrics({
      purchasePrice,
      closingCosts: hold.closingCosts,
      rehabCost,
      rehabTimelineMonths,
      flipMarketingMonths,
      monthlyOpExTotal: hold.monthlyOpExTotal,
      arvPerSqft,
      sqft,
      sellingCostPct,
    });

    const brrrr = calcBrrrrMetrics({
      arv: flip.arv,
      brrrrRefiLTV,
      brrrrRefiRate,
      brrrrRefiTermYears,
      loanAmount: hold.loanAmount,
      totalCashInvested: hold.totalCashInvested,
      effectiveRent: hold.effectiveRent,
      monthlyOpEx: hold.monthlyOpEx,
      rehabCost,
    });

    const amortSchedule = calcAmortizationSchedule({
      purchasePrice,
      loanAmount: hold.loanAmount,
      interestRate,
      loanTermYears,
      holdCashFlow: hold.holdCashFlow,
      annualAppreciation,
      years: amortYears,
      totalCashInvested: hold.totalCashInvested,
    });

    const pricePerSqft = sqft > 0 ? purchasePrice / sqft : 0;

    return {
      grossRent,
      rehabCost,
      pricePerSqft,
      ...hold,
      ...flip,
      brrrr,
      amortSchedule,
    };
  }, [state]);
}
