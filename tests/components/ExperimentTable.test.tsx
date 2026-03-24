import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExperimentTable } from '../../src/components/ExperimentTable'
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

describe('ExperimentTable', () => {
  beforeEach(resetStore)

  it('renders "Showing 25 of 25 experiments" by default', () => {
    render(<ExperimentTable />)
    expect(screen.getByText('Showing 25 of 25 experiments')).toBeInTheDocument()
  })

  it('shows empty state when filters produce 0 matches', () => {
    useAppStore.setState({
      filters: [
        { id: 'f1', field: OUTPUT_FIELDS[0], operator: '>', value: 1e9 },
      ],
    })
    render(<ExperimentTable />)
    expect(screen.getByText('No experiments match the current filters')).toBeInTheDocument()
  })

  it('selected row has bg-blue-50 class when selectedExperimentId matches', () => {
    const exp = allExperiments[0]
    useAppStore.setState({ selectedExperimentId: exp.id })
    render(<ExperimentTable />)
    const rows = screen.getAllByRole('row')
    const selectedRow = rows.find((r) => r.classList.contains('bg-blue-50'))
    expect(selectedRow).toBeTruthy()
    expect(selectedRow).toHaveTextContent(exp.id)
  })

  it('clicking a row sets selectedExperimentId', () => {
    render(<ExperimentTable />)
    const rows = screen.getAllByRole('row')
    // rows[0] is the header, rows[1] is first data row
    fireEvent.click(rows[1])
    expect(useAppStore.getState().selectedExperimentId).toBe(allExperiments[0].id)
  })

  it('clicking the same row again sets selectedExperimentId to null', () => {
    render(<ExperimentTable />)
    const rows = screen.getAllByRole('row')
    fireEvent.click(rows[1])
    fireEvent.click(rows[1])
    expect(useAppStore.getState().selectedExperimentId).toBeNull()
  })
})
