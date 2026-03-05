export function SectionHeader({ children, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #c8b890' }}>
      {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      <span style={{ fontSize: '13px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{children}</span>
    </div>
  );
}
