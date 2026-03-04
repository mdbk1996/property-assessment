/**
 * RentCast API wrappers.
 * All calls go through Vite's proxy at /api/rentcast → https://api.rentcast.io
 * X-Api-Key is injected server-side by the proxy; never exposed to the browser.
 */

const BASE = '/api/rentcast';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`RentCast ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/** Build address query string */
function addrParams(address, city, state, zip) {
  const params = new URLSearchParams();
  if (address) params.set('address', address);
  if (city) params.set('city', city);
  if (state) params.set('state', state);
  if (zip) params.set('zipCode', zip);
  return params.toString();
}

/**
 * Rental comps — long-term listings near the property
 * Returns array of comp objects
 */
export async function fetchRentalComps({ address, city, state, zip, bedrooms, limit = 10 }) {
  const base = addrParams(address, city, state, zip);
  const extra = new URLSearchParams({ limit });
  if (bedrooms) extra.set('bedrooms', bedrooms);
  return get(`/v1/listings/rental/long-term?${base}&${extra}`);
}

/**
 * Sale comps — recent sold listings
 * Returns array of comp objects
 */
export async function fetchSaleComps({ address, city, state, zip, bedrooms, limit = 10 }) {
  const base = addrParams(address, city, state, zip);
  const extra = new URLSearchParams({ limit, status: 'Sold' });
  if (bedrooms) extra.set('bedrooms', bedrooms);
  return get(`/v1/listings/sale?${base}&${extra}`);
}

/**
 * AVM (Automated Valuation Model) — estimated value + confidence range
 * Returns { price, priceRangeLow, priceRangeHigh, ... }
 */
export async function fetchAvm({ address, city, state, zip }) {
  const q = addrParams(address, city, state, zip);
  return get(`/v1/avm/value?${q}`);
}

/**
 * Market statistics for the zip code
 * Returns { averageDaysOnMarket, medianListPrice, ... }
 */
export async function fetchMarketStats({ zip, state }) {
  const params = new URLSearchParams();
  if (zip) params.set('zipCode', zip);
  if (state) params.set('state', state);
  return get(`/v1/markets?${params}`);
}
