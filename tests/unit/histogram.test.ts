import { describe, it, expect } from 'vitest'
import { computeHistogram } from '../../src/utils/histogram.ts'
import { allExperiments } from '../../src/data/dataset.ts'
import type { ExperimentRow, HistogramConfig } from '../../src/types/index.ts'

const baseConfig: HistogramConfig = {
  outputField: 'Viscosity',
  outputMin: 0,
  outputMax: 100000,
  inputField: 'Polymer 1',
  binCount: 5,
  excludeZeros: false,
}

const makeExp = (polymer1: number, viscosity: number): ExperimentRow => ({
  id: `exp-${polymer1}-${viscosity}`,
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

describe('computeHistogram', () => {
  it('returns binCount bins', () => {
    const bins = computeHistogram(allExperiments, baseConfig)
    expect(bins.length).toBe(5)
  })

  it('all bins have count 0 when no experiments match output range', () => {
    const bins = computeHistogram(allExperiments, { ...baseConfig, outputMin: 0, outputMax: 1 })
    expect(bins.every(b => b.count === 0)).toBe(true)
  })

  it('excludeZeros: true omits experiments where inputField is 0', () => {
    const exps = [makeExp(0, 100), makeExp(10, 100), makeExp(20, 100)]
    const withZeros = computeHistogram(exps, { ...baseConfig, outputMin: 0, outputMax: 200, excludeZeros: false })
    const withoutZeros = computeHistogram(exps, { ...baseConfig, outputMin: 0, outputMax: 200, excludeZeros: true })
    const totalWithZeros = withZeros.reduce((s, b) => s + b.count, 0)
    const totalWithoutZeros = withoutZeros.reduce((s, b) => s + b.count, 0)
    expect(totalWithZeros).toBe(3)
    expect(totalWithoutZeros).toBe(2)
  })

  it('excludeZeros: false includes zero-input experiments', () => {
    const exps = [makeExp(0, 100), makeExp(10, 100)]
    const bins = computeHistogram(exps, { ...baseConfig, outputMin: 0, outputMax: 200, excludeZeros: false })
    const total = bins.reduce((s, b) => s + b.count, 0)
    expect(total).toBe(2)
  })

  it('single experiment lands in correct bin', () => {
    const exps = [makeExp(5, 100)]
    const bins = computeHistogram(exps, { ...baseConfig, outputMin: 0, outputMax: 200, binCount: 1 })
    expect(bins[0].count).toBe(1)
    expect(bins[0].experimentIds).toContain('exp-5-100')
  })

  it('binCount: 1 produces one bin covering full range', () => {
    const bins = computeHistogram(allExperiments, { ...baseConfig, binCount: 1 })
    expect(bins.length).toBe(1)
    const total = bins[0].count
    const matching = allExperiments.filter(e => e.outputs['Viscosity'] >= 0 && e.outputs['Viscosity'] <= 100000)
    expect(total).toBe(matching.length)
  })

  it('all experiments in same bin when values are equal', () => {
    const exps = [makeExp(10, 100), makeExp(10, 200), makeExp(10, 300)]
    const bins = computeHistogram(exps, { ...baseConfig, outputMin: 0, outputMax: 400, binCount: 5 })
    const total = bins.reduce((s, b) => s + b.count, 0)
    expect(total).toBe(3)
    // All have same input value so all land in same bin
    const nonEmpty = bins.filter(b => b.count > 0)
    expect(nonEmpty.length).toBe(1)
    expect(nonEmpty[0].count).toBe(3)
  })

  it('experimentIds are populated correctly', () => {
    const exps = [makeExp(5, 100), makeExp(15, 100)]
    const bins = computeHistogram(exps, { ...baseConfig, outputMin: 0, outputMax: 200, binCount: 2 })
    const allIds = bins.flatMap(b => b.experimentIds)
    expect(allIds).toContain('exp-5-100')
    expect(allIds).toContain('exp-15-100')
  })
})
