import { useState } from 'react';

export function CollapsiblePanel({ title, icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: '#0e0b06', border: '1px solid #2a2018', borderRadius: '10px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
          <span style={{ fontSize: '13px', color: '#a89070', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{title}</span>
          {badge && (
            <span style={{ fontSize: '11px', background: '#2a2018', color: '#d4a843', borderRadius: '4px', padding: '2px 8px' }}>{badge}</span>
          )}
        </div>
        <span style={{ color: '#6b5c47', fontSize: '12px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '4px 20px 20px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
