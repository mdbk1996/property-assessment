import { formatCurrency } from '../../utils/formatters.js';

const YEAR_OPTIONS = [10, 20, 30];

export function AmortizationTab({ state, update, calc }) {
  const { amortYears } = state;
  const { amortSchedule } = calc;

  const pillStyle = (active) => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#f5c444' : '#352a1a'}`,
    cursor: 'pointer',
    fontSize: '12px',
    background: active ? '#261a0a' : 'none',
    color: active ? '#f5c444' : '#8a7458',
    fontWeight: active ? 600 : 400,
  });

  const thStyle = {
    fontSize: '11px', color: '#8a7458', textTransform: 'uppercase',
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
            <tr style={{ borderBottom: '1px solid #352a1a' }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Year</th>
              <th style={thStyle}>Loan Balance</th>
              <th style={thStyle}>Cum. Principal</th>
              <th style={thStyle}>Cum. Cash Flow</th>
              <th style={thStyle}>Prop. Value</th>
              <th style={{ ...thStyle, color: '#f5c444' }}>Total Equity</th>
              <th style={{ ...thStyle, color: '#c8a87a' }}>Total Return</th>
            </tr>
          </thead>
          <tbody>
            {amortSchedule.map((row) => (
              <tr
                key={row.year}
                style={{
                  borderBottom: '1px solid #1e160a',
                  background: row.year % 5 === 0 && row.year > 0 ? '#181410' : 'none',
                }}
              >
                <td style={{ padding: '7px 12px', color: row.year === 0 ? '#8a7458' : '#c8a87a', fontWeight: row.year % 5 === 0 ? 600 : 400 }}>
                  {row.year === 0 ? 'Now' : `Yr ${row.year}`}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#c8a87a' }}>{formatCurrency(row.balance)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#52d68c' }}>{formatCurrency(row.cumPrincipal)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: row.cumCashFlow >= 0 ? '#52d68c' : '#f06464' }}>
                  {formatCurrency(row.cumCashFlow)}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#c8a87a' }}>{formatCurrency(row.propValue)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#f5c444', fontWeight: 600 }}>{formatCurrency(row.totalEquity)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: row.totalReturn >= 0 ? '#f8f2e4' : '#f06464', fontWeight: 600 }}>
                  {formatCurrency(row.totalReturn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', fontSize: '11px', color: '#6a5848', fontStyle: 'italic' }}>
        Total Return = Total Equity (appreciation + principal paydown) + Cumulative Cash Flow − Initial Cash Invested. Year 0 shows initial equity position.
      </div>
    </>
  );
}
