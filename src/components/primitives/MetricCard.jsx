export function MetricCard({ label, value, sub, highlight, good }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, #261a0a 0%, #332209 100%)' : '#151208',
      border: `1px solid ${highlight ? '#f5c444' : '#352a1a'}`,
      borderRadius: '8px',
      padding: '18px 20px',
      boxShadow: highlight ? '0 0 20px rgba(212,168,67,0.15)' : 'none',
    }}>
      <div style={{ fontSize: '11px', color: '#8a7458', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{
        fontSize: '26px',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        color: good === undefined ? '#f8f2e4' : good ? '#52d68c' : '#f06464',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#8a7458', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}
