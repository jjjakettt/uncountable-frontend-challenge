# Uncountable Frontend Challenge

An interactive data explorer for a materials science experiment dataset. Built as a take-home assignment for Uncountable.

## Features

### Scatterplot
Select any input or output field for the X and Y axes. Points are clickable — selecting one opens the detail panel. When filters are active, non-matching points are dimmed while matching points stay highlighted. A least-squares regression line and R² value are shown automatically when X ≠ Y.

### Table
Full experiment data across all 34 input and output columns. Paginated at 10 rows per page with a summary that reflects visible rows, filter matches, and current page. Sticky ID column stays visible during horizontal scroll. Click any row to open the detail panel.

### Histogram
Choose an output field and a value range, then see how a selected input ingredient was distributed across the experiments in that range. Configurable bin count (1–50). Zero values (ingredient not used) are excluded by default with a toggle to include them.

### Filters
Apply one or more AND-combined filters on any field using `>`, `<`, or `range` operators. The filter panel shows a live match count and a badge on the nav button. Filters affect the scatterplot (dimming), the table, and the histogram simultaneously.

### Detail Panel
Slide-in panel showing all inputs and outputs for the selected experiment. Zero input values are displayed as "not used". Accessible from any view — selecting an experiment in the scatterplot, table, or histogram opens the same panel.

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Running Tests

```bash
npm test           # Vitest unit + component tests
npm run test:e2e   # Playwright end-to-end tests
```

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| State | Zustand |
| Charts | Recharts |
| Styles | Tailwind CSS v4 |
| Unit tests | Vitest + React Testing Library |
| E2E tests | Playwright |

## Project Structure

```
src/
  assets/          # Raw JSON dataset
  components/      # UI components (ScatterplotExplorer, ExperimentTable, etc.)
    layout/        # AppShell, Header
    shared/        # FieldSelect, RangeSlider, CloseButton
  store/           # Zustand store (useAppStore)
  types/           # Shared TypeScript types, field name unions
  utils/           # Pure functions: filters, histogram, regression, fields, math
tests/
  unit/            # Utility function tests
  components/      # Component tests
  e2e/             # Playwright user flow tests
```
