import { formatCurrency, formatPct1 } from '../../utils/formatters.js';

export function MarketStatsPanel({ market }) {
  if (!market) return null;

  const stats = [
    market.averageDaysOnMarket != null && { label: 'Avg Days on Market', value: `${market.averageDaysOnMarket} days`, accent: market.averageDaysOnMarket > 60 ? '#e05c5c' : '#a89070' },
    market.medianListPrice && { label: 'Median List Price', value: formatCurrency(market.medianListPrice) },
    market.priceAppreciation != null && { label: 'Price Trend (YoY)', value: (market.priceAppreciation >= 0 ? '+' : '') + formatPct1(market.priceAppreciation), accent: market.priceAppreciation < 0 ? '#e05c5c' : '#5cba7d' },
    market.vacancyRate != null && { label: 'Vacancy Rate', value: formatPct1(market.vacancyRate), accent: market.vacancyRate > 10 ? '#e05c5c' : '#a89070' },
  ].filter(Boolean);

  if (stats.length === 0) return null;

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#a89070', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Market Statistics</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#080603', border: '1px solid #1a1208', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', color: '#6b5c47', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: s.accent || '#d4a843' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
