import { formatCurrency } from '../../utils/formatters.js';

export function SaleCompsPanel({ comps, onUseArv, medianSalePrice, onApplyMedian }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Sale Comps ({comps.length})
        </div>
        {medianSalePrice && (
          <button onClick={onApplyMedian} style={{ fontSize: '11px', background: '#ddd0b0', border: '1px solid #9a6e0c', borderRadius: '4px', color: '#9a6e0c', padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>
            Apply Median ({formatCurrency(medianSalePrice)})
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {comps.map((c, i) => {
          const price = c.price || 0;
          const addr = c._address || 'Unknown address';
          const ppsf = price && c.squareFootage ? Math.round(price / c.squareFootage) : null;
          const soldDate = c.listedDate || c.soldDate || c.lastSoldDate;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f3ea', border: '1px solid #c8b890', borderRadius: '6px', padding: '10px 14px' }}>
              <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
                <div style={{ fontSize: '13px', color: '#1c1508', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{addr}</div>
                <div style={{ fontSize: '11px', color: '#9a7a58', marginTop: '2px' }}>
                  {c.bedrooms != null && `${c.bedrooms} bd`}
                  {c.bathrooms != null && ` · ${c.bathrooms} ba`}
                  {c.squareFootage && ` · ${c.squareFootage.toLocaleString()} sqft`}
                  {soldDate && ` · ${new Date(soldDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}`}
                  {c.daysOnMarket != null && ` · ${c.daysOnMarket}d DOM`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '17px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#9a6e0c' }}>
                    {formatCurrency(price)}
                  </div>
                  {ppsf && <div style={{ fontSize: '10px', color: '#7a5c38' }}>${ppsf}/sqft</div>}
                </div>
                <button
                  onClick={() => onUseArv(price)}
                  style={{ fontSize: '10px', background: '#ddd0b0', border: '1px solid #9a6e0c', borderRadius: '4px', color: '#7a5000', padding: '4px 8px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
                >
                  Use as ARV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
