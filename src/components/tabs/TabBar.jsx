const TABS = [
  { id: 'flip',        label: '🔨 Flip' },
  { id: 'hold',        label: '📈 Hold' },
  { id: 'brrrr',       label: '♻️ BRRRR' },
  { id: 'compare',     label: '⚖️ Compare' },
  { id: 'amortize',    label: '📅 Schedule' },
  { id: 'sensitivity', label: '🔢 Sensitivity' },
];

export function TabBar({ activeTab, setActiveTab }) {
  return (
    <div style={{ borderBottom: '1px solid #c8b890', display: 'flex', flexWrap: 'wrap', gap: '0' }}>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: activeTab === t.id ? '#9a6e0c' : '#7a5c38',
            borderBottom: activeTab === t.id ? '2px solid #9a6e0c' : '2px solid transparent',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
