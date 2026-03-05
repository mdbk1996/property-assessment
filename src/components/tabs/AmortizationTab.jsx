import { formatCurrency } from '../../utils/formatters.js';

const YEAR_OPTIONS = [10, 20, 30];

export function AmortizationTab({ state, update, calc }) {
  const { amortYears } = state;
  const { amortSchedule } = calc;

  const pillStyle = (active) => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#9a6e0c' : '#c8b890'}`,
    cursor: 'pointer',
    fontSize: '12px',
    background: active ? '#ddd0b0' : 'none',
    color: active ? '#9a6e0c' : '#7a5c38',
    fontWeight: active ? 600 : 400,
  });

  const thStyle = {
    fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase',
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
            <tr style={{ borderBottom: '1px solid #c8b890' }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Year</th>
              <th style={thStyle}>Loan Balance</th>
              <th style={thStyle}>Cum. Principal</th>
              <th style={thStyle}>Cum. Cash Flow</th>
              <th style={thStyle}>Prop. Value</th>
              <th style={{ ...thStyle, color: '#9a6e0c' }}>Total Equity</th>
              <th style={{ ...thStyle, color: '#5c4028' }}>Total Return</th>
            </tr>
          </thead>
          <tbody>
            {amortSchedule.map((row) => (
              <tr
                key={row.year}
                style={{
                  borderBottom: '1px solid #e0d4bc',
                  background: row.year % 5 === 0 && row.year > 0 ? '#ede6d8' : 'none',
                }}
              >
                <td style={{ padding: '7px 12px', color: row.year === 0 ? '#7a5c38' : '#5c4028', fontWeight: row.year % 5 === 0 ? 600 : 400 }}>
                  {row.year === 0 ? 'Now' : `Yr ${row.year}`}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#5c4028' }}>{formatCurrency(row.balance)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#1a7a38' }}>{formatCurrency(row.cumPrincipal)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: row.cumCashFlow >= 0 ? '#1a7a38' : '#b02020' }}>
                  {formatCurrency(row.cumCashFlow)}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#5c4028' }}>{formatCurrency(row.propValue)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: '#9a6e0c', fontWeight: 600 }}>{formatCurrency(row.totalEquity)}</td>
                <td style={{ padding: '7px 12px', textAlign: 'right', color: row.totalReturn >= 0 ? '#1c1508' : '#b02020', fontWeight: 600 }}>
                  {formatCurrency(row.totalReturn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', fontSize: '11px', color: '#9a7a58', fontStyle: 'italic' }}>
        Total Return = Total Equity (appreciation + principal paydown) + Cumulative Cash Flow − Initial Cash Invested. Year 0 shows initial equity position.
      </div>
    </>
  );
}
