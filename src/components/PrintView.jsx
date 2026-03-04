import { formatCurrency, formatPct } from '../utils/formatters.js';

/**
 * White-background print layout. Referenced by react-to-print.
 * Receives the same state + calc as the main app.
 */
export function PrintView({ state, calc }) {
  const {
    address, city, state: stateAbbr, zip, bedCount, bathCount, sqft, purchasePrice,
    annualAppreciation, arvPerSqft, sellingCostPct, flipMarketingMonths, rehabTimelineMonths,
  } = state;

  const {
    flipProfit, flipROI, flipAnnualizedROI, arv, totalFlipCost, rehabCost, sellingCosts,
    holdCashFlow, capRate, holdCoCReturn, annualNOI, totalCashInvested,
    grossRent, monthlyMortgage, monthlyOpExTotal, monthlyPropTax, propMgmtCost,
    vacancyLoss, closingCosts, totalHoldMonths,
  } = calc;

  const { insurance, maintenance, hoa } = state;
  const flipGood = flipProfit > 0 && flipROI > 15;
  const holdGood = holdCashFlow > 200 && holdCoCReturn > 5;

  let verdict = '';
  if (flipGood && holdGood) verdict = 'Both strategies viable';
  else if (flipGood) verdict = 'Flip recommended';
  else if (holdGood) verdict = 'Hold recommended';
  else verdict = 'Caution — neither strategy pencils';

  const pStyle = { fontFamily: 'Georgia, serif', color: '#111', fontSize: '12px', lineHeight: 1.5 };
  const h2Style = { fontFamily: 'Georgia, serif', color: '#333', fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px', marginTop: '20px' };
  const row = (lbl, val, bold) => (
    <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: bold ? 600 : 400 }}>
      <span style={{ color: '#555' }}>{lbl}</span>
      <span style={{ color: '#111' }}>{val}</span>
    </div>
  );

  return (
    <div style={{ background: '#fff', padding: '48px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #111', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Property Investment Analysis</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>{address}</div>
        <div style={{ fontSize: '14px', color: '#555', marginTop: '2px' }}>
          {[city, stateAbbr, zip].filter(Boolean).join(', ')}
          {bedCount && ` · ${bedCount} bed / ${bathCount} bath · ${sqft?.toLocaleString()} sqft`}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginTop: '8px' }}>
          {formatCurrency(purchasePrice)}
        </div>
      </div>

      {/* Verdict */}
      <div style={{ background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '6px', padding: '14px 18px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Investment Verdict</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginTop: '4px' }}>{verdict}</div>
      </div>

      {/* Two-column key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <div style={h2Style}>🔨 Flip Summary</div>
          {row('ARV', formatCurrency(arv))}
          {row('Net Profit', formatCurrency(flipProfit), true)}
          {row('ROI', formatPct(flipROI))}
          {row('Annualized ROI', formatPct(flipAnnualizedROI))}
          {row('Total Hold', `${totalHoldMonths} months`)}
          {row('Renovation Cost', formatCurrency(rehabCost))}
          {row('Total All-In', formatCurrency(totalFlipCost + sellingCosts))}
        </div>
        <div>
          <div style={h2Style}>📈 Hold Summary</div>
          {row('Monthly Cash Flow', formatCurrency(holdCashFlow) + '/mo', true)}
          {row('Cap Rate', formatPct(capRate))}
          {row('CoC Return', formatPct(holdCoCReturn))}
          {row('Annual NOI', formatCurrency(annualNOI))}
          {row('Gross Rent', formatCurrency(grossRent) + '/mo')}
          {row('Total Cash Invested', formatCurrency(totalCashInvested))}
        </div>
      </div>

      {/* Monthly P&L */}
      <div style={h2Style}>Monthly P&L Breakdown</div>
      {row('Gross Rent', formatCurrency(grossRent))}
      {row('Vacancy Loss', `−${formatCurrency(vacancyLoss)}`)}
      {row('Mortgage (P&I)', `−${formatCurrency(monthlyMortgage)}`)}
      {row('Prop Tax + Assess', `−${formatCurrency(monthlyPropTax)}`)}
      {row('HOA', `−${formatCurrency(hoa)}`)}
      {row('Insurance', `−${formatCurrency(insurance)}`)}
      {row('Maintenance', `−${formatCurrency(maintenance)}`)}
      {row('Property Mgmt', `−${formatCurrency(propMgmtCost)}`)}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '6px', marginTop: '6px' }}>
        {row('Net Cash Flow', formatCurrency(holdCashFlow) + '/mo', true)}
      </div>

      <div style={{ marginTop: '40px', fontSize: '10px', color: '#aaa', textAlign: 'center' }}>
        Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Property Investment Analysis Tool
      </div>
    </div>
  );
}
