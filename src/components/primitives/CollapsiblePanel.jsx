import { useState } from 'react';

export function CollapsiblePanel({ title, icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: '#ede6d8', border: '1px solid #c8b890', borderRadius: '10px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
          <span style={{ fontSize: '13px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{title}</span>
          {badge && (
            <span style={{ fontSize: '11px', background: '#c8b890', color: '#9a6e0c', borderRadius: '4px', padding: '2px 8px' }}>{badge}</span>
          )}
        </div>
        <span style={{ color: '#7a5c38', fontSize: '12px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '4px 20px 20px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
