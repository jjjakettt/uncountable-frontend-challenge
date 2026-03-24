import { useState } from 'react'
import { Header } from './Header'
import { ScatterplotExplorer } from '../ScatterplotExplorer'
import { FilterBuilder } from '../FilterBuilder'
import { ExperimentTable } from '../ExperimentTable'
import { HistogramControls } from '../HistogramControls'
import { ExperimentDetailPanel } from '../ExperimentDetailPanel'
import { useAppStore } from '../../store/useAppStore'

type Tab = 'scatterplot' | 'table' | 'histogram'

const TABS: { id: Tab; label: string }[] = [
  { id: 'scatterplot', label: 'Scatterplot' },
  { id: 'table', label: 'Table' },
  { id: 'histogram', label: 'Histogram' },
]

export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('scatterplot')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filters = useAppStore((s) => s.filters)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <div className="border-b border-gray-200 bg-white">
        <nav className="flex px-6">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={[
                'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={[
              'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
              filtersOpen
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            Filters
            {filters.length > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white leading-none">
                {filters.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {filtersOpen && (
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <FilterBuilder />
        </div>
      )}

      <main className="flex-1 p-6">
        {activeTab === 'scatterplot' && (
          <div data-testid="tab-scatterplot">
            <ScatterplotExplorer />
          </div>
        )}
        {activeTab === 'table' && (
          <div data-testid="tab-table">
            <ExperimentTable />
          </div>
        )}
        {activeTab === 'histogram' && (
          <div data-testid="tab-histogram">
            <HistogramControls />
          </div>
        )}
      </main>
      <ExperimentDetailPanel />
    </div>
  )
}
