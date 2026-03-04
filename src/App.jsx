import { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

import { DEFAULTS } from './constants/defaults.js';
import { useCalculations } from './hooks/useCalculations.js';
import { useRentCast } from './hooks/useRentCast.js';

import { Header } from './components/layout/Header.jsx';
import { LeftPanel } from './components/layout/LeftPanel.jsx';
import { RightPanel } from './components/layout/RightPanel.jsx';
import { Verdict } from './components/verdict/Verdict.jsx';
import { PrintView } from './components/PrintView.jsx';
import { SavedAnalysesModal, saveAnalysis } from './components/saved/SavedAnalysesModal.jsx';

export default function App() {
  const [state, setState] = useState(DEFAULTS);
  const [showSaved, setShowSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const printRef = useRef(null);

  /** Merge partial updates into state */
  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const calc = useCalculations(state);
  const rentcastHook = useRentCast();

  // react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${state.address || 'Property'} Analysis`,
    pageStyle: `
      @page { margin: 0; }
      body { background: #fff !important; color: #111 !important; }
    `,
  });

  function handleSave() {
    const name = prompt('Name this analysis (optional):', `${state.address}, ${state.city}`);
    if (name === null) return; // user cancelled
    saveAnalysis(state, calc, name || undefined);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }

  function handleLoad(savedState) {
    setState(savedState);
  }

  const marketData = rentcastHook.data?.market ?? null;

  return (
    <div style={{ minHeight: '100vh', background: '#0c0a05', fontFamily: "'DM Sans', sans-serif", color: '#f0e6d0' }}>

      {/* Header */}
      <Header
        state={state}
        calc={calc}
        onSave={handleSave}
        onShowSaved={() => setShowSaved(true)}
        onPrint={handlePrint}
      />

      {saveMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          background: '#1f1608', border: '1px solid #d4a843', borderRadius: '8px',
          padding: '12px 20px', fontSize: '13px', color: '#d4a843',
        }}>
          ✓ {saveMsg}
        </div>
      )}

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '28px 32px' }}>

        {/* Verdict */}
        <Verdict calc={calc} marketData={marketData} />

        {/* Main two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '28px', alignItems: 'start' }}>
          <LeftPanel state={state} update={update} calc={calc} />
          <RightPanel state={state} update={update} calc={calc} rentcastHook={rentcastHook} />
        </div>
      </div>

      {/* Hidden print view */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <PrintView state={state} calc={calc} />
        </div>
      </div>

      {/* Saved analyses modal */}
      {showSaved && (
        <SavedAnalysesModal
          onLoad={handleLoad}
          onClose={() => setShowSaved(false)}
        />
      )}
    </div>
  );
}
