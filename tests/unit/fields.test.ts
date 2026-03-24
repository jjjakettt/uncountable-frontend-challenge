import { describe, it, expect } from 'vitest'
import { INPUT_FIELDS, OUTPUT_FIELDS, ALL_FIELDS, getValue, isInputField } from '../../src/utils/fields.ts'
import { allExperiments } from '../../src/data/dataset.ts'

describe('INPUT_FIELDS / OUTPUT_FIELDS', () => {
  it('derives input fields from dataset', () => {
    expect(INPUT_FIELDS).toContain('Polymer 1')
    expect(INPUT_FIELDS).toContain('Oven Temperature')
    expect(INPUT_FIELDS.length).toBe(19)
  })

  it('derives output fields from dataset', () => {
    expect(OUTPUT_FIELDS).toContain('Viscosity')
    expect(OUTPUT_FIELDS).toContain('Compression Set')
    expect(OUTPUT_FIELDS.length).toBe(5)
  })

  it('ALL_FIELDS combines both', () => {
    expect(ALL_FIELDS.length).toBe(24)
    expect(ALL_FIELDS).toContain('Polymer 1')
    expect(ALL_FIELDS).toContain('Viscosity')
  })
})

describe('getValue', () => {
  const exp = allExperiments[0]

  it('returns input value', () => {
    expect(getValue(exp, 'Polymer 1')).toBe(exp.inputs['Polymer 1'])
  })

  it('returns output value', () => {
    expect(getValue(exp, 'Viscosity')).toBe(exp.outputs['Viscosity'])
  })
})

describe('isInputField', () => {
  it('returns true for input fields', () => {
    expect(isInputField('Polymer 1')).toBe(true)
    expect(isInputField('Oven Temperature')).toBe(true)
  })

  it('returns false for output fields', () => {
    expect(isInputField('Viscosity')).toBe(false)
    expect(isInputField('Tensile Strength')).toBe(false)
  })
})
