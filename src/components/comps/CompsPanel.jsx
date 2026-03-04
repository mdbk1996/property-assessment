import { useState } from 'react';
import { CollapsiblePanel } from '../primitives/CollapsiblePanel.jsx';
import { RentalCompsPanel } from './RentalCompsPanel.jsx';
import { SaleCompsPanel } from './SaleCompsPanel.jsx';
import { MarketStatsPanel } from './MarketStatsPanel.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function CompsPanel({ state, update, rentcastHook }) {
  const { data, loading, error, usage, remaining, canFetch, fetchAll, MONTHLY_LIMIT } = rentcastHook;
  const { address, city, zip, bedCount } = state;

  function handleFetch() {
    fetchAll({ address, city, state: state.state, zip, bedCount });
  }

  const usageColor = remaining <= 10 ? '#e05c5c' : remaining <= 20 ? '#d4a843' : '#5cba7d';

  return (
    <CollapsiblePanel
      title="Market Data & Comps"
      icon="📡"
      badge={data ? 'Data loaded' : undefined}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px' }}>
        <div style={{ fontSize: '12px', color: usageColor }}>
          {usage.count} / {MONTHLY_LIMIT} calls used this month
          {remaining < 4 && <span style={{ color: '#e05c5c', marginLeft: '8px' }}>⚠ Limit reached</span>}
        </div>
        <button
          onClick={handleFetch}
          disabled={loading || !canFetch}
          style={{
            padding: '8px 20px',
            background: canFetch && !loading ? 'linear-gradient(135deg, #8b6914, #d4a843)' : '#2a2018',
            border: 'none',
            borderRadius: '6px',
            color: canFetch && !loading ? '#0c0a05' : '#6b5c47',
            cursor: canFetch && !loading ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '⏳ Fetching…' : '🔍 Fetch Market Data'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#1a0808', border: '1px solid #5c1a1a', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px', fontSize: '12px', color: '#e05c5c' }}>
          ⚠ {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#4a3c2e', fontSize: '13px' }}>
          Fetches rental comps, sale comps, AVM valuation, and market stats for {address || 'the entered address'}.
          <br />
          Uses 4 API calls per fetch.
        </div>
      )}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {data.medianRent && (
              <SummaryCard label="Median Rent" value={formatCurrency(data.medianRent) + '/mo'} accent="#5cba7d"
                action="Use" onAction={() => update({ wholeUnitRent: data.medianRent, rentalMode: 'unit' })} />
            )}
            {data.avm?.price && (
              <SummaryCard label="AVM Value" value={formatCurrency(data.avm.price)}
                sub={data.avm.priceRangeLow ? `${formatCurrency(data.avm.priceRangeLow)} – ${formatCurrency(data.avm.priceRangeHigh)}` : null}
                action="Use as ARV"
                onAction={() => update({ arvPerSqft: state.sqft > 0 ? Math.round(data.avm.price / state.sqft) : state.arvPerSqft })}
              />
            )}
            {data.market?.averageDaysOnMarket && (
              <SummaryCard label="Avg DOM" value={`${data.market.averageDaysOnMarket} days`}
                accent={data.market.averageDaysOnMarket > 60 ? '#e05c5c' : '#a89070'} />
            )}
            {data.medianPricePerSqft && (
              <SummaryCard label="Median $/sqft" value={`$${Math.round(data.medianPricePerSqft)}/sqft`}
                action="Use as ARV/sqft"
                onAction={() => update({ arvPerSqft: Math.round(data.medianPricePerSqft) })}
              />
            )}
          </div>

          {data.rentalComps?.length > 0 && <RentalCompsPanel comps={data.rentalComps} onUseRent={(r) => update({ wholeUnitRent: r, rentalMode: 'unit' })} medianRent={data.medianRent} onApplyMedian={() => update({ wholeUnitRent: data.medianRent, rentalMode: 'unit' })} />}
          {data.saleComps?.length > 0 && <SaleCompsPanel comps={data.saleComps} onUseArv={(price) => update({ arvPerSqft: state.sqft > 0 ? Math.round(price / state.sqft) : state.arvPerSqft })} medianPricePerSqft={data.medianPricePerSqft} onApplyMedian={() => update({ arvPerSqft: data.medianPricePerSqft ? Math.round(data.medianPricePerSqft) : state.arvPerSqft })} />}
          {data.market && <MarketStatsPanel market={data.market} />}
        </div>
      )}
    </CollapsiblePanel>
  );
}

function SummaryCard({ label, value, sub, accent = '#d4a843', action, onAction }) {
  return (
    <div style={{ background: '#080603', border: '1px solid #2a2018', borderRadius: '8px', padding: '12px 14px' }}>
      <div style={{ fontSize: '10px', color: '#6b5c47', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: accent }}>{value}</div>
      {sub && <div style={{ fontSize: '10px', color: '#4a3c2e', marginTop: '2px' }}>{sub}</div>}
      {action && (
        <button onClick={onAction} style={{
          marginTop: '6px', fontSize: '10px', background: 'none', border: '1px solid #2a2018',
          borderRadius: '4px', color: '#a89070', padding: '3px 8px', cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {action}
        </button>
      )}
    </div>
  );
}
