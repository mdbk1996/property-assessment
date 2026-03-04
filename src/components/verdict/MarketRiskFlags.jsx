export function MarketRiskFlags({ marketData }) {
  if (!marketData) return null;

  const flags = [];

  if (marketData.averageDaysOnMarket > 60) {
    flags.push({
      icon: '⚠️',
      message: `Slow market — ${marketData.averageDaysOnMarket}d avg DOM may extend flip hold period`,
    });
  }

  if (marketData.priceAppreciation != null && marketData.priceAppreciation < 0) {
    flags.push({
      icon: '📉',
      message: `Declining values (${marketData.priceAppreciation.toFixed(1)}% YoY) — ARV assumptions may not hold`,
    });
  }

  if (marketData.vacancyRate != null && marketData.vacancyRate > 10) {
    flags.push({
      icon: '🏚',
      message: `High vacancy (${marketData.vacancyRate.toFixed(1)}%) — consider reducing rent assumptions`,
    });
  }

  if (flags.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      {flags.map((f, i) => (
        <div key={i} style={{ background: '#1a0e08', border: '1px solid #5c3a1a', borderRadius: '6px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px', color: '#f5c444' }}>
          <span style={{ flexShrink: 0 }}>{f.icon}</span>
          <span>{f.message}</span>
        </div>
      ))}
    </div>
  );
}
