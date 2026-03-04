import { formatCurrency } from '../../utils/formatters.js';

const YEAR_OPTIONS = [10, 20, 30];

export function AmortizationTab({ state, update, calc }) {
  const { amortYears } = state;
  const { amortSchedule } = calc;

  const pillStyle = (active) => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#d4a843' : '#2a2018'}`,
    cursor: 'pointer',
    fontSize: '12px',
    background: active ? '#1f1608' : 'none',
    color: active ? '#d4a843' : '#6b5c47',
    fontWeight: active ? 600 : 400,
  });

  const thStyle = {
    fontSize: '11px', color: '#6b5c47', textTransform: 'uppercase',
    letterSpacing: '0.06em', padding: '8px 12px', textAlign: 'right',
    fontWeight: 500,
  };

  return (
    <>
      {/* Year selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {YEAR_OPTIONS.map((y) => (
          <button key={y} style={pillStyle(amortYears === y)} onClick={() => update({ amortYears: y })}>
            {y} Years
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2018' }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Year</th>
              <th style={thStyle}>Loan Balance</th>
              <th style={thStyle}>Cum. Principal</th>
              <th style={thStyle}>Cum. Cash Flow</th>
              <th style={thStyle}>Prop. Value</th>
              <th style={{ ...thStyle, color: '#d4a843' }}>Total Equity</th>
              <th style={{ ...thStyle, color: '#a89070' }}>Total Return</th>
            </tr>
          </thead>
          <tbody>
            {amortSchedule.map((row) => (
              <tr
                key={row.year}
                style={{
                  borderBottom: '1px solid #1a1208',
                  background: row.year % 5 === 0 && row.year > 0 ? '#0e0b06' : 'none',
                }}
              >
                <td style={{ padding: '7px 12px', color: row.year === 0 ? '#6b5c47' : '#a89070', fontWeight: row.year % 5 === 0 ? 600 : 400 }}>
                  {row.year === 0 ? 'Now' : `Yr ${row.year}`}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#a89070' }}>{formatCurrency(row.balance)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#5cba7d' }}>{formatCurrency(row.cumPrincipal)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: row.cumCashFlow >= 0 ? '#5cba7d' : '#e05c5c' }}>
                  {formatCurrency(row.cumCashFlow)}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#a89070' }}>{formatCurrency(row.propValue)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#d4a843', fontWeight: 600 }}>{formatCurrency(row.totalEquity)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: row.totalReturn >= 0 ? '#f0e6d0' : '#e05c5c', fontWeight: 600 }}>
                  {formatCurrency(row.totalReturn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', fontSize: '11px', color: '#4a3c2e', fontStyle: 'italic' }}>
        Total Return = Total Equity (appreciation + principal paydown) + Cumulative Cash Flow − Initial Cash Invested. Year 0 shows initial equity position.
      </div>
    </>
  );
}
