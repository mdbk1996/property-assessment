export const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

export const formatPct = (val) => `${val.toFixed(2)}%`;

export const formatPct1 = (val) => `${val.toFixed(1)}%`;

export const formatNumber = (val, decimals = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(val);

// Format a value based on format key (used by sensitivity table)
export const formatByKey = (val, formatKey) => {
  switch (formatKey) {
    case 'currency': return formatCurrency(val);
    case 'pct2':     return formatPct(val);
    case 'pct1':     return formatPct1(val);
    case 'pct0':     return `${Math.round(val)}%`;
    case 'dollar':   return `$${Math.round(val)}`;
    default:         return String(val);
  }
};
