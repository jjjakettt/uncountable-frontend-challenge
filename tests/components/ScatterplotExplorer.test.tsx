import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ScatterplotExplorer } from '../../src/components/ScatterplotExplorer'
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

describe('ScatterplotExplorer', () => {
  beforeEach(resetStore)

  it('role="alert" warning is present when X and Y are the same field', () => {
    useAppStore.setState({ scatterXField: INPUT_FIELDS[0], scatterYField: INPUT_FIELDS[0] })
    render(<ScatterplotExplorer />)
    expect(screen.getByRole('alert')).toHaveTextContent('X and Y axes are the same field')
  })

  it('warning is absent when X and Y differ', () => {
    useAppStore.setState({ scatterXField: INPUT_FIELDS[0], scatterYField: OUTPUT_FIELDS[0] })
    render(<ScatterplotExplorer />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('warning appears after changing a select to match the other axis', () => {
    useAppStore.setState({ scatterXField: INPUT_FIELDS[0], scatterYField: OUTPUT_FIELDS[0] })
    render(<ScatterplotExplorer />)
    expect(screen.queryByRole('alert')).toBeNull()

    // Y axis select is second combobox
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: INPUT_FIELDS[0] } })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders without crashing when all points share the same X value (Plasticizer 2)', () => {
    useAppStore.setState({ scatterXField: 'Plasticizer 2' as typeof INPUT_FIELDS[number] })
    expect(() => render(<ScatterplotExplorer />)).not.toThrow()
  })

  it('renders without crashing when filters leave only one matching point', () => {
    // Pick a value just below the maximum of the first output so only ~1 experiment matches
    const outputVals = allExperiments.map((e) => e.outputs[OUTPUT_FIELDS[0]])
    const maxVal = Math.max(...outputVals)
    useAppStore.setState({
      filters: [
        { id: 'f1', field: OUTPUT_FIELDS[0], operator: '>', value: maxVal - 0.001 },
      ],
    })
    expect(() => render(<ScatterplotExplorer />)).not.toThrow()
  })

  it('regression line is present in default state (X is input with non-zero values, X ≠ Y)', () => {
    render(<ScatterplotExplorer />)
    expect(screen.getByTestId('regression-active')).toBeInTheDocument()
  })

  it('regression line is absent when X and Y are the same field', () => {
    useAppStore.setState({ scatterXField: INPUT_FIELDS[0], scatterYField: INPUT_FIELDS[0] })
    render(<ScatterplotExplorer />)
    expect(screen.queryByTestId('regression-active')).toBeNull()
  })

  it('regression line is absent when filters reduce active points below 3', () => {
    const outputVals = allExperiments.map((e) => e.outputs[OUTPUT_FIELDS[0]])
    const maxVal = Math.max(...outputVals)
    useAppStore.setState({
      filters: [
        { id: 'f1', field: OUTPUT_FIELDS[0], operator: '>', value: maxVal - 0.001 },
      ],
    })
    render(<ScatterplotExplorer />)
    expect(screen.queryByTestId('regression-active')).toBeNull()
  })

  it('r² annotation is present when regression is active', () => {
    render(<ScatterplotExplorer />)
    expect(screen.getByTestId('r2-annotation')).toBeInTheDocument()
  })

  it('r² annotation is absent when X and Y are the same field', () => {
    useAppStore.setState({ scatterXField: INPUT_FIELDS[0], scatterYField: INPUT_FIELDS[0] })
    render(<ScatterplotExplorer />)
    expect(screen.queryByTestId('r2-annotation')).toBeNull()
  })

  it('x=0 input points are excluded: regression absent when all non-zero x are filtered out', () => {
    // Plasticizer 2 has many zero values; filter to keep only experiments where Plasticizer 2 > max
    useAppStore.setState({ scatterXField: 'Plasticizer 2' as typeof INPUT_FIELDS[number] })
    const vals = allExperiments.map((e) => e.inputs['Plasticizer 2' as typeof INPUT_FIELDS[number]])
    const maxVal = Math.max(...vals)
    useAppStore.setState({
      scatterXField: 'Plasticizer 2' as typeof INPUT_FIELDS[number],
      filters: [{ id: 'f1', field: OUTPUT_FIELDS[0], operator: '>', value: 1e9 }],
    })
    render(<ScatterplotExplorer />)
    expect(screen.queryByTestId('regression-active')).toBeNull()
  })
})
