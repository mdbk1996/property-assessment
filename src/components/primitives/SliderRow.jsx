export function SliderRow({ label, value, min, max, step, onChange, format, sub }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#a89070', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif" }}>{label}</span>
        <span style={{ fontSize: '20px', color: '#f0e6d0', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{format(value)}</span>
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#6b5c47', marginBottom: '6px' }}>{sub}</div>}
      <div style={{ position: 'relative', height: '4px', background: '#2a2018', borderRadius: '2px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #8b6914, #d4a843)', borderRadius: '2px' }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', top: '-8px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '20px', zIndex: 2 }}
        />
        <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', width: '14px', height: '14px', borderRadius: '50%', background: '#d4a843', border: '2px solid #1a1208', pointerEvents: 'none', zIndex: 1 }} />
      </div>
    </div>
  );
}
