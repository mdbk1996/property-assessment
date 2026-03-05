import { SectionHeader } from '../primitives/SectionHeader.jsx';
import { SliderRow } from '../primitives/SliderRow.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { REHAB_TIERS } from '../../constants/defaults.js';

export function RehabPanel({ state, update, rehabCost }) {
  const { rehabCondition, rehabCostManual, rehabCostPerSqft, rehabTimelineMonths, sqft } = state;

  function selectTier(tier) {
    const t = REHAB_TIERS[tier];
    update({
      rehabCondition: tier,
      rehabCostPerSqft: t.midpoint ?? rehabCostPerSqft,
      rehabCostManual: null, // clear manual override when switching tier
    });
  }

  function handleManualChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    const val = raw === '' ? null : parseInt(raw, 10);
    update({ rehabCostManual: val });
  }

  const tierBtnStyle = (active) => ({
    flex: 1,
    padding: '8px 4px',
    background: active ? 'linear-gradient(135deg, #ddd0b0, #d8c8a0)' : '#e4dccb',
    border: `1px solid ${active ? '#9a6e0c' : '#c8b890'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: active ? '#9a6e0c' : '#7a5c38',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    transition: 'all 0.2s',
    textAlign: 'center',
  });

  return (
    <div style={{ background: '#ede6d8', border: '1px solid #c8b890', borderRadius: '10px', padding: '22px 24px' }}>
      <SectionHeader icon="🔨">Rehab / Renovation</SectionHeader>

      {/* Tier selector */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Condition Tier</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Object.entries(REHAB_TIERS).map(([key, t]) => (
            <button key={key} style={tierBtnStyle(rehabCondition === key)} onClick={() => selectTier(key)}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{t.label}</div>
              {key !== 'custom' && <div style={{ fontSize: '10px', opacity: 0.7 }}>${t.range[0]}–${t.range[1]}/sqft</div>}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#7a5c38', marginTop: '6px', fontStyle: 'italic' }}>
          {REHAB_TIERS[rehabCondition]?.description}
        </div>
      </div>

      {/* Per-sqft slider (shown when not custom and no manual override) */}
      {rehabCondition !== 'custom' && !rehabCostManual && (
        <SliderRow
          label="Rehab Cost / sqft"
          value={rehabCostPerSqft}
          min={REHAB_TIERS[rehabCondition]?.range[0] || 5}
          max={REHAB_TIERS[rehabCondition]?.range[1] || 300}
          step={2.5}
          onChange={(v) => update({ rehabCostPerSqft: v })}
          format={(v) => `$${v.toFixed(1)}/sqft`}
          sub={`Est. total: ${formatCurrency(sqft * rehabCostPerSqft)}`}
        />
      )}

      {/* Manual override */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
          Total Cost Override {rehabCostManual ? <span style={{ color: '#9a6e0c' }}>(active)</span> : <span>(optional)</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#5c4028', fontSize: '13px' }}>$</span>
            <input
              style={{
                background: '#e4dccb', border: `1px solid ${rehabCostManual ? '#9a6e0c' : '#c8b890'}`, borderRadius: '6px',
                color: '#1c1508', fontSize: '15px', padding: '8px 10px 8px 22px', width: '100%',
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, outline: 'none',
              }}
              placeholder="Leave blank to use /sqft"
              value={rehabCostManual != null ? rehabCostManual.toLocaleString() : ''}
              onChange={handleManualChange}
            />
          </div>
          {rehabCostManual != null && (
            <button
              onClick={() => update({ rehabCostManual: null })}
              style={{ background: 'none', border: '1px solid #c8b890', borderRadius: '6px', color: '#7a5c38', padding: '8px 12px', cursor: 'pointer', fontSize: '12px' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Timeline slider */}
      <SliderRow
        label="Rehab Timeline"
        value={rehabTimelineMonths}
        min={1}
        max={24}
        step={1}
        onChange={(v) => update({ rehabTimelineMonths: v })}
        format={(v) => `${v} mo`}
      />

      {/* Summary */}
      <div style={{ borderTop: '1px solid #c8b890', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Rehab Cost</span>
        <span style={{ fontSize: '22px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#9a6e0c' }}>{formatCurrency(rehabCost)}</span>
      </div>
    </div>
  );
}
