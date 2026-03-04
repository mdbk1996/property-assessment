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
    <div style={{ borderBottom: '1px solid #2a2018', padding: '20px 32px', background: '#0e0b06' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#6b5c47', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Property Investment Analysis
          </div>
          <div style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#f0e6d0', lineHeight: 1.1 }}>
            {address || 'Enter an address'}
          </div>
          {(locationLine || detailLine) && (
            <div style={{ fontSize: '13px', color: '#a89070', marginTop: '3px' }}>
              {locationLine}{locationLine && detailLine ? ' · ' : ''}{detailLine}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={onShowSaved} style={btnStyle('#2a2018', '#a89070')}>
              📁 Saved
            </button>
            <button onClick={onSave} style={btnStyle('#1f1608', '#d4a843')}>
              💾 Save Analysis
            </button>
            <button onClick={onPrint} style={btnStyle('#2a2018', '#a89070')}>
              🖨 Print PDF
            </button>
          </div>

          {/* Price */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6b5c47', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Purchase Price</div>
            <div style={{ fontSize: '32px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#d4a843' }}>
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
