// Default values based on 33845 Sattui St, Temecula, CA 92592
export const DEFAULTS = {
  // Property identity
  address: '33845 Sattui St',
  city: 'Temecula',
  state: 'CA',
  zip: '92592',
  bedCount: 5,
  bathCount: 4.5,
  sqft: 3755,
  listingPrice: 899000,

  // Acquisition
  purchasePrice: 899000,
  downPct: 20,
  interestRate: 7.25,
  loanTermYears: 30,
  closingCostPct: 2.5,

  // Taxes & fixed
  propTaxRate: 1.1,
  specialAssessments: 3300,
  hoa: 119,

  // OpEx
  insurance: 250,
  maintenance: 500,
  propMgmtPct: 8,
  vacancyPct: 5,

  // Rental income
  rentalMode: 'room', // "room" | "unit"
  // 10-slot array; first bedCount slots are active
  rooms: [950, 900, 850, 850, 800, 750, 750, 700, 700, 650],
  wholeUnitRent: 3500,

  // Rehab
  rehabCondition: 'moderate', // "cosmetic" | "moderate" | "gut" | "custom"
  rehabCostManual: null,      // null = use per-sqft calc
  rehabCostPerSqft: 57.5,     // midpoint of moderate range ($40–75)
  rehabTimelineMonths: 4,

  // Flip
  arvPerSqft: 320,
  flipMarketingMonths: 2,
  sellingCostPct: 6,

  // BRRRR
  brrrrRefiLTV: 75,
  brrrrRefiRate: 7.0,
  brrrrRefiTermYears: 30,

  // Hold
  annualAppreciation: 4,

  // UI
  activeTab: 'flip',
  amortYears: 30,
  sensitivityXVar: 'purchasePrice',
  sensitivityYVar: 'interestRate',
  sensitivityOutputVar: 'holdCashFlow',
};

export const REHAB_TIERS = {
  cosmetic: { label: 'Cosmetic', range: [15, 35], midpoint: 25, description: 'Paint, fixtures, landscaping' },
  moderate: { label: 'Moderate', range: [40, 75], midpoint: 57.5, description: 'Kitchen, baths, flooring' },
  gut:      { label: 'Full Gut', range: [80, 150], midpoint: 115, description: 'Structural, plumbing, electric' },
  custom:   { label: 'Custom', range: [0, 300], midpoint: null, description: 'Enter cost manually' },
};

export const SENSITIVITY_VARS = {
  purchasePrice:    { label: 'Purchase Price', format: 'currency', step: 25000 },
  interestRate:     { label: 'Interest Rate', format: 'pct2', step: 0.25 },
  arvPerSqft:       { label: 'ARV / sqft', format: 'dollar', step: 10 },
  rehabCostPerSqft: { label: 'Reno / sqft', format: 'dollar', step: 5 },
  wholeUnitRent:    { label: 'Monthly Rent', format: 'currency', step: 100 },
  downPct:          { label: 'Down %', format: 'pct0', step: 5 },
};

export const SENSITIVITY_OUTPUTS = {
  holdCashFlow:  { label: 'Monthly Cash Flow', format: 'currency', good: (v) => v > 200 },
  flipProfit:    { label: 'Flip Net Profit', format: 'currency', good: (v) => v > 0 },
  holdCoCReturn: { label: 'CoC Return', format: 'pct2', good: (v) => v > 5 },
  capRate:       { label: 'Cap Rate', format: 'pct2', good: (v) => v > 5 },
};
