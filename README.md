# Property Assessment Tool

A real estate investment analysis app for evaluating whether to flip or hold a property. Built with Vite + React.

## Features

- **Flip analysis** — net profit, carry costs, split rehab/sale timeline, projected sale price
- **Hold / rental analysis** — cash-on-cash return, cap rate, NOI, monthly cash flow
- **BRRRR analysis** — Buy, Rehab, Rent, Refinance, Repeat; shows capital recovery and post-refi cash flow
- **Strategy comparison** — side-by-side flip vs. hold metrics
- **Amortization schedule** — year-by-year equity, cash flow, and property value (10/20/30 yr)
- **Sensitivity analysis** — 5×5 color-coded matrix varying any two inputs
- **Market data via RentCast** — rental comps, sale comps, AVM valuation, market stats (median DOM, price trends, vacancy)
- **Save / load analyses** — persisted in localStorage, up to 20 saved analyses
- **PDF export** — print-optimized layout via react-to-print
- **Editable sliders** — click any value to type it directly

## Setup

**Prerequisites:** Node.js (installed via Homebrew at `/opt/homebrew/bin/node`)

```bash
cd property-assessment
PATH="/opt/homebrew/bin:$PATH" npm install
```

**RentCast API key** (optional — required for market data):

```bash
cp .env.example .env
# Edit .env and add: VITE_RENTCAST_API_KEY=your_key_here
```

Get a free API key at [rentcast.io](https://rentcast.io). The free tier allows 50 calls/month; each property fetch uses 4 calls.

```bash
PATH="/opt/homebrew/bin:$PATH" npm run dev
# → http://localhost:5173
```

## Usage

1. Enter the property address, beds/baths/sqft, and listing price in the top form
2. Adjust acquisition inputs (purchase price, down payment, interest rate) in the left panel
3. Set rehab condition tier and timeline in the Rehab panel
4. Choose rental mode (room-by-room or whole unit) and set rent
5. Click **Fetch Market Data** in the Market Data & Comps panel to pull live comps
6. Use the tabs to explore Flip, Hold, BRRRR, Compare, Amortization, and Sensitivity views
7. Save the analysis with the **Save** button; load past analyses from the header

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [react-to-print](https://github.com/MatthewHerbst/react-to-print) for PDF export
- [RentCast API](https://developers.rentcast.io/) for market data
- localStorage for persistence (no backend)
- Inline styles throughout — no CSS framework
