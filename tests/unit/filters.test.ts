import { describe, it, expect } from 'vitest'
import { applyFilter, applyFilters } from '../../src/utils/filters.ts'
import { allExperiments } from '../../src/data/dataset.ts'
import type { ExperimentRow, Filter } from '../../src/types/index.ts'

const makeFilter = (partial: Partial<Filter>): Filter => ({
  id: 'test',
  field: 'Polymer 1',
  operator: '>',
  value: 0,
  ...partial,
})

const makeExp = (polymer1: number, viscosity = 100): ExperimentRow => ({
  id: 'test-exp',
  inputs: {
    'Polymer 1': polymer1,
    'Polymer 2': 0, 'Polymer 3': 0, 'Polymer 4': 0,
    'Carbon Black High Grade': 0, 'Carbon Black Low Grade': 0,
    'Silica Filler 1': 0, 'Silica Filler 2': 0,
    'Plasticizer 1': 0, 'Plasticizer 2': 0, 'Plasticizer 3': 0,
    'Antioxidant': 0, 'Coloring Pigment': 0,
    'Co-Agent 1': 0, 'Co-Agent 2': 0, 'Co-Agent 3': 0,
    'Curing Agent 1': 0, 'Curing Agent 2': 0, 'Oven Temperature': 0,
  },
  outputs: {
    'Viscosity': viscosity,
    'Cure Time': 0, 'Elongation': 0, 'Tensile Strength': 0, 'Compression Set': 0,
  },
})

describe('applyFilter — operators', () => {
  it('> returns true when value is greater', () => {
    expect(applyFilter(makeExp(10), makeFilter({ operator: '>', value: 5 }))).toBe(true)
  })

  it('> returns false when value is equal or less', () => {
    expect(applyFilter(makeExp(5), makeFilter({ operator: '>', value: 5 }))).toBe(false)
    expect(applyFilter(makeExp(3), makeFilter({ operator: '>', value: 5 }))).toBe(false)
  })

  it('< returns true when value is less', () => {
    expect(applyFilter(makeExp(3), makeFilter({ operator: '<', value: 5 }))).toBe(true)
  })

  it('< returns false when value is equal or greater', () => {
    expect(applyFilter(makeExp(5), makeFilter({ operator: '<', value: 5 }))).toBe(false)
    expect(applyFilter(makeExp(7), makeFilter({ operator: '<', value: 5 }))).toBe(false)
  })

  it('= returns true for exact match', () => {
    expect(applyFilter(makeExp(5), makeFilter({ operator: '=', value: 5 }))).toBe(true)
  })

  it('= uses epsilon for float equality (0.1 + 0.2)', () => {
    expect(applyFilter(makeExp(0.1 + 0.2), makeFilter({ operator: '=', value: 0.3 }))).toBe(true)
  })

  it('= returns false for clearly different values', () => {
    expect(applyFilter(makeExp(5.1), makeFilter({ operator: '=', value: 5 }))).toBe(false)
  })

  it('range returns true when within bounds', () => {
    expect(applyFilter(makeExp(5), makeFilter({ operator: 'range', value: 3, valueTo: 7 }))).toBe(true)
  })

  it('range returns true at boundaries (inclusive)', () => {
    expect(applyFilter(makeExp(3), makeFilter({ operator: 'range', value: 3, valueTo: 7 }))).toBe(true)
    expect(applyFilter(makeExp(7), makeFilter({ operator: 'range', value: 3, valueTo: 7 }))).toBe(true)
  })

  it('range returns false outside bounds', () => {
    expect(applyFilter(makeExp(2), makeFilter({ operator: 'range', value: 3, valueTo: 7 }))).toBe(false)
    expect(applyFilter(makeExp(8), makeFilter({ operator: 'range', value: 3, valueTo: 7 }))).toBe(false)
  })

  it('range returns false gracefully when valueTo is missing', () => {
    expect(applyFilter(makeExp(5), makeFilter({ operator: 'range', value: 3 }))).toBe(false)
  })
})

describe('applyFilters', () => {
  it('returns all experiments when filters array is empty', () => {
    expect(applyFilters(allExperiments, []).length).toBe(allExperiments.length)
  })

  it('returns empty array for empty experiments input', () => {
    expect(applyFilters([], [makeFilter({ operator: '>', value: 0 })])).toEqual([])
  })

  it('returns single matching experiment', () => {
    const exp = makeExp(10)
    const result = applyFilters([exp], [makeFilter({ operator: '>', value: 5 })])
    expect(result).toEqual([exp])
  })

  it('returns empty array for contradictory filters', () => {
    const filters = [
      makeFilter({ id: 'f1', operator: '>', value: 10 }),
      makeFilter({ id: 'f2', operator: '<', value: 5 }),
    ]
    expect(applyFilters([makeExp(7)], filters)).toEqual([])
  })

  it('applies AND logic across multiple filters', () => {
    const exps = [makeExp(5), makeExp(15), makeExp(25)]
    const filters = [
      makeFilter({ id: 'f1', operator: '>', value: 3 }),
      makeFilter({ id: 'f2', operator: '<', value: 20 }),
    ]
    const result = applyFilters(exps, filters)
    expect(result.map(e => e.inputs['Polymer 1'])).toEqual([5, 15])
  })

  it('filters real experiments from dataset', () => {
    const filter = makeFilter({ field: 'Viscosity', operator: '>', value: 5000 })
    const result = applyFilters(allExperiments, [filter])
    expect(result.every(e => e.outputs['Viscosity'] > 5000)).toBe(true)
  })
})
