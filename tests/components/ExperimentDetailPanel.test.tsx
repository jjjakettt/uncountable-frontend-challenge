import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExperimentDetailPanel } from '../../src/components/ExperimentDetailPanel'
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

describe('ExperimentDetailPanel', () => {
  beforeEach(resetStore)

  it('root div has translateX(100%) when selectedExperimentId is null', () => {
    const { getByTestId } = render(<ExperimentDetailPanel />)
    const panel = getByTestId('detail-panel')
    expect(panel).toHaveStyle({ transform: 'translateX(100%)' })
  })

  it('root div has translateX(0) when an experiment is selected', () => {
    useAppStore.setState({ selectedExperimentId: allExperiments[0].id })
    const { getByTestId } = render(<ExperimentDetailPanel />)
    const panel = getByTestId('detail-panel')
    expect(panel).toHaveStyle({ transform: 'translateX(0)' })
  })

  it('shows experiment ID in heading when open', () => {
    const exp = allExperiments[0]
    useAppStore.setState({ selectedExperimentId: exp.id })
    render(<ExperimentDetailPanel />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(exp.id)
  })

  it('renders "Inputs" and "Outputs" section headings', () => {
    useAppStore.setState({ selectedExperimentId: allExperiments[0].id })
    render(<ExperimentDetailPanel />)
    expect(screen.getByText('Inputs')).toBeInTheDocument()
    expect(screen.getByText('Outputs')).toBeInTheDocument()
  })

  it('zero input values render as "not used"; non-zero values render as their number', () => {
    const exp = allExperiments[0]
    useAppStore.setState({ selectedExperimentId: exp.id })
    render(<ExperimentDetailPanel />)

    INPUT_FIELDS.filter((f) => exp.inputs[f] !== 0).forEach((f) => {
      expect(screen.getAllByText(String(exp.inputs[f])).length).toBeGreaterThan(0)
    })
    expect(screen.getAllByText('not used').length).toBeGreaterThan(0)
  })

  it('clicking Close button sets selectedExperimentId to null', () => {
    useAppStore.setState({ selectedExperimentId: allExperiments[0].id })
    render(<ExperimentDetailPanel />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(useAppStore.getState().selectedExperimentId).toBeNull()
  })
})
