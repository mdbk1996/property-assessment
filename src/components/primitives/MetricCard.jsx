export function MetricCard({ label, value, sub, highlight, good }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, #1f1608 0%, #2d1e08 100%)' : '#110e06',
      border: `1px solid ${highlight ? '#d4a843' : '#2a2018'}`,
      borderRadius: '8px',
      padding: '18px 20px',
      boxShadow: highlight ? '0 0 20px rgba(212,168,67,0.15)' : 'none',
    }}>
      <div style={{ fontSize: '11px', color: '#6b5c47', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{
        fontSize: '26px',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        color: good === undefined ? '#f0e6d0' : good ? '#5cba7d' : '#e05c5c',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#6b5c47', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}
