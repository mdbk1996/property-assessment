import { formatCurrency } from '../../utils/formatters.js';

export function RentalCompsPanel({ comps, onUseRent, medianRent, onApplyMedian }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: '#a89070', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Rental Comps ({comps.length})
        </div>
        {medianRent && (
          <button onClick={onApplyMedian} style={{ fontSize: '11px', background: '#1f1608', border: '1px solid #d4a843', borderRadius: '4px', color: '#d4a843', padding: '4px 10px', cursor: 'pointer' }}>
            Apply Median ({formatCurrency(medianRent)}/mo)
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {comps.slice(0, 8).map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080603', border: '1px solid #1a1208', borderRadius: '6px', padding: '8px 12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#a89070' }}>{c.addressLine1 || c.address || 'Unknown address'}</div>
              <div style={{ fontSize: '11px', color: '#4a3c2e' }}>
                {c.bedrooms && `${c.bedrooms}bd`} {c.bathrooms && `${c.bathrooms}ba`} {c.squareFootage && `· ${c.squareFootage.toLocaleString()} sqft`}
                {c.daysOnMarket != null && ` · ${c.daysOnMarket}d on market`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#5cba7d' }}>
                {formatCurrency(c.price || c.rent || 0)}/mo
              </div>
              <button onClick={() => onUseRent(c.price || c.rent)} style={{ fontSize: '10px', background: 'none', border: '1px solid #2a2018', borderRadius: '4px', color: '#6b5c47', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Use this
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
