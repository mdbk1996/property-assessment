# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server
PATH="/opt/homebrew/bin:$PATH" npm run dev        # → http://localhost:5173

# Build for production
PATH="/opt/homebrew/bin:$PATH" npm run build

# Preview production build
PATH="/opt/homebrew/bin:$PATH" npm run preview
```

> npm is at `/opt/homebrew/bin/npm` — it is not on the default shell PATH. Always prefix with `PATH="/opt/homebrew/bin:$PATH"` or use the full path.

## Architecture

### State Management
All app state lives in a single flat `useState(DEFAULTS)` object in `App.jsx`. It is updated via a single `update(patch)` callback (`setState(prev => ({...prev, ...patch}))`). There is no context, no reducer — just one object passed as props.

`src/constants/defaults.js` defines the initial state shape and all default values (seeded with a real Temecula property).

### Derived Calculations
`src/hooks/useCalculations.js` takes the full state and returns a `calc` object via `useMemo`. All financial formulas are pure functions in `src/utils/calculations.js` — no side effects, no API calls. The sensitivity matrix is in `src/utils/sensitivity.js`.

Key derived relationships:
- `arv = arvPerSqft × sqft` — state stores `arvPerSqft`, `arv` is always derived
- `grossRent` — derived from `rentalMode`: sums `rooms[0..bedCount-1]` (room mode) or uses `wholeUnitRent`
- `rehabCost` — uses `rehabCostManual` if set, else `rehabCostPerSqft × sqft`

### RentCast API
`src/hooks/useRentCast.js` calls 4 RentCast endpoints via `Promise.allSettled` (rental comps, sale comps, AVM, market stats). Monthly usage tracked in `localStorage['rentcast_usage']` — 50 calls/month limit.

The Vite dev server proxies `/api/rentcast/*` → `https://api.rentcast.io/*` with the API key injected server-side (see `vite.config.js`). The browser never sees the API key. API key goes in `.env` as `VITE_RENTCAST_API_KEY=...`.

Response normalization: `normalizeListings()` handles bare arrays or `{listings/data/results:[]}` wrappers. Address extraction: `getAddress()` tries `formattedAddress → addressLine1 → address → streetAddress`.

### Component Structure
```
App.jsx                  ← all state + update + hooks
├── layout/Header.jsx    ← address display, Save/PDF buttons
├── layout/LeftPanel.jsx ← acquisition, taxes, opex sliders; purchase price range $200k–$1.5M hardcoded
├── layout/RightPanel.jsx
│   ├── inputs/PropertyForm.jsx      ← address, beds, baths, sqft, listing price
│   ├── inputs/RentalIncomePanel.jsx ← room-by-room vs. whole-unit toggle
│   ├── inputs/RehabPanel.jsx        ← condition tier + manual override + timeline slider
│   ├── comps/CompsPanel.jsx         ← market data fetch + display (auto-opens on data)
│   └── tabs/ (FlipTab, HoldTab, BrrrrTab, CompareTab, AmortizationTab, SensitivityTab)
└── verdict/Verdict.jsx + MarketRiskFlags.jsx
```

### Primitives
- `SliderRow` — click-to-edit: clicking the value shows an `<input>` with Enter/Escape/Arrow key support
- `CollapsiblePanel` — supports both uncontrolled (`defaultOpen`) and controlled (`open`/`onToggle`) modes
- `MetricCard`, `SectionHeader` — display-only

### Styling
All styles are inline — no CSS files, no CSS modules. Design tokens:
- Backgrounds: `#f8f3ea` (page), `#ede6d8` (panels), `#e4dccb` (cards)
- Text: `#1c1508` (primary), `#5c4028` (secondary), `#9a7a58` (muted)
- Accent: `#9a6e0c` (gold), `#f5c444` (bright gold)
- Fonts: Cormorant Garamond (display/numbers), Nunito (body) — loaded from Google Fonts in `index.html`

### Save / PDF
- Analyses saved to `localStorage['property_analyses']` (max 20). `SavedAnalysesModal` handles list/load/delete.
- PDF export uses `react-to-print` targeting `PrintView.jsx` (white background, condensed layout).
