import { useState, useCallback } from 'react';
import {
  fetchRentalComps,
  fetchSaleComps,
  fetchAvm,
  fetchMarketStats,
} from '../api/rentcast.js';

const STORAGE_KEY = 'rentcast_usage';
const MONTHLY_LIMIT = 50;

function getUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, month: -1, year: -1 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, month: -1, year: -1 };
  }
}

function recordCalls(n) {
  const now = new Date();
  const usage = getUsage();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();
  if (usage.month !== curMonth || usage.year !== curYear) {
    const fresh = { count: n, month: curMonth, year: curYear };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  const updated = { ...usage, count: usage.count + n };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * RentCast can return listings as a bare array OR wrapped in an object.
 * Handles: [], { listings: [] }, { data: [] }, { results: [] }
 */
function normalizeListings(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.listings)) return raw.listings;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.results)) return raw.results;
  return [];
}

/** Best-effort address string from a RentCast listing object */
function getAddress(c) {
  return c.formattedAddress || c.addressLine1 || c.address || c.streetAddress || '';
}

/** Monthly rent from a rental comp */
function getRent(c) {
  return c.price ?? c.rent ?? c.monthlyRent ?? 0;
}

export function useRentCast() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(() => getUsage());

  const remaining = MONTHLY_LIMIT - usage.count;
  const canFetch = remaining >= 4;

  const fetchAll = useCallback(async ({ address, city, state, zip, bedCount }) => {
    if (!canFetch) {
      setError('Monthly API limit reached (50 calls). Resets next month.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [rentalResult, saleResult, avmResult, marketResult] = await Promise.allSettled([
        fetchRentalComps({ address, city, state, zip, bedrooms: bedCount }),
        fetchSaleComps({ address, city, state, zip, bedrooms: bedCount }),
        fetchAvm({ address, city, state, zip }),
        fetchMarketStats({ zip, state }),
      ]);

      const newUsage = recordCalls(4);
      setUsage(newUsage);

      const rentalComps = rentalResult.status === 'fulfilled'
        ? normalizeListings(rentalResult.value).map((c) => ({ ...c, _address: getAddress(c), _rent: getRent(c) }))
        : [];

      const saleComps = saleResult.status === 'fulfilled'
        ? normalizeListings(saleResult.value).map((c) => ({ ...c, _address: getAddress(c) }))
        : [];

      const avm   = avmResult.status    === 'fulfilled' ? avmResult.value    : null;
      const market = marketResult.status === 'fulfilled' ? marketResult.value : null;

      const partialErrors = [rentalResult, saleResult, avmResult, marketResult]
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason?.message || 'Unknown error');

      // Derive medians
      let medianRent = null;
      if (rentalComps.length > 0) {
        const rents = rentalComps.map((c) => c._rent).filter(Boolean).sort((a, b) => a - b);
        if (rents.length) medianRent = rents[Math.floor(rents.length / 2)];
      }

      let medianSalePrice = null;
      let medianPricePerSqft = null;
      if (saleComps.length > 0) {
        const prices = saleComps.map((c) => c.price || 0).filter(Boolean).sort((a, b) => a - b);
        if (prices.length) medianSalePrice = prices[Math.floor(prices.length / 2)];

        const ppsf = saleComps
          .filter((c) => c.price && c.squareFootage)
          .map((c) => c.price / c.squareFootage)
          .sort((a, b) => a - b);
        if (ppsf.length) medianPricePerSqft = ppsf[Math.floor(ppsf.length / 2)];
      }

      setData({ rentalComps, saleComps, avm, market, medianRent, medianSalePrice, medianPricePerSqft, partialErrors });

    } catch (err) {
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, [canFetch]);

  const reset = useCallback(() => { setData(null); setError(null); }, []);

  return { data, loading, error, usage, remaining, canFetch, fetchAll, reset, MONTHLY_LIMIT };
}
