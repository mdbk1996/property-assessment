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
        <span style={{ fontSize: '13px', color: '#c8a87a', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif" }}>
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
              color: '#f8f2e4',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              background: '#1e160a',
              border: '1px solid #f5c444',
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
              color: '#f8f2e4',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              cursor: 'text',
              borderBottom: '1px dashed #352a1a',
              paddingBottom: '1px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#f5c444'}
            onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = '#352a1a'}
          >
            {format(value)}
          </span>
        )}
      </div>

      {sub && <div style={{ fontSize: '11px', color: '#8a7458', marginBottom: '6px' }}>{sub}</div>}

      <div style={{ position: 'relative', height: '4px', background: '#352a1a', borderRadius: '2px' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #c49020, #f5c444)', borderRadius: '2px',
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
          background: '#f5c444', border: '2px solid #111009',
          pointerEvents: 'none', zIndex: 1,
        }} />
      </div>
    </div>
  );
}
