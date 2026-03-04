import { formatCurrency } from '../../utils/formatters.js';

export function RentalCompsPanel({ comps, onUseRent, medianRent, onApplyMedian }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: '#c8a87a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Rental Comps ({comps.length})
        </div>
        {medianRent && (
          <button onClick={onApplyMedian} style={{ fontSize: '11px', background: '#261a0a', border: '1px solid #f5c444', borderRadius: '4px', color: '#f5c444', padding: '4px 10px', cursor: 'pointer' }}>
            Apply Median ({formatCurrency(medianRent)}/mo)
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {comps.slice(0, 8).map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#100e09', border: '1px solid #1e160a', borderRadius: '6px', padding: '8px 12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#c8a87a' }}>{c.addressLine1 || c.address || 'Unknown address'}</div>
              <div style={{ fontSize: '11px', color: '#6a5848' }}>
                {c.bedrooms && `${c.bedrooms}bd`} {c.bathrooms && `${c.bathrooms}ba`} {c.squareFootage && `· ${c.squareFootage.toLocaleString()} sqft`}
                {c.daysOnMarket != null && ` · ${c.daysOnMarket}d on market`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#52d68c' }}>
                {formatCurrency(c.price || c.rent || 0)}/mo
              </div>
              <button onClick={() => onUseRent(c.price || c.rent)} style={{ fontSize: '10px', background: 'none', border: '1px solid #352a1a', borderRadius: '4px', color: '#8a7458', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Use this
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
