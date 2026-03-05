import { SectionHeader } from '../primitives/SectionHeader.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const inputStyle = {
  background: '#e4dccb',
  border: '1px solid #c8b890',
  borderRadius: '6px',
  color: '#1c1508',
  fontSize: '14px',
  padding: '8px 12px',
  width: '100%',
  fontFamily: "'Nunito', sans-serif",
  outline: 'none',
};

const labelStyle = {
  fontSize: '11px',
  color: '#7a5c38',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '5px',
  display: 'block',
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Stepper({ value, min, max, step, onChange, format }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={() => onChange(Math.max(min, parseFloat((value - step).toFixed(1))))}
        style={{ ...inputStyle, width: '32px', padding: '6px', textAlign: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '16px' }}
      >−</button>
      <div style={{ ...inputStyle, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600 }}>
        {format ? format(value) : value}
      </div>
      <button
        onClick={() => onChange(Math.min(max, parseFloat((value + step).toFixed(1))))}
        style={{ ...inputStyle, width: '32px', padding: '6px', textAlign: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '16px' }}
      >+</button>
    </div>
  );
}

export function PropertyForm({ state, update }) {
  const { address, city, zip, bedCount, bathCount, sqft, listingPrice } = state;

  function handleListingPriceChange(e) {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
    update({ listingPrice: val, purchasePrice: val });
  }

  return (
    <div style={{ background: '#ede6d8', border: '1px solid #c8b890', borderRadius: '10px', padding: '22px 24px' }}>
      <SectionHeader icon="📍">Property Details</SectionHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label="Street Address">
          <input
            style={inputStyle}
            value={address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder="123 Main St"
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px' }}>
          <Field label="City">
            <input
              style={inputStyle}
              value={city}
              onChange={(e) => update({ city: e.target.value })}
              placeholder="City"
            />
          </Field>
          <Field label="ZIP">
            <input
              style={inputStyle}
              value={zip}
              onChange={(e) => update({ zip: e.target.value })}
              placeholder="00000"
              maxLength={5}
            />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <Field label="Beds">
            <Stepper value={bedCount} min={1} max={10} step={1} onChange={(v) => update({ bedCount: v })} />
          </Field>
          <Field label="Baths">
            <Stepper value={bathCount} min={1} max={10} step={0.5} onChange={(v) => update({ bathCount: v })} format={(v) => v % 1 === 0 ? `${v}` : `${v}`} />
          </Field>
          <Field label="Sq Ft">
            <input
              style={{ ...inputStyle, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', fontWeight: 600 }}
              value={sqft}
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                update({ sqft: v });
              }}
            />
          </Field>
        </div>

        <Field label="Listing Price">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5c4028', fontSize: '14px' }}>$</span>
            <input
              style={{ ...inputStyle, paddingLeft: '24px', fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 700, color: '#9a6e0c' }}
              value={listingPrice ? listingPrice.toLocaleString() : ''}
              onChange={handleListingPriceChange}
              placeholder="0"
            />
          </div>
          <div style={{ fontSize: '11px', color: '#7a5c38', marginTop: '4px' }}>
            Sets purchase price slider range (±30%)
          </div>
        </Field>
      </div>
    </div>
  );
}
