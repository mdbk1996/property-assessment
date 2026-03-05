import { SliderRow } from '../primitives/SliderRow.jsx';
import { MetricCard } from '../primitives/MetricCard.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function FlipTab({ state, update, calc }) {
  const { arvPerSqft, flipMarketingMonths, sellingCostPct, sqft } = state;
  const {
    arv, rehabCost, rehabCarryCost, marketingCarryCost, flipCarryingCosts,
    totalFlipCost, flipProfit, flipROI, flipAnnualizedROI, breakEvenArv,
    closingCosts, totalHoldMonths, rehabTimelineMonths,
    sellingCosts,
  } = calc;

  const { purchasePrice } = state;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginBottom: '20px' }}>
        <SliderRow
          label="ARV / sqft"
          value={arvPerSqft}
          min={100}
          max={800}
          step={5}
          onChange={(v) => update({ arvPerSqft: v })}
          format={(v) => `$${v}/sqft`}
          sub={`ARV: ${formatCurrency(arv)}`}
        />
        <SliderRow
          label="Marketing / Sell Period"
          value={flipMarketingMonths}
          min={1}
          max={12}
          step={1}
          onChange={(v) => update({ flipMarketingMonths: v })}
          format={(v) => `${v} mo`}
          sub={`Total hold: ${totalHoldMonths} mo`}
        />
        <SliderRow
          label="Selling Costs"
          value={sellingCostPct}
          min={2}
          max={10}
          step={0.5}
          onChange={(v) => update({ sellingCostPct: v })}
          format={(v) => `${v}%`}
          sub={formatCurrency(sellingCosts) + ' at close'}
        />
      </div>

      {/* Cost Breakdown */}
      <div style={{ background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Cost Breakdown</div>
        {[
          ['Purchase Price', purchasePrice],
          ['Closing Costs', closingCosts],
          ['Renovation', rehabCost],
          [`Rehab Carry (${state.rehabTimelineMonths} mo)`, rehabCarryCost],
          [`Marketing Carry (${flipMarketingMonths} mo)`, marketingCarryCost],
          ['Selling Costs', sellingCosts],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#7a5c38' }}>{lbl}</span>
            <span style={{ color: '#5c4028' }}>{formatCurrency(val)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #c8b890', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
          <span style={{ color: '#5c4028' }}>Total All-In</span>
          <span style={{ color: '#1c1508' }}>{formatCurrency(totalFlipCost + sellingCosts)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <MetricCard label="ARV" value={formatCurrency(arv)} highlight />
        <MetricCard label="Net Profit" value={formatCurrency(flipProfit)} good={flipProfit > 0} highlight={flipProfit > 0} />
        <MetricCard label="ROI" value={formatPct(flipROI)} sub={`${formatPct(flipAnnualizedROI)} annualized`} good={flipROI > 15} />
        <MetricCard label="Break-even ARV" value={formatCurrency(breakEvenArv)} sub="Min ARV to profit" />
        <MetricCard label="All-in Cost" value={formatCurrency(totalFlipCost)} />
        <MetricCard label="Total Hold" value={`${totalHoldMonths} mo`} sub={`Rehab ${state.rehabTimelineMonths} + Sell ${flipMarketingMonths}`} />
      </div>
    </>
  );
}
