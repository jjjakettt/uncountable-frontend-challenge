import { useAppStore } from '../store/useAppStore'
import { allExperiments } from '../data/dataset'
import { applyFilters } from '../utils/filters'
import { INPUT_FIELDS, OUTPUT_FIELDS, getValue } from '../utils/fields'

const ALL_COLUMNS = [...INPUT_FIELDS, ...OUTPUT_FIELDS]

export function ExperimentTable() {
  const { filters, selectedExperimentId, setSelectedExperiment } = useAppStore()
  const filtered = applyFilters(allExperiments, filters)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        Showing {filtered.length} of {allExperiments.length} experiments
      </p>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          No experiments match the current filters
        </div>
      ) : (
        <div className="overflow-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
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
              {filtered.map((exp) => {
                const isSelected = exp.id === selectedExperimentId
                return (
                  <tr
                    key={exp.id}
                    onClick={() => setSelectedExperiment(isSelected ? null : exp.id)}
                    className={[
                      'cursor-pointer border-t border-gray-100 transition-colors',
                      isSelected
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <td className="sticky left-0 bg-inherit px-3 py-2 font-mono text-xs text-gray-500">
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
      )}
    </div>
  )
}
