import { SectionHeader } from '../primitives/SectionHeader.jsx';
import { SliderRow } from '../primitives/SliderRow.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const ROOM_LABELS = ['Master', 'Room 2', 'Room 3', 'Room 4 (Down)', 'Room 5', 'Room 6', 'Room 7', 'Room 8', 'Room 9', 'Room 10'];

export function RentalIncomePanel({ state, update, grossRent }) {
  const { rentalMode, rooms, bedCount, wholeUnitRent } = state;

  function setRoom(i, val) {
    const next = [...rooms];
    next[i] = val;
    update({ rooms: next });
  }

  const pillStyle = (active) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    background: active ? '#9a6e0c' : 'transparent',
    color: active ? '#f8f3ea' : '#7a5c38',
  });

  return (
    <div style={{ background: '#ede6d8', border: '1px solid #c8b890', borderRadius: '10px', padding: '22px 24px' }}>
      <SectionHeader icon="🏡">Rental Income</SectionHeader>

      {/* Toggle */}
      <div style={{ display: 'flex', background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '24px', padding: '3px', marginBottom: '20px', width: 'fit-content' }}>
        <button style={pillStyle(rentalMode === 'room')} onClick={() => update({ rentalMode: 'room' })}>
          Room by Room
        </button>
        <button style={pillStyle(rentalMode === 'unit')} onClick={() => update({ rentalMode: 'unit' })}>
          Whole Unit
        </button>
      </div>

      {rentalMode === 'room' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          {Array.from({ length: bedCount }, (_, i) => (
            <SliderRow
              key={i}
              label={ROOM_LABELS[i] || `Room ${i + 1}`}
              value={rooms[i] || 600}
              min={400}
              max={2500}
              step={25}
              onChange={(v) => setRoom(i, v)}
              format={formatCurrency}
            />
          ))}
        </div>
      )}

      {rentalMode === 'unit' && (
        <SliderRow
          label="Monthly Rent"
          value={wholeUnitRent}
          min={500}
          max={10000}
          step={50}
          onChange={(v) => update({ wholeUnitRent: v })}
          format={(v) => `${formatCurrency(v)}/mo`}
        />
      )}

      <div style={{ borderTop: '1px solid #c8b890', paddingTop: '14px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gross Monthly Rent</span>
        <span style={{ fontSize: '26px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#9a6e0c' }}>{formatCurrency(grossRent)}/mo</span>
      </div>
    </div>
  );
}
