import type { ExperimentRow, HistogramBin, HistogramConfig } from '../types/index.ts'
import { arrayMin, arrayMax } from './math'

export function computeHistogram(experiments: ExperimentRow[], config: HistogramConfig): HistogramBin[] {
  const { outputField, outputMin, outputMax, inputField, binCount, excludeZeros } = config

  // Filter to experiments within the output range
  const matching = experiments.filter(exp => {
    const v = exp.outputs[outputField]
    return v >= outputMin && v <= outputMax
  })

  // Collect input values (and track experiment ids)
  const entries = matching
    .filter(exp => !excludeZeros || exp.inputs[inputField] !== 0)
    .map(exp => ({ id: exp.id, value: exp.inputs[inputField] }))

  if (entries.length === 0) {
    return buildEmptyBins(binCount)
  }

  const vals = entries.map(e => e.value)
  const min = arrayMin(vals)
  const max = arrayMax(vals)
  const range = max - min

  // Build bins
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const binStart = min + (range * i) / binCount
    const binEnd = min + (range * (i + 1)) / binCount
    return {
      binStart,
      binEnd,
      label: `${binStart.toFixed(1)}–${binEnd.toFixed(1)}`,
      count: 0,
      experimentIds: [],
    }
  })

  // Place each entry into its bin
  for (const { id, value } of entries) {
    // When all values are identical (range === 0), everything goes in the last bin
    let idx = range === 0
      ? binCount - 1
      : Math.floor(((value - min) / range) * binCount)
    // Last bin is inclusive on both ends
    if (idx === binCount) idx = binCount - 1
    bins[idx].count++
    bins[idx].experimentIds.push(id)
  }

  return bins
}

function buildEmptyBins(binCount: number): HistogramBin[] {
  return Array.from({ length: binCount }, () => ({
    binStart: 0,
    binEnd: 0,
    label: '',
    count: 0,
    experimentIds: [],
  }))
}
