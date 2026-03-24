import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { FieldSelect } from './shared/FieldSelect'
import { ALL_FIELDS, getValue } from '../utils/fields'
import { allExperiments } from '../data/dataset'
import type { Filter, FilterOperator } from '../types/index'

const OPERATORS: FilterOperator[] = ['>', '<', '=']

function fieldRange(field: Filter['field']): [number, number] {
  const vals = allExperiments.map((e) => getValue(e, field))
  return [Math.min(...vals), Math.max(...vals)]
}

function FilterRow({ filter, onUpdate, onRemove }: {
  filter: Filter
  onUpdate: (patch: Partial<Filter>) => void
  onRemove: () => void
}) {
  const [min, max] = useMemo(() => fieldRange(filter.field), [filter.field])
  const step = (max - min) / 200

  return (
    <div className="flex items-center gap-3">
      <FieldSelect
        fields={ALL_FIELDS}
        value={filter.field}
        onChange={(f) => onUpdate({ field: f })}
      />
      <select
        value={filter.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as FilterOperator })}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {OPERATORS.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={filter.value}
        onChange={(e) => onUpdate({ value: parseFloat(e.target.value) })}
        className="w-40 accent-blue-600"
      />
      <span className="w-16 text-sm tabular-nums text-gray-700">
        {filter.value.toFixed(2)}
      </span>
      <button
        onClick={onRemove}
        className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-red-600"
      >
        Remove
      </button>
    </div>
  )
}

export function FilterBuilder() {
  const { filters, addFilter, updateFilter, removeFilter, clearFilters } = useAppStore()

  return (
    <div className="flex flex-col gap-2">
      {filters.map((filter) => (
        <FilterRow
          key={filter.id}
          filter={filter}
          onUpdate={(patch) => updateFilter(filter.id, patch)}
          onRemove={() => removeFilter(filter.id)}
        />
      ))}
      <div className="flex items-center gap-2">
        <button
          onClick={addFilter}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add filter
        </button>
        {filters.length > 0 && (
          <button
            onClick={clearFilters}
            className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
