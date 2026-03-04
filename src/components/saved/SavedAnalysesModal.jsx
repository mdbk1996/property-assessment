import { useState } from 'react';
import { formatCurrency, formatPct } from '../../utils/formatters.js';

const STORAGE_KEY = 'property_analyses';
const MAX_SAVED = 20;

export function loadAnalyses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveAnalysis(state, calc, name) {
  const analyses = loadAnalyses();
  const entry = {
    id: Date.now(),
    name: name || `${state.address}, ${state.city}`,
    timestamp: new Date().toISOString(),
    address: state.address,
    city: state.city,
    stateAbbr: state.state,
    flipProfit: calc.flipProfit,
    holdCashFlow: calc.holdCashFlow,
    holdCoCReturn: calc.holdCoCReturn,
    purchasePrice: state.purchasePrice,
    fullState: state,
  };
  const next = [entry, ...analyses].slice(0, MAX_SAVED);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteAnalysis(id) {
  const analyses = loadAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  return analyses;
}

export function SavedAnalysesModal({ onLoad, onClose }) {
  const [analyses, setAnalyses] = useState(() => loadAnalyses());

  function handleDelete(id) {
    setAnalyses(deleteAnalysis(id));
  }

  function handleLoad(entry) {
    onLoad(entry.fullState);
    onClose();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#181410', border: '1px solid #352a1a', borderRadius: '12px',
        padding: '28px', width: '100%', maxWidth: '600px', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#f8f2e4' }}>
            Saved Analyses
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8a7458', cursor: 'pointer', fontSize: '20px' }}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {analyses.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6a5848', padding: '32px', fontSize: '13px' }}>
              No saved analyses yet. Use "Save Analysis" to store your current inputs.
            </div>
          )}
          {analyses.map((a) => (
            <div key={a.id} style={{ background: '#100e09', border: '1px solid #1e160a', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: '#f8f2e4', marginBottom: '2px' }}>{a.name}</div>
                <div style={{ fontSize: '11px', color: '#6a5848' }}>
                  {new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' · '}{formatCurrency(a.purchasePrice)}
                </div>
                <div style={{ fontSize: '11px', marginTop: '3px' }}>
                  <span style={{ color: a.flipProfit > 0 ? '#52d68c' : '#f06464' }}>Flip: {formatCurrency(a.flipProfit)}</span>
                  <span style={{ color: '#6a5848', margin: '0 6px' }}>·</span>
                  <span style={{ color: a.holdCashFlow > 0 ? '#52d68c' : '#f06464' }}>CF: {formatCurrency(a.holdCashFlow)}/mo</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleLoad(a)} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #c49020, #f5c444)', border: 'none', borderRadius: '5px', color: '#111009', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                  Load
                </button>
                <button onClick={() => handleDelete(a.id)} style={{ padding: '6px 10px', background: 'none', border: '1px solid #352a1a', borderRadius: '5px', color: '#8a7458', cursor: 'pointer', fontSize: '11px' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: '#6a5848', textAlign: 'right' }}>
          {analyses.length} / {MAX_SAVED} slots used
        </div>
      </div>
    </div>
  );
}
