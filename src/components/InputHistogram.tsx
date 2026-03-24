import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { HistogramConfig } from '../types/index'
import { computeHistogram } from '../utils/histogram'
import { allExperiments } from '../data/dataset'
import { useAppStore } from '../store/useAppStore'

interface Props {
  config: HistogramConfig
}

export function InputHistogram({ config }: Props) {
  const selectedId = useAppStore((s) => s.selectedExperimentId)
  const setSelected = useAppStore((s) => s.setSelectedExperiment)

  const bins = computeHistogram(allExperiments, config)
  const hasData = bins.some((b) => b.count > 0)

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No experiments in this range
      </div>
    )
  }

  function handleBarClick(experimentIds: string[]) {
    if (experimentIds.length === 0) return
    const allSelected = experimentIds.every((id) => id === selectedId)
    if (allSelected) {
      setSelected(null)
    } else {
      setSelected(experimentIds[0])
    }
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={bins} margin={{ top: 8, right: 16, left: 0, bottom: 60 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          formatter={(value) => [value, 'Count']}
          labelFormatter={(label) => `Range: ${label}`}
        />
        <Bar
          dataKey="count"
          cursor="pointer"
          onClick={(data: any) => handleBarClick(data.experimentIds ?? [])}
        >
          {bins.map((bin, i) => {
            const isSelected = bin.experimentIds.includes(selectedId ?? '')
            return (
              <Cell
                key={i}
                fill={isSelected ? '#2563eb' : '#93c5fd'}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
