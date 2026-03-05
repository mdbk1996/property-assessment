import { formatCurrency } from '../../utils/formatters.js';

export function Header({ state, calc, onSave, onShowSaved, onPrint }) {
  const { address, city, state: stateAbbr, zip, bedCount, bathCount, sqft, purchasePrice } = state;

  const locationLine = [city, stateAbbr, zip].filter(Boolean).join(', ');
  const detailLine = [
    bedCount && `${bedCount} bed`,
    bathCount && `${bathCount} bath`,
    sqft && `${sqft.toLocaleString()} sqft`,
  ].filter(Boolean).join(' / ');

  return (
    <div style={{ borderBottom: '1px solid #c8b890', padding: '20px 32px', background: '#ede6d8' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7a5c38', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Property Investment Analysis
          </div>
          <div style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#1c1508', lineHeight: 1.1 }}>
            {address || 'Enter an address'}
          </div>
          {(locationLine || detailLine) && (
            <div style={{ fontSize: '13px', color: '#5c4028', marginTop: '3px' }}>
              {locationLine}{locationLine && detailLine ? ' · ' : ''}{detailLine}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={onShowSaved} style={btnStyle('#c8b890', '#5c4028')}>
              📁 Saved
            </button>
            <button onClick={onSave} style={btnStyle('#ddd0b0', '#9a6e0c')}>
              💾 Save Analysis
            </button>
            <button onClick={onPrint} style={btnStyle('#c8b890', '#5c4028')}>
              🖨 Print PDF
            </button>
          </div>

          {/* Price */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#7a5c38', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Purchase Price</div>
            <div style={{ fontSize: '32px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#9a6e0c' }}>
              {formatCurrency(purchasePrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    padding: '7px 14px',
    background: bg,
    border: `1px solid ${color}`,
    borderRadius: '6px',
    color,
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  };
}
