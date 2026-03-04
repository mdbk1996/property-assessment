import { formatCurrency } from '../../utils/formatters.js';

export function SaleCompsPanel({ comps, onUseArv, medianPricePerSqft, onApplyMedian }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: '#a89070', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Sale Comps ({comps.length})
        </div>
        {medianPricePerSqft && (
          <button onClick={onApplyMedian} style={{ fontSize: '11px', background: '#1f1608', border: '1px solid #d4a843', borderRadius: '4px', color: '#d4a843', padding: '4px 10px', cursor: 'pointer' }}>
            Apply Median (${Math.round(medianPricePerSqft)}/sqft)
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {comps.slice(0, 8).map((c, i) => {
          const ppsf = c.price && c.squareFootage ? Math.round(c.price / c.squareFootage) : null;
          const soldDate = c.listedDate || c.soldDate;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080603', border: '1px solid #1a1208', borderRadius: '6px', padding: '8px 12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#a89070' }}>{c.addressLine1 || c.address || 'Unknown address'}</div>
                <div style={{ fontSize: '11px', color: '#4a3c2e' }}>
                  {c.bedrooms && `${c.bedrooms}bd`} {c.bathrooms && `${c.bathrooms}ba`} {c.squareFootage && `· ${c.squareFootage.toLocaleString()} sqft`}
                  {soldDate && ` · ${new Date(soldDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}`}
                  {c.daysOnMarket != null && ` · ${c.daysOnMarket}d DOM`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#d4a843' }}>
                    {formatCurrency(c.price || 0)}
                  </div>
                  {ppsf && <div style={{ fontSize: '10px', color: '#6b5c47' }}>${ppsf}/sqft</div>}
                </div>
                <button onClick={() => onUseArv(c.price)} style={{ fontSize: '10px', background: 'none', border: '1px solid #2a2018', borderRadius: '4px', color: '#6b5c47', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
