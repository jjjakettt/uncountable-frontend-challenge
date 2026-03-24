import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBuilder } from '../../src/components/FilterBuilder'
import { useAppStore } from '../../src/store/useAppStore'
import { INPUT_FIELDS, OUTPUT_FIELDS } from '../../src/utils/fields'
import { allExperiments } from '../../src/data/dataset'

function resetStore() {
  useAppStore.setState({
    selectedExperimentId: null,
    filters: [],
    scatterXField: INPUT_FIELDS[0],
    scatterYField: OUTPUT_FIELDS[0],
  })
}

describe('FilterBuilder', () => {
  beforeEach(resetStore)

  it('"Add filter" button appends a filter row', () => {
    render(<FilterBuilder />)
    expect(screen.queryByRole('combobox')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /add filter/i }))
    expect(useAppStore.getState().filters).toHaveLength(1)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0)
  })

  it('"Remove" button removes that row', () => {
    render(<FilterBuilder />)
    fireEvent.click(screen.getByRole('button', { name: /add filter/i }))
    expect(useAppStore.getState().filters).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(useAppStore.getState().filters).toHaveLength(0)
  })

  it('"Clear all" removes all rows', () => {
    render(<FilterBuilder />)
    fireEvent.click(screen.getByRole('button', { name: /add filter/i }))
    fireEvent.click(screen.getByRole('button', { name: /add filter/i }))
    expect(useAppStore.getState().filters).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(useAppStore.getState().filters).toHaveLength(0)
  })

  it('match count text updates after adding a filter', () => {
    render(<FilterBuilder />)
    fireEvent.click(screen.getByRole('button', { name: /add filter/i }))
    expect(screen.getByText(/experiments match/)).toBeInTheDocument()
  })

  it('role="alert" warning is visible when an input field filter has value === 0', () => {
    useAppStore.setState({
      filters: [
        { id: 'f1', field: INPUT_FIELDS[0], operator: '>', value: 0 },
      ],
    })
    render(<FilterBuilder />)
    expect(screen.getByRole('alert')).toHaveTextContent('0 means ingredient not used')
  })

  it('warning is absent when the same filter targets an output field', () => {
    useAppStore.setState({
      filters: [
        { id: 'f1', field: OUTPUT_FIELDS[0], operator: '>', value: 0 },
      ],
    })
    render(<FilterBuilder />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('warning is absent when value is non-zero', () => {
    const field = INPUT_FIELDS[0]
    const vals = allExperiments.map((e) => e.inputs[field])
    const nonZero = Math.max(...vals)
    useAppStore.setState({
      filters: [
        { id: 'f1', field, operator: '>', value: nonZero },
      ],
    })
    render(<FilterBuilder />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('input field slider min is the non-zero minimum, not 0', () => {
    const field = INPUT_FIELDS[0]
    const nonZeroMin = Math.min(
      ...allExperiments.map((e) => e.inputs[field]).filter((v) => v !== 0)
    )
    useAppStore.setState({
      filters: [{ id: 'f1', field, operator: '>', value: nonZeroMin }],
    })
    render(<FilterBuilder />)
    const slider = screen.getAllByRole('slider')[0]
    expect(slider).toHaveAttribute('min', String(nonZeroMin))
    expect(slider).not.toHaveAttribute('min', '0')
  })

  it('output field slider min is the global min for that field', () => {
    const field = OUTPUT_FIELDS[0]
    const globalMin = Math.min(...allExperiments.map((e) => e.outputs[field]))
    useAppStore.setState({
      filters: [{ id: 'f1', field, operator: '>', value: globalMin }],
    })
    render(<FilterBuilder />)
    const slider = screen.getAllByRole('slider')[0]
    expect(slider).toHaveAttribute('min', String(globalMin))
  })
})
