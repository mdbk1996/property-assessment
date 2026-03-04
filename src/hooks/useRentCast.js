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
    // New month — reset
    const fresh = { count: n, month: curMonth, year: curYear };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  const updated = { ...usage, count: usage.count + n };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function useRentCast() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(() => getUsage());

  const remaining = MONTHLY_LIMIT - usage.count;
  const canFetch = remaining >= 4; // need 4 calls for a full fetch

  const fetchAll = useCallback(async ({ address, city, state, zip, bedCount }) => {
    if (!canFetch) {
      setError('Monthly API limit reached (50 calls). Resets next month.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [rentalComps, saleComps, avm, market] = await Promise.allSettled([
        fetchRentalComps({ address, city, state, zip, bedrooms: bedCount }),
        fetchSaleComps({ address, city, state, zip, bedrooms: bedCount }),
        fetchAvm({ address, city, state, zip }),
        fetchMarketStats({ zip, state }),
      ]);

      const newUsage = recordCalls(4);
      setUsage(newUsage);

      const result = {
        rentalComps: rentalComps.status === 'fulfilled' ? (rentalComps.value || []) : [],
        saleComps:   saleComps.status  === 'fulfilled' ? (saleComps.value  || []) : [],
        avm:         avm.status        === 'fulfilled' ? avm.value   : null,
        market:      market.status     === 'fulfilled' ? market.value : null,
        errors: [rentalComps, saleComps, avm, market]
          .filter((r) => r.status === 'rejected')
          .map((r) => r.reason?.message || 'Unknown error'),
      };

      // Derive medians
      if (result.rentalComps.length > 0) {
        const rents = result.rentalComps.map((c) => c.price || c.rent || 0).filter(Boolean).sort((a, b) => a - b);
        result.medianRent = rents[Math.floor(rents.length / 2)];
      }
      if (result.saleComps.length > 0) {
        const prices = result.saleComps.map((c) => c.price || 0).filter(Boolean).sort((a, b) => a - b);
        result.medianSalePrice = prices[Math.floor(prices.length / 2)];
        const sqfts = result.saleComps.map((c) => c.price && c.squareFootage ? c.price / c.squareFootage : 0).filter(Boolean).sort((a, b) => a - b);
        result.medianPricePerSqft = sqfts[Math.floor(sqfts.length / 2)] || null;
      }

      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, [canFetch]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, usage, remaining, canFetch, fetchAll, reset, MONTHLY_LIMIT };
}
