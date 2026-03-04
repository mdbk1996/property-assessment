import { SliderRow } from '../primitives/SliderRow.jsx';
import { MetricCard } from '../primitives/MetricCard.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function BrrrrTab({ state, update, calc }) {
  const { brrrrRefiLTV, brrrrRefiRate, brrrrRefiTermYears } = state;
  const { brrrr, rehabCost, arv, loanAmount, totalCashInvested } = calc;

  const {
    totalCashIn, refiLoanAmount, cashPulledOut, refiPayment,
    postRefiCashFlow, remainingCapital, effectiveCoC, equityInDeal, fullRecovery,
  } = brrrr;

  const steps = [
    { icon: '🏠', label: 'Buy', detail: `Purchase + Close + Down`, value: formatCurrency(totalCashInvested) },
    { icon: '🔨', label: 'Rehab', detail: `Renovation cost`, value: formatCurrency(rehabCost) },
    { icon: '🏦', label: 'Refi', detail: `${brrrrRefiLTV}% LTV on ARV ${formatCurrency(arv)}`, value: formatCurrency(refiLoanAmount) },
    { icon: '💵', label: 'Cash Out', detail: `Refi loan − original loan`, value: (cashPulledOut >= 0 ? '+' : '') + formatCurrency(cashPulledOut) },
    { icon: '📈', label: 'Cash Flow', detail: `Rent − OpEx − refi payment`, value: `${formatCurrency(postRefiCashFlow)}/mo` },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginBottom: '20px' }}>
        <SliderRow
          label="Refi LTV"
          value={brrrrRefiLTV}
          min={50}
          max={85}
          step={1}
          onChange={(v) => update({ brrrrRefiLTV: v })}
          format={(v) => `${v}%`}
          sub={`Refi loan: ${formatCurrency(arv * brrrrRefiLTV / 100)}`}
        />
        <SliderRow
          label="Refi Rate"
          value={brrrrRefiRate}
          min={4}
          max={12}
          step={0.125}
          onChange={(v) => update({ brrrrRefiRate: v })}
          format={(v) => `${v.toFixed(3)}%`}
        />
        <SliderRow
          label="Refi Term"
          value={brrrrRefiTermYears}
          min={10}
          max={30}
          step={5}
          onChange={(v) => update({ brrrrRefiTermYears: v })}
          format={(v) => `${v} yr`}
        />
      </div>

      {/* Step-by-step breakdown */}
      <div style={{ background: '#080603', border: '1px solid #2a2018', borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#6b5c47', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>BRRRR Breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a1208', border: '1px solid #2a2018', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#a89070', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: '#4a3c2e' }}>{s.detail}</div>
              </div>
              <div style={{ fontSize: '16px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: s.label === 'Cash Out' && cashPulledOut >= 0 ? '#5cba7d' : '#f0e6d0' }}>
                {s.value}
              </div>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', left: '35px', marginTop: '32px', width: '2px', height: '10px', background: '#2a2018' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Recovery Badge */}
      {fullRecovery && (
        <div style={{ background: 'linear-gradient(135deg, #0a1f0a, #0d2a0d)', border: '1px solid #5cba7d', borderRadius: '8px', padding: '14px 20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>✅</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#5cba7d', fontSize: '18px' }}>Full Capital Recovery</div>
          <div style={{ fontSize: '12px', color: '#3a6b3a', marginTop: '4px' }}>All cash pulled back out — infinite CoC return</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <MetricCard
          label="Cash Pulled Out"
          value={formatCurrency(cashPulledOut)}
          good={cashPulledOut >= 0}
          highlight={cashPulledOut >= totalCashIn}
        />
        <MetricCard
          label={fullRecovery ? 'CoC Return' : 'Effective CoC'}
          value={fullRecovery ? '∞' : formatPct(effectiveCoC)}
          sub={fullRecovery ? 'Full recovery' : `${formatCurrency(remainingCapital)} left in`}
          good={fullRecovery || effectiveCoC > 8}
        />
        <MetricCard label="Post-Refi Cash Flow" value={`${formatCurrency(postRefiCashFlow)}/mo`} good={postRefiCashFlow > 0} />
        <MetricCard label="Equity in Deal" value={formatCurrency(equityInDeal)} />
        <MetricCard label="Refi Payment" value={`${formatCurrency(refiPayment)}/mo`} />
        <MetricCard label="Total All-In" value={formatCurrency(totalCashIn)} sub="Down + Close + Rehab" />
      </div>
    </>
  );
}
