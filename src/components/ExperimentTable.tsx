import { useMemo, useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { allExperiments } from '../data/dataset'
import { applyFilters } from '../utils/filters'
import { INPUT_FIELDS, OUTPUT_FIELDS, getValue } from '../utils/fields'

const ALL_COLUMNS = [...INPUT_FIELDS, ...OUTPUT_FIELDS]
const PAGE_SIZE = 10

export function ExperimentTable() {
  const filters = useAppStore((s) => s.filters)
  const selectedExperimentId = useAppStore((s) => s.selectedExperimentId)
  const setSelectedExperiment = useAppStore((s) => s.setSelectedExperiment)
  const filtered = useMemo(() => applyFilters(allExperiments, filters), [filters])
  const [page, setPage] = useState(0)

  useEffect(() => { setPage(0) }, [filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        Showing {visible.length} of {allExperiments.length} experiments
        {filtered.length < allExperiments.length && ` (${filtered.length} match filters)`}
        {pageCount > 1 && ` · Page ${page + 1} of ${pageCount}`}
      </p>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          No experiments match the current filters
        </div>
      ) : (
        <>
          <div className="overflow-auto rounded border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
                    ID
                  </th>
                  {ALL_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((exp) => {
                  const isSelected = exp.id === selectedExperimentId
                  return (
                    <tr
                      key={exp.id}
                      onClick={() => setSelectedExperiment(isSelected ? null : exp.id)}
                      className={[
                        'cursor-pointer border-t border-gray-100 transition-colors',
                        isSelected
                          ? 'bg-blue-50 hover:bg-blue-100'
                          : 'bg-white hover:bg-gray-50',
                      ].join(' ')}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-3 py-2 font-mono text-xs text-gray-500">
                        {exp.id}
                      </td>
                      {ALL_COLUMNS.map((col) => (
                        <td key={col} className="px-3 py-2 tabular-nums text-gray-800">
                          {getValue(exp, col)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>
              <span>
                Page {page + 1} of {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page === pageCount - 1}
                className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
