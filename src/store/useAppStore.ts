import { create } from 'zustand'
import type { Filter, FieldName } from '../types/index'
import { INPUT_FIELDS, OUTPUT_FIELDS, getValue } from '../utils/fields'
import { arrayMin, arrayMax } from '../utils/math'
import { allExperiments } from '../data/dataset'

interface AppState {
  selectedExperimentId: string | null
  setSelectedExperiment: (id: string | null) => void

  filters: Filter[]
  addFilter: () => void
  updateFilter: (id: string, patch: Partial<Filter>) => void
  removeFilter: (id: string) => void
  clearFilters: () => void

  scatterXField: FieldName
  scatterYField: FieldName
  setScatterXField: (f: FieldName) => void
  setScatterYField: (f: FieldName) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedExperimentId: null,
  setSelectedExperiment: (id) => set({ selectedExperimentId: id }),

  filters: [],
  addFilter: () =>
    set((state) => ({
      filters: [
        ...state.filters,
        (() => {
          const field = INPUT_FIELDS[0]
          const vals = allExperiments.map((e) => getValue(e, field))
          const mid = (arrayMin(vals) + arrayMax(vals)) / 2
          return { id: crypto.randomUUID(), field, operator: '>' as const, value: mid }
        })(),
      ],
    })),
  updateFilter: (id, patch) =>
    set((state) => ({
      filters: state.filters.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),
  removeFilter: (id) =>
    set((state) => ({ filters: state.filters.filter((f) => f.id !== id) })),
  clearFilters: () => set({ filters: [] }),

  scatterXField: INPUT_FIELDS[0],
  scatterYField: OUTPUT_FIELDS[0],
  setScatterXField: (f) => set({ scatterXField: f }),
  setScatterYField: (f) => set({ scatterYField: f }),
}))
