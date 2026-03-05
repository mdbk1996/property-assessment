import { useMemo, useState, useEffect } from 'react';
import { buildSensitivityMatrix } from '../../utils/sensitivity.js';
import { formatByKey } from '../../utils/formatters.js';
import { SENSITIVITY_VARS, SENSITIVITY_OUTPUTS } from '../../constants/defaults.js';

function lerp(a, b, t) { return a + (b - a) * t; }

function colorForValue(value, min, max) {
  if (max === min) return 'hsl(40, 30%, 25%)';
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  // red → yellow → green
  const r = t < 0.5 ? 220 : Math.round(lerp(220, 80, (t - 0.5) * 2));
  const g = t < 0.5 ? Math.round(lerp(80, 186, t * 2)) : 186;
  const b = t < 0.5 ? 80 : Math.round(lerp(80, 125, (t - 0.5) * 2));
  return `rgb(${r}, ${g}, ${b})`;
}

export function SensitivityTab({ state, update }) {
  const { sensitivityXVar, sensitivityYVar, sensitivityOutputVar } = state;

  const [debouncedState, setDebouncedState] = useState(state);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedState(state), 150);
    return () => clearTimeout(t);
  }, [state]);

  const matrix = useMemo(
    () => buildSensitivityMatrix({
      state: debouncedState,
      xVar: sensitivityXVar,
      yVar: sensitivityYVar,
      outputVar: sensitivityOutputVar,
    }),
    [debouncedState, sensitivityXVar, sensitivityYVar, sensitivityOutputVar]
  );

  const xMeta = SENSITIVITY_VARS[sensitivityXVar];
  const yMeta = SENSITIVITY_VARS[sensitivityYVar];
  const outMeta = SENSITIVITY_OUTPUTS[sensitivityOutputVar];

  const allValues = matrix.grid.flat();
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  // Find current base cell (middle: [2][2])
  const baseCellRow = 2;
  const baseCellCol = 2;

  const selectStyle = {
    background: '#e4dccb', border: '1px solid #c8b890', borderRadius: '6px',
    color: '#1c1508', fontSize: '13px', padding: '6px 10px', fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer', outline: 'none',
  };

  return (
    <>
      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>X Axis (columns)</div>
          <select style={selectStyle} value={sensitivityXVar} onChange={(e) => update({ sensitivityXVar: e.target.value })}>
            {Object.entries(SENSITIVITY_VARS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Y Axis (rows)</div>
          <select style={selectStyle} value={sensitivityYVar} onChange={(e) => update({ sensitivityYVar: e.target.value })}>
            {Object.entries(SENSITIVITY_VARS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#7a5c38', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Output Metric</div>
          <select style={selectStyle} value={sensitivityOutputVar} onChange={(e) => update({ sensitivityOutputVar: e.target.value })}>
            {Object.entries(SENSITIVITY_OUTPUTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '3px', fontSize: '12px' }}>
          <thead>
            <tr>
              <td style={{ padding: '4px 8px' }}>
                <div style={{ fontSize: '10px', color: '#9a7a58' }}>{yMeta.label} ↓ / {xMeta.label} →</div>
              </td>
              {matrix.xValues.map((xv, ci) => (
                <th key={ci} style={{
                  padding: '6px 10px', fontSize: '11px', color: '#5c4028',
                  fontWeight: ci === baseCellCol ? 700 : 400,
                  borderBottom: ci === baseCellCol ? '2px solid #9a6e0c' : 'none',
                }}>
                  {formatByKey(xv, xMeta.format)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.yValues.map((yv, ri) => (
              <tr key={ri}>
                <th style={{
                  padding: '6px 10px', fontSize: '11px', color: '#5c4028', textAlign: 'right',
                  fontWeight: ri === baseCellRow ? 700 : 400,
                  borderRight: ri === baseCellRow ? '2px solid #9a6e0c' : 'none',
                }}>
                  {formatByKey(yv, yMeta.format)}
                </th>
                {matrix.grid[ri].map((val, ci) => {
                  const isBase = ri === baseCellRow && ci === baseCellCol;
                  const bg = colorForValue(val, minVal, maxVal);
                  return (
                    <td
                      key={ci}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'center',
                        background: bg,
                        borderRadius: '4px',
                        color: '#fff',
                        fontWeight: isBase ? 700 : 400,
                        fontSize: isBase ? '13px' : '12px',
                        outline: isBase ? '2px solid #9a6e0c' : 'none',
                        outlineOffset: isBase ? '1px' : '0',
                        opacity: 0.9,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {formatByKey(val, outMeta.format)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: 'rgb(220,80,80)', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', color: '#7a5c38' }}>Unfavorable</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: 'rgb(220,186,80)', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', color: '#7a5c38' }}>Neutral</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: 'rgb(80,186,125)', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', color: '#7a5c38' }}>Favorable</span>
        </div>
        <span style={{ fontSize: '11px', color: '#9a7a58', marginLeft: '8px' }}>Gold outline = current inputs</span>
      </div>
    </>
  );
}
