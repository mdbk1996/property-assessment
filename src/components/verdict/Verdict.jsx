import { MarketRiskFlags } from './MarketRiskFlags.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function Verdict({ calc, marketData }) {
  const { flipProfit, holdCashFlow, flipROI, holdCoCReturn } = calc;

  const flipGood = flipProfit > 0 && flipROI > 15;
  const holdGood = holdCashFlow > 200 && holdCoCReturn > 5;

  let rec = '';
  let color = '#5c4028';

  if (flipGood && holdGood) {
    rec = 'Both strategies viable — flip edges out if you want liquidity';
    color = '#9a6e0c';
  } else if (flipGood && !holdGood) {
    rec = 'Flip recommended — hold doesn\'t cash flow at current parameters';
    color = '#1a7a38';
  } else if (!flipGood && holdGood) {
    rec = 'Hold recommended — flip margins too thin for risk';
    color = '#1a7a38';
  } else {
    rec = 'Caution — neither strategy pencils at current inputs';
    color = '#b02020';
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      <MarketRiskFlags marketData={marketData} />
      <div style={{
        background: 'linear-gradient(135deg, #e0d4bc, #d4c4a0)',
        border: `1px solid ${color}`,
        borderRadius: '10px',
        padding: '24px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Investment Verdict</div>
        <div style={{ fontSize: '22px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color, lineHeight: 1.3 }}>{rec}</div>
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '13px', color: '#7a5c38' }}>
          <span>Flip Profit: <span style={{ color: flipProfit > 0 ? '#1a7a38' : '#b02020' }}>{formatCurrency(flipProfit)}</span></span>
          <span>Hold Cash Flow: <span style={{ color: holdCashFlow > 0 ? '#1a7a38' : '#b02020' }}>{formatCurrency(holdCashFlow)}/mo</span></span>
          <span>CoC: <span style={{ color: holdCoCReturn > 5 ? '#1a7a38' : '#b02020' }}>{formatPct(holdCoCReturn)}</span></span>
        </div>
      </div>
    </div>
  );
}
