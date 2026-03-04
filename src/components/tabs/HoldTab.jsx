import { SliderRow } from '../primitives/SliderRow.jsx';
import { MetricCard } from '../primitives/MetricCard.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function HoldTab({ state, update, calc }) {
  const { annualAppreciation, purchasePrice } = state;
  const {
    grossRent, vacancyLoss, monthlyMortgage, monthlyPropTax, hoa,
    insurance, maintenance, propMgmtCost, holdCashFlow, capRate,
    holdCoCReturn, annualNOI, totalCashInvested,
  } = calc;
  const { hoa: hoaVal, insurance: insVal, maintenance: maintVal } = state;

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <SliderRow
          label="Annual Appreciation"
          value={annualAppreciation}
          min={0}
          max={10}
          step={0.5}
          onChange={(v) => update({ annualAppreciation: v })}
          format={(v) => `${v}%`}
          sub={`+${formatCurrency(purchasePrice * annualAppreciation / 100)}/yr in equity`}
        />
      </div>

      {/* Monthly P&L */}
      <div style={{ background: '#080603', border: '1px solid #2a2018', borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#6b5c47', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Monthly P&L</div>
        {[
          ['Gross Rent', grossRent, true],
          ['Vacancy Loss', -vacancyLoss, false],
          ['Mortgage (P&I)', -monthlyMortgage, false],
          ['Prop Tax + Assess', -monthlyPropTax, false],
          ['HOA', -hoaVal, false],
          ['Insurance', -insVal, false],
          ['Maintenance', -maintVal, false],
          ['Property Mgmt', -propMgmtCost, false],
        ].map(([lbl, val, isIncome]) => (
          <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#6b5c47' }}>{lbl}</span>
            <span style={{ color: isIncome ? '#5cba7d' : val < 0 ? '#c07070' : '#a89070' }}>{formatCurrency(val)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #2a2018', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 600 }}>
          <span style={{ color: '#a89070' }}>Monthly Cash Flow</span>
          <span style={{ color: holdCashFlow >= 0 ? '#5cba7d' : '#e05c5c' }}>{formatCurrency(holdCashFlow)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <MetricCard label="Cash Flow" value={`${formatCurrency(holdCashFlow)}/mo`} good={holdCashFlow > 0} highlight={holdCashFlow > 0} />
        <MetricCard label="Cap Rate" value={formatPct(capRate)} good={capRate > 5} />
        <MetricCard label="CoC Return" value={formatPct(holdCoCReturn)} good={holdCoCReturn > 5} />
        <MetricCard label="Annual NOI" value={formatCurrency(annualNOI)} good={annualNOI > 0} />
      </div>

      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <MetricCard label="Total Cash Invested" value={formatCurrency(totalCashInvested)} sub="Down + Closing" />
        <MetricCard
          label="5-Year Appreciation"
          value={formatCurrency(purchasePrice * Math.pow(1 + annualAppreciation / 100, 5) - purchasePrice)}
          sub="Estimated equity gain"
        />
      </div>
    </>
  );
}
