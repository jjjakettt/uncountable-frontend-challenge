import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ScatterShapeProps } from 'recharts'
import { useAppStore } from '../store/useAppStore'
import { FieldSelect } from './shared/FieldSelect'
import { ALL_FIELDS, getValue } from '../utils/fields'
import { allExperiments } from '../data/dataset'
import { applyFilters } from '../utils/filters'

export function ScatterplotExplorer() {
  const scatterXField = useAppStore((s) => s.scatterXField)
  const scatterYField = useAppStore((s) => s.scatterYField)
  const setScatterXField = useAppStore((s) => s.setScatterXField)
  const setScatterYField = useAppStore((s) => s.setScatterYField)
  const selectedExperimentId = useAppStore((s) => s.selectedExperimentId)
  const setSelectedExperiment = useAppStore((s) => s.setSelectedExperiment)
  const filters = useAppStore((s) => s.filters)

  const sameField = scatterXField === scatterYField

  const matchingIds = filters.length > 0
    ? new Set(applyFilters(allExperiments, filters).map((e) => e.id))
    : null

  const points = allExperiments.map((exp) => ({
    id: exp.id,
    x: getValue(exp, scatterXField),
    y: getValue(exp, scatterYField),
  }))

  function handleClick(data: unknown) {
    const id = (data as { id?: string } | undefined)?.id
    if (!id) return
    setSelectedExperiment(selectedExperimentId === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <FieldSelect
          fields={ALL_FIELDS}
          value={scatterXField}
          onChange={setScatterXField}
          label="X axis"
        />
        <FieldSelect
          fields={ALL_FIELDS}
          value={scatterYField}
          onChange={setScatterYField}
          label="Y axis"
        />
      </div>

      {sameField && (
        <div
          role="alert"
          className="rounded border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800"
        >
          X and Y axes are the same field
        </div>
      )}

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 8, right: 24, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name={scatterXField}
            label={{ value: scatterXField, position: 'insideBottom', offset: -20 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={scatterYField}
            label={{ value: scatterYField, angle: -90, position: 'insideLeft', offset: 10 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0].payload as { id: string; x: number; y: number }
              return (
                <div className="rounded border border-gray-200 bg-white px-3 py-2 text-xs shadow">
                  <div className="font-medium text-gray-700">{d.id}</div>
                  <div>
                    {scatterXField}: {d.x}
                  </div>
                  <div>
                    {scatterYField}: {d.y}
                  </div>
                </div>
              )
            }}
          />
          <Scatter
            data={points}
            onClick={(data) => handleClick(data)}
            shape={(props: ScatterShapeProps & { payload?: { id: string } }) => {
              const cx = props.cx as number
              const cy = props.cy as number
              const payload = props.payload
              const isSelected = payload?.id === selectedExperimentId
              const isFiltered = matchingIds !== null && !matchingIds.has(payload?.id ?? '')
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 8 : 5}
                  fill={isSelected ? '#2563eb' : isFiltered ? '#e5e7eb' : '#93c5fd'}
                  stroke={isSelected ? '#1d4ed8' : isFiltered ? '#d1d5db' : '#3b82f6'}
                  strokeWidth={1}
                  opacity={isFiltered ? 0.4 : 1}
                  style={{ cursor: 'pointer' }}
                />
              )
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
