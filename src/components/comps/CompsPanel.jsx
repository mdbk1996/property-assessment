import { useState, useEffect } from 'react';
import { CollapsiblePanel } from '../primitives/CollapsiblePanel.jsx';
import { RentalCompsPanel } from './RentalCompsPanel.jsx';
import { SaleCompsPanel } from './SaleCompsPanel.jsx';
import { MarketStatsPanel } from './MarketStatsPanel.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function CompsPanel({ state, update, rentcastHook }) {
  const { data, loading, error, usage, remaining, canFetch, fetchAll, MONTHLY_LIMIT } = rentcastHook;
  const { address, city, zip, bedCount, sqft } = state;

  const [open, setOpen] = useState(false);

  // Auto-open panel when data arrives
  useEffect(() => {
    if (data) setOpen(true);
  }, [data]);

  function handleFetch() {
    setOpen(true);
    fetchAll({ address, city, state: state.state, zip, bedCount });
  }

  // "Use as ARV" sets arvPerSqft so downstream calc derives arv correctly
  function applyArv(price) {
    update({ arvPerSqft: sqft > 0 ? parseFloat((price / sqft).toFixed(2)) : state.arvPerSqft });
  }

  const usageColor = remaining <= 10 ? '#b02020' : remaining <= 20 ? '#9a6e0c' : '#1a7a38';

  return (
    <CollapsiblePanel
      title="Market Data & Comps"
      icon="📡"
      badge={data ? `${(data.rentalComps?.length || 0) + (data.saleComps?.length || 0)} comps loaded` : undefined}
      open={open}
      onToggle={setOpen}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px' }}>
        <div style={{ fontSize: '12px', color: usageColor }}>
          {usage.count} / {MONTHLY_LIMIT} API calls used this month
          {remaining < 4 && <span style={{ color: '#b02020', marginLeft: '8px' }}>⚠ Limit reached</span>}
        </div>
        <button
          onClick={handleFetch}
          disabled={loading || !canFetch}
          style={{
            padding: '8px 20px',
            background: canFetch && !loading ? 'linear-gradient(135deg, #7a5400, #9a6e0c)' : '#c8b890',
            border: 'none', borderRadius: '6px',
            color: canFetch && !loading ? '#f8f3ea' : '#7a5c38',
            cursor: canFetch && !loading ? 'pointer' : 'not-allowed',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em',
            textTransform: 'uppercase', transition: 'all 0.2s',
          }}
        >
          {loading ? '⏳ Fetching…' : data ? '🔄 Refresh' : '🔍 Fetch Market Data'}
        </button>
      </div>

      {/* API errors */}
      {error && (
        <div style={{ background: '#fce0e0', border: '1px solid #d05050', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px', fontSize: '12px', color: '#b02020' }}>
          ⚠ {error}
        </div>
      )}
      {data?.partialErrors?.length > 0 && (
        <div style={{ background: '#fef3e0', border: '1px solid #d09020', borderRadius: '6px', padding: '8px 14px', marginBottom: '14px', fontSize: '11px', color: '#7a5000' }}>
          ⚠ Some endpoints failed: {data.partialErrors.join(' · ')}
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#9a7a58', fontSize: '13px' }}>
          Fetches rental comps, sale comps, AVM valuation, and market stats.<br />
          Uses 4 API calls per fetch.
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '24px', color: '#9a6e0c', fontSize: '13px' }}>
          ⏳ Fetching market data…
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Summary cards */}
          {(data.medianRent || data.avm?.price || data.market?.averageDaysOnMarket || data.medianPricePerSqft) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {data.medianRent && (
                <SummaryCard
                  label="Median Rent"
                  value={`${formatCurrency(data.medianRent)}/mo`}
                  accent="#1a7a38"
                  action="Apply to rent"
                  onAction={() => update({ wholeUnitRent: data.medianRent, rentalMode: 'unit' })}
                />
              )}
              {data.avm?.price && (
                <SummaryCard
                  label="AVM Value"
                  value={formatCurrency(data.avm.price)}
                  sub={data.avm.priceRangeLow ? `${formatCurrency(data.avm.priceRangeLow)} – ${formatCurrency(data.avm.priceRangeHigh)}` : null}
                  action="Use as ARV"
                  onAction={() => applyArv(data.avm.price)}
                />
              )}
              {data.medianSalePrice && (
                <SummaryCard
                  label="Median Sale Price"
                  value={formatCurrency(data.medianSalePrice)}
                  action="Use as ARV"
                  onAction={() => applyArv(data.medianSalePrice)}
                />
              )}
              {data.market?.averageDaysOnMarket != null && (
                <SummaryCard
                  label="Avg Days on Market"
                  value={`${data.market.averageDaysOnMarket} days`}
                  accent={data.market.averageDaysOnMarket > 60 ? '#b02020' : '#5c4028'}
                />
              )}
            </div>
          )}

          {/* Rental comps */}
          {data.rentalComps?.length > 0 && (
            <RentalCompsPanel
              comps={data.rentalComps}
              onUseRent={(r) => update({ wholeUnitRent: r, rentalMode: 'unit' })}
              medianRent={data.medianRent}
              onApplyMedian={() => update({ wholeUnitRent: data.medianRent, rentalMode: 'unit' })}
            />
          )}

          {/* Sale comps */}
          {data.saleComps?.length > 0 && (
            <SaleCompsPanel
              comps={data.saleComps}
              onUseArv={applyArv}
              medianSalePrice={data.medianSalePrice}
              onApplyMedian={() => applyArv(data.medianSalePrice)}
            />
          )}

          {/* Market stats */}
          {data.market && <MarketStatsPanel market={data.market} />}

          {/* Nothing came back */}
          {!data.rentalComps?.length && !data.saleComps?.length && !data.avm && !data.market && (
            <div style={{ textAlign: 'center', padding: '16px', color: '#9a7a58', fontSize: '13px' }}>
              No comps or market data found for this address. Try a nearby zip code or less specific address.
            </div>
          )}
        </div>
      )}
    </CollapsiblePanel>
  );
}

function SummaryCard({ label, value, sub, accent = '#9a6e0c', action, onAction }) {
  return (
    <div style={{ background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '8px', padding: '12px 14px' }}>
      <div style={{ fontSize: '10px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: accent }}>{value}</div>
      {sub && <div style={{ fontSize: '10px', color: '#9a7a58', marginTop: '2px' }}>{sub}</div>}
      {action && (
        <button onClick={onAction} style={{
          marginTop: '6px', fontSize: '10px', background: 'none', border: '1px solid #c8b890',
          borderRadius: '4px', color: '#5c4028', padding: '3px 8px', cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {action}
        </button>
      )}
    </div>
  );
}
