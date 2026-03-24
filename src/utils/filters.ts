import type { ExperimentRow, Filter } from '../types/index.ts'
import { getValue } from './fields.ts'

const EPSILON = 1e-9

export function applyFilter(exp: ExperimentRow, filter: Filter): boolean {
  const v = getValue(exp, filter.field)
  switch (filter.operator) {
    case '>': return v > filter.value
    case '<': return v < filter.value
    case '=': return Math.abs(v - filter.value) < EPSILON
    case 'range': {
      if (filter.valueTo === undefined) return false
      return v >= filter.value && v <= filter.valueTo
    }
  }
}

export function applyFilters(experiments: ExperimentRow[], filters: Filter[]): ExperimentRow[] {
  if (filters.length === 0) return experiments
  return experiments.filter(exp => filters.every(f => applyFilter(exp, f)))
}
