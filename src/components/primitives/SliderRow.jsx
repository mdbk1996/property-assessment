import { useState } from 'react';

export function SliderRow({ label, value, min, max, step, onChange, format, sub }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  function startEdit() {
    setInputVal(String(value));
    setEditing(true);
  }

  function commitEdit() {
    const parsed = parseFloat(inputVal.replace(/[^0-9.\-]/g, ''));
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      const stepped = Math.round(clamped / step) * step;
      onChange(parseFloat(stepped.toFixed(10)));
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(max, value + step);
      onChange(parseFloat(next.toFixed(10)));
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(min, value - step);
      onChange(parseFloat(next.toFixed(10)));
    }
  }

  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#5c4028', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif" }}>
          {label}
        </span>

        {editing ? (
          <input
            autoFocus
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: '18px',
              color: '#1c1508',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              background: '#e0d4bc',
              border: '1px solid #9a6e0c',
              borderRadius: '4px',
              padding: '2px 8px',
              width: '120px',
              textAlign: 'right',
              outline: 'none',
            }}
          />
        ) : (
          <span
            onClick={startEdit}
            title="Click to type a value"
            style={{
              fontSize: '20px',
              color: '#1c1508',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              cursor: 'text',
              borderBottom: '1px dashed #c8b890',
              paddingBottom: '1px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#9a6e0c'}
            onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = '#c8b890'}
          >
            {format(value)}
          </span>
        )}
      </div>

      {sub && <div style={{ fontSize: '11px', color: '#7a5c38', marginBottom: '6px' }}>{sub}</div>}

      <div style={{ position: 'relative', height: '4px', background: '#c8b890', borderRadius: '2px' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #7a5400, #9a6e0c)', borderRadius: '2px',
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', top: '-8px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '20px', zIndex: 2 }}
        />
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          background: '#9a6e0c', border: '2px solid #f8f3ea',
          pointerEvents: 'none', zIndex: 1,
        }} />
      </div>
    </div>
  );
}
