import { formatCurrency } from '../../utils/formatters.js';

export function RentalCompsPanel({ comps, onUseRent, medianRent, onApplyMedian }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Rental Comps ({comps.length})
        </div>
        {medianRent && (
          <button onClick={onApplyMedian} style={{ fontSize: '11px', background: '#ddd0b0', border: '1px solid #9a6e0c', borderRadius: '4px', color: '#9a6e0c', padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>
            Apply Median ({formatCurrency(medianRent)}/mo)
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {comps.map((c, i) => {
          const rent = c._rent || c.price || c.rent || 0;
          const addr = c._address || 'Unknown address';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f3ea', border: '1px solid #c8b890', borderRadius: '6px', padding: '10px 14px' }}>
              <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
                <div style={{ fontSize: '13px', color: '#1c1508', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{addr}</div>
                <div style={{ fontSize: '11px', color: '#9a7a58', marginTop: '2px' }}>
                  {c.bedrooms != null && `${c.bedrooms} bd`}
                  {c.bathrooms != null && ` · ${c.bathrooms} ba`}
                  {c.squareFootage && ` · ${c.squareFootage.toLocaleString()} sqft`}
                  {c.daysOnMarket != null && ` · ${c.daysOnMarket}d on market`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ fontSize: '17px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#1a7a38' }}>
                  {formatCurrency(rent)}/mo
                </div>
                <button
                  onClick={() => onUseRent(rent)}
                  style={{ fontSize: '10px', background: '#ddd0b0', border: '1px solid #9a6e0c', borderRadius: '4px', color: '#7a5000', padding: '4px 8px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
                >
                  Use this
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
