import { MetricCard } from '../primitives/MetricCard.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function CompareTab({ state, calc }) {
  const { annualAppreciation, purchasePrice } = state;
  const {
    flipProfit, flipROI, flipAnnualizedROI, breakEvenArv, totalFlipCost,
    holdCashFlow, capRate, holdCoCReturn, totalCashInvested,
    brrrr,
  } = calc;

  const fiveYrReturn = (holdCashFlow * 60) + (purchasePrice * Math.pow(1 + annualAppreciation / 100, 5) - purchasePrice);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
      {/* Flip */}
      <div>
        <div style={{ fontSize: '14px', color: '#f5c444', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔨 Flip</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <MetricCard label="Net Profit" value={formatCurrency(flipProfit)} good={flipProfit > 0} highlight={flipProfit > 0} />
          <MetricCard label="ROI" value={formatPct(flipROI)} sub={`${formatPct(flipAnnualizedROI)} annualized`} good={flipROI > 15} />
          <MetricCard label="Break-even ARV" value={formatCurrency(breakEvenArv)} sub="Min ARV to profit" />
          <MetricCard label="All-in Cost" value={formatCurrency(totalFlipCost)} />
        </div>
      </div>

      {/* Hold */}
      <div>
        <div style={{ fontSize: '14px', color: '#f5c444', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📈 Hold</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <MetricCard label="Monthly Cash Flow" value={`${formatCurrency(holdCashFlow)}/mo`} good={holdCashFlow > 0} highlight={holdCashFlow > 0} />
          <MetricCard label="Cap Rate" value={formatPct(capRate)} good={capRate > 5} />
          <MetricCard label="CoC Return" value={formatPct(holdCoCReturn)} good={holdCoCReturn > 5} />
          <MetricCard label="5-Yr Total Return" value={formatCurrency(fiveYrReturn)} sub="CF + Appreciation" good={fiveYrReturn > 0} />
        </div>
      </div>

      {/* BRRRR */}
      <div>
        <div style={{ fontSize: '14px', color: '#f5c444', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>♻️ BRRRR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <MetricCard
            label="Post-Refi Cash Flow"
            value={`${formatCurrency(brrrr.postRefiCashFlow)}/mo`}
            good={brrrr.postRefiCashFlow > 0}
            highlight={brrrr.postRefiCashFlow > 0}
          />
          <MetricCard
            label="Effective CoC"
            value={brrrr.fullRecovery ? '∞' : formatPct(brrrr.effectiveCoC)}
            good={brrrr.fullRecovery || brrrr.effectiveCoC > 8}
          />
          <MetricCard label="Cash Pulled Out" value={formatCurrency(brrrr.cashPulledOut)} good={brrrr.cashPulledOut >= 0} />
          <MetricCard label="Equity in Deal" value={formatCurrency(brrrr.equityInDeal)} />
        </div>
      </div>
    </div>
  );
}
