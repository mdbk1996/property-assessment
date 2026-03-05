export function MetricCard({ label, value, sub, highlight, good }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, #ddd0b0 0%, #d8c8a0 100%)' : '#e8e0cf',
      border: `1px solid ${highlight ? '#9a6e0c' : '#c8b890'}`,
      borderRadius: '8px',
      padding: '18px 20px',
      boxShadow: highlight ? '0 0 20px rgba(154,110,12,0.18)' : 'none',
    }}>
      <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{
        fontSize: '26px',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        color: good === undefined ? '#1c1508' : good ? '#1a7a38' : '#b02020',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#7a5c38', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}
