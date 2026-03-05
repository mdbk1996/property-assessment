import { SliderRow } from '../primitives/SliderRow.jsx';
import { MetricCard } from '../primitives/MetricCard.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function FlipTab({ state, update, calc }) {
  const { arvPerSqft, flipMarketingMonths, sellingCostPct, sqft, rehabTimelineMonths } = state;
  const {
    arv, rehabCost, rehabCarryCost, marketingCarryCost,
    totalFlipCost, flipProfit, flipROI, flipAnnualizedROI, breakEvenArv,
    closingCosts, totalHoldMonths, sellingCosts,
  } = calc;

  const { purchasePrice } = state;
  const netProceeds = arv - sellingCosts;

  // Slider range anchored to purchase price
  const arvMin = Math.max(50000, Math.round(purchasePrice * 0.5 / 5000) * 5000);
  const arvMax = Math.round(purchasePrice * 3 / 5000) * 5000;

  function handleArvChange(v) {
    // Keep arvPerSqft in sync so all downstream calcs stay consistent
    update({ arvPerSqft: sqft > 0 ? parseFloat((v / sqft).toFixed(2)) : arvPerSqft });
  }

  return (
    <>
      {/* ARV / Sale Price */}
      <div style={{ marginBottom: '20px' }}>
        <SliderRow
          label="Projected Sale Price"
          value={arv}
          min={arvMin}
          max={arvMax}
          step={5000}
          onChange={handleArvChange}
          format={formatCurrency}
          sub={sqft > 0 ? `$${Math.round(arv / sqft)}/sqft` : undefined}
        />
        <SliderRow
          label="Selling Costs"
          value={sellingCostPct}
          min={2}
          max={10}
          step={0.5}
          onChange={(v) => update({ sellingCostPct: v })}
          format={(v) => `${v}%`}
          sub={`${formatCurrency(sellingCosts)} at close · Net proceeds: ${formatCurrency(netProceeds)}`}
        />
      </div>

      {/* Sale Proceeds at Closing */}
      <div style={{ background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '8px', padding: '14px 18px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>At Closing</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
          <span style={{ color: '#7a5c38' }}>Sale Price (ARV)</span>
          <span style={{ color: '#1c1508', fontWeight: 600 }}>{formatCurrency(arv)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
          <span style={{ color: '#7a5c38' }}>Selling Costs ({sellingCostPct}%)</span>
          <span style={{ color: '#b02020' }}>−{formatCurrency(sellingCosts)}</span>
        </div>
        <div style={{ borderTop: '1px solid #c8b890', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
          <span style={{ color: '#5c4028' }}>Net Proceeds</span>
          <span style={{ color: '#9a6e0c' }}>{formatCurrency(netProceeds)}</span>
        </div>
      </div>

      {/* Hold Timeline */}
      <div style={{ background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '8px', padding: '14px 18px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Hold Timeline</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <SliderRow
            label="Flip / Rehab Period"
            value={rehabTimelineMonths}
            min={1}
            max={24}
            step={1}
            onChange={(v) => update({ rehabTimelineMonths: v })}
            format={(v) => `${v} mo`}
            sub={`Carry: ${formatCurrency(rehabCarryCost)}`}
          />
          <SliderRow
            label="Sale Period"
            value={flipMarketingMonths}
            min={1}
            max={12}
            step={1}
            onChange={(v) => update({ flipMarketingMonths: v })}
            format={(v) => `${v} mo`}
            sub={`Carry: ${formatCurrency(marketingCarryCost)}`}
          />
        </div>
        {/* Visual timeline bar */}
        <div style={{ marginTop: '4px' }}>
          <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '4px' }}>
            <div style={{
              width: `${(rehabTimelineMonths / totalHoldMonths) * 100}%`,
              background: '#9a6e0c',
              transition: 'width 0.2s',
            }} />
            <div style={{
              flex: 1,
              background: '#c8b890',
              transition: 'flex 0.2s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7a5c38' }}>
            <span style={{ color: '#9a6e0c', fontWeight: 600 }}>Rehab: {rehabTimelineMonths} mo</span>
            <span style={{ fontWeight: 700, color: '#1c1508' }}>Total: {totalHoldMonths} mo</span>
            <span>Sale: {flipMarketingMonths} mo</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div style={{ background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Total Cost Breakdown</div>
        {[
          ['Purchase Price', purchasePrice],
          ['Closing Costs', closingCosts],
          ['Renovation', rehabCost],
          [`Rehab Carry (${rehabTimelineMonths} mo)`, rehabCarryCost],
          [`Sale Carry (${flipMarketingMonths} mo)`, marketingCarryCost],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#7a5c38' }}>{lbl}</span>
            <span style={{ color: '#5c4028' }}>{formatCurrency(val)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #c8b890', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
          <span style={{ color: '#5c4028' }}>Total All-In Cost</span>
          <span style={{ color: '#1c1508' }}>{formatCurrency(totalFlipCost)}</span>
        </div>
      </div>

      {/* Profit Summary */}
      <div style={{ background: 'linear-gradient(135deg, #ddd0b0, #d4c4a0)', border: `1px solid ${flipProfit > 0 ? '#9a6e0c' : '#b02020'}`, borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
          <span style={{ color: '#7a5c38' }}>Net Proceeds</span>
          <span style={{ color: '#1c1508' }}>{formatCurrency(netProceeds)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: '#7a5c38' }}>Total All-In Cost</span>
          <span style={{ color: '#1c1508' }}>−{formatCurrency(totalFlipCost)}</span>
        </div>
        <div style={{ borderTop: '1px solid #c8b890', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '13px', color: '#5c4028', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Net Profit</span>
          <span style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: flipProfit > 0 ? '#1a7a38' : '#b02020' }}>
            {formatCurrency(flipProfit)}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <MetricCard label="ROI" value={formatPct(flipROI)} sub={`${formatPct(flipAnnualizedROI)} annualized`} good={flipROI > 15} />
        <MetricCard label="Break-even Sale Price" value={formatCurrency(breakEvenArv)} sub="Min sale price to profit" />
        <MetricCard label="Break-even $/sqft" value={`$${sqft > 0 ? Math.ceil(breakEvenArv / sqft) : '—'}/sqft`} sub="Min ARV/sqft to profit" />
      </div>
    </>
  );
}
