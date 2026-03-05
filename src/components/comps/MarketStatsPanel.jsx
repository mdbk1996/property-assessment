import { formatCurrency, formatPct1 } from '../../utils/formatters.js';

export function MarketStatsPanel({ market }) {
  if (!market) return null;

  const stats = [
    market.averageDaysOnMarket != null && { label: 'Avg Days on Market', value: `${market.averageDaysOnMarket} days`, accent: market.averageDaysOnMarket > 60 ? '#b02020' : '#5c4028' },
    market.medianListPrice && { label: 'Median List Price', value: formatCurrency(market.medianListPrice) },
    market.priceAppreciation != null && { label: 'Price Trend (YoY)', value: (market.priceAppreciation >= 0 ? '+' : '') + formatPct1(market.priceAppreciation), accent: market.priceAppreciation < 0 ? '#b02020' : '#1a7a38' },
    market.vacancyRate != null && { label: 'Vacancy Rate', value: formatPct1(market.vacancyRate), accent: market.vacancyRate > 10 ? '#b02020' : '#5c4028' },
  ].filter(Boolean);

  if (stats.length === 0) return null;

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Market Statistics</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#e4dccb', border: '1px solid #e0d4bc', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: s.accent || '#9a6e0c' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
