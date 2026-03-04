import { RentalIncomePanel } from '../inputs/RentalIncomePanel.jsx';
import { TabBar } from '../tabs/TabBar.jsx';
import { FlipTab } from '../tabs/FlipTab.jsx';
import { HoldTab } from '../tabs/HoldTab.jsx';
import { BrrrrTab } from '../tabs/BrrrrTab.jsx';
import { CompareTab } from '../tabs/CompareTab.jsx';
import { AmortizationTab } from '../tabs/AmortizationTab.jsx';
import { SensitivityTab } from '../tabs/SensitivityTab.jsx';
import { MetricCard } from '../primitives/MetricCard.jsx';
import { SectionHeader } from '../primitives/SectionHeader.jsx';
import { CompsPanel } from '../comps/CompsPanel.jsx';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

export function RightPanel({ state, update, calc, rentcastHook }) {
  const { activeTab, purchasePrice, sqft } = state;
  const { grossRent, monthlyMortgage, monthlyOpExTotal, grm, pricePerSqft } = calc;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <RentalIncomePanel state={state} update={update} grossRent={grossRent} />

      {/* Strategy Tabs */}
      <div style={{ background: '#0e0b06', border: '1px solid #2a2018', borderRadius: '10px', overflow: 'hidden' }}>
        <TabBar activeTab={activeTab} setActiveTab={(t) => update({ activeTab: t })} />
        <div style={{ padding: '22px 24px' }}>
          {activeTab === 'flip'        && <FlipTab state={state} update={update} calc={calc} />}
          {activeTab === 'hold'        && <HoldTab state={state} update={update} calc={calc} />}
          {activeTab === 'brrrr'       && <BrrrrTab state={state} update={update} calc={calc} />}
          {activeTab === 'compare'     && <CompareTab state={state} calc={calc} />}
          {activeTab === 'amortize'    && <AmortizationTab state={state} update={update} calc={calc} />}
          {activeTab === 'sensitivity' && <SensitivityTab state={state} update={update} calc={calc} />}
        </div>
      </div>

      {/* Key Metrics Summary Bar */}
      <div style={{ background: '#0e0b06', border: '1px solid #2a2018', borderRadius: '10px', padding: '18px 24px' }}>
        <SectionHeader icon="📊">Key Metrics Summary</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          <MetricCard label="Monthly Mortgage" value={formatCurrency(monthlyMortgage)} sub="P&I only" />
          <MetricCard label="Gross Rent" value={`${formatCurrency(grossRent)}/mo`} />
          <MetricCard label="Total Monthly OpEx" value={formatCurrency(monthlyOpExTotal)} sub="incl. mortgage" />
          <MetricCard label="GRM" value={`${grm.toFixed(1)}x`} sub="Gross Rent Multiplier" good={grm < 15} />
          <MetricCard label="Price / sqft" value={`$${Math.round(pricePerSqft)}`} sub={`${sqft?.toLocaleString()} sqft`} />
        </div>
      </div>

      {/* Market Data / Comps */}
      <CompsPanel state={state} update={update} rentcastHook={rentcastHook} />

    </div>
  );
}
