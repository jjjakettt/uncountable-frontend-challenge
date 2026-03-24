import { useState } from 'react'
import { Header } from './Header'
import { ScatterplotExplorer } from '../ScatterplotExplorer'
import { FilterBuilder } from '../FilterBuilder'
import { ExperimentTable } from '../ExperimentTable'

type Tab = 'scatterplot' | 'table' | 'histogram'

const TABS: { id: Tab; label: string }[] = [
  { id: 'scatterplot', label: 'Scatterplot' },
  { id: 'table', label: 'Table' },
  { id: 'histogram', label: 'Histogram' },
]

export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('scatterplot')

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
        </nav>
      </div>

      <main className="flex-1 p-6">
        {activeTab === 'scatterplot' && (
          <div data-testid="tab-scatterplot">
            <ScatterplotExplorer />
          </div>
        )}
        {activeTab === 'table' && (
          <div data-testid="tab-table" className="flex flex-col gap-4">
            <FilterBuilder />
            <ExperimentTable />
          </div>
        )}
        {activeTab === 'histogram' && (
          <div data-testid="tab-histogram" />
        )}
      </main>
    </div>
  )
}
