import { formatCurrency } from '../../utils/formatters.js';

export function RentalCompsPanel({ comps, onUseRent, medianRent, onApplyMedian }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Rental Comps ({comps.length})
        </div>
        {medianRent && (
          <button onClick={onApplyMedian} style={{ fontSize: '11px', background: '#ddd0b0', border: '1px solid #9a6e0c', borderRadius: '4px', color: '#9a6e0c', padding: '4px 10px', cursor: 'pointer' }}>
            Apply Median ({formatCurrency(medianRent)}/mo)
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {comps.slice(0, 8).map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e4dccb', border: '1px solid #e0d4bc', borderRadius: '6px', padding: '8px 12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#5c4028' }}>{c.addressLine1 || c.address || 'Unknown address'}</div>
              <div style={{ fontSize: '11px', color: '#9a7a58' }}>
                {c.bedrooms && `${c.bedrooms}bd`} {c.bathrooms && `${c.bathrooms}ba`} {c.squareFootage && `· ${c.squareFootage.toLocaleString()} sqft`}
                {c.daysOnMarket != null && ` · ${c.daysOnMarket}d on market`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#1a7a38' }}>
                {formatCurrency(c.price || c.rent || 0)}/mo
              </div>
              <button onClick={() => onUseRent(c.price || c.rent)} style={{ fontSize: '10px', background: 'none', border: '1px solid #c8b890', borderRadius: '4px', color: '#7a5c38', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Use this
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
