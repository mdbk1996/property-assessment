import { PropertyForm } from '../inputs/PropertyForm.jsx';
import { RehabPanel } from '../inputs/RehabPanel.jsx';
import { SectionHeader } from '../primitives/SectionHeader.jsx';
import { SliderRow } from '../primitives/SliderRow.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function LeftPanel({ state, update, calc }) {
  const {
    purchasePrice, downPct, interestRate, loanTermYears, closingCostPct,
    propTaxRate, specialAssessments, hoa, insurance, maintenance,
    propMgmtPct, vacancyPct, listingPrice,
  } = state;

  const { downPayment, closingCosts, annualPropTax, propMgmtCost, vacancyLoss } = calc;

  const priceMin = Math.round(listingPrice * 0.7 / 5000) * 5000;
  const priceMax = Math.round(listingPrice * 1.3 / 5000) * 5000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <PropertyForm state={state} update={update} />

      {/* Acquisition */}
      <div style={{ background: '#181410', border: '1px solid #352a1a', borderRadius: '10px', padding: '22px 24px' }}>
        <SectionHeader icon="🏠">Acquisition</SectionHeader>
        <SliderRow label="Purchase Price" value={purchasePrice} min={priceMin} max={priceMax} step={5000} onChange={(v) => update({ purchasePrice: v })} format={formatCurrency} />
        <SliderRow label="Down Payment" value={downPct} min={5} max={40} step={1} onChange={(v) => update({ downPct: v })} format={(v) => `${v}%`} sub={`${formatCurrency(downPayment)} cash down`} />
        <SliderRow label="Interest Rate" value={interestRate} min={4} max={14} step={0.05} onChange={(v) => update({ interestRate: parseFloat(v.toFixed(2)) })} format={(v) => `${v.toFixed(2)}%`} />
        <SliderRow label="Loan Term" value={loanTermYears} min={10} max={30} step={5} onChange={(v) => update({ loanTermYears: v })} format={(v) => `${v} yr`} />
        <SliderRow label="Closing Costs" value={closingCostPct} min={1} max={5} step={0.1} onChange={(v) => update({ closingCostPct: parseFloat(v.toFixed(1)) })} format={(v) => `${v.toFixed(1)}%`} sub={formatCurrency(closingCosts)} />
      </div>

      {/* Taxes & Fixed */}
      <div style={{ background: '#181410', border: '1px solid #352a1a', borderRadius: '10px', padding: '22px 24px' }}>
        <SectionHeader icon="🧾">Taxes & Fixed Costs</SectionHeader>
        <SliderRow label="Property Tax Rate" value={propTaxRate} min={0.5} max={2.5} step={0.05} onChange={(v) => update({ propTaxRate: parseFloat(v.toFixed(2)) })} format={(v) => `${v.toFixed(2)}%`} sub={`${formatCurrency(annualPropTax)}/yr`} />
        <SliderRow label="Special Assessments" value={specialAssessments} min={0} max={10000} step={100} onChange={(v) => update({ specialAssessments: v })} format={(v) => `${formatCurrency(v)}/yr`} />
        <SliderRow label="HOA" value={hoa} min={0} max={1000} step={5} onChange={(v) => update({ hoa: v })} format={(v) => `${formatCurrency(v)}/mo`} />
      </div>

      {/* OpEx */}
      <div style={{ background: '#181410', border: '1px solid #352a1a', borderRadius: '10px', padding: '22px 24px' }}>
        <SectionHeader icon="⚙️">Operating Expenses</SectionHeader>
        <SliderRow label="Insurance" value={insurance} min={50} max={1000} step={25} onChange={(v) => update({ insurance: v })} format={(v) => `${formatCurrency(v)}/mo`} />
        <SliderRow label="Maintenance" value={maintenance} min={100} max={2000} step={50} onChange={(v) => update({ maintenance: v })} format={(v) => `${formatCurrency(v)}/mo`} />
        <SliderRow label="Property Mgmt" value={propMgmtPct} min={0} max={15} step={0.5} onChange={(v) => update({ propMgmtPct: v })} format={(v) => `${v}%`} sub={`${formatCurrency(propMgmtCost)}/mo`} />
        <SliderRow label="Vacancy Rate" value={vacancyPct} min={0} max={20} step={1} onChange={(v) => update({ vacancyPct: v })} format={(v) => `${v}%`} sub={`${formatCurrency(vacancyLoss)}/mo loss`} />
      </div>

      <RehabPanel state={state} update={update} rehabCost={calc.rehabCost} />

    </div>
  );
}
