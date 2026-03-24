import { useAppStore } from '../store/useAppStore'
import { allExperiments } from '../data/dataset'
import { INPUT_FIELDS, OUTPUT_FIELDS } from '../utils/fields'
import { CloseButton } from './shared/CloseButton'

export function ExperimentDetailPanel() {
  const selectedExperimentId = useAppStore((s) => s.selectedExperimentId)
  const setSelectedExperiment = useAppStore((s) => s.setSelectedExperiment)

  const experiment = selectedExperimentId
    ? allExperiments.find((e) => e.id === selectedExperimentId) ?? null
    : null

  return (
    <div
      data-testid="detail-panel"
      className="fixed right-0 top-0 z-50 flex h-screen w-80 flex-col bg-white shadow-2xl transition-transform duration-300"
      style={{ transform: experiment ? 'translateX(0)' : 'translateX(100%)' }}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">
          {experiment ? experiment.id : ''}
        </h2>
        <CloseButton onClick={() => setSelectedExperiment(null)} />
      </div>

      {experiment && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Inputs
            </h3>
            <div className="space-y-1">
              {INPUT_FIELDS.map((field) => {
                const value = experiment.inputs[field]
                return (
                  <div key={field} className="flex justify-between text-sm">
                    <span className="text-gray-700">{field}</span>
                    {value === 0 ? (
                      <span className="text-gray-400">not used</span>
                    ) : (
                      <span className="font-medium text-gray-900">{value}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Outputs
            </h3>
            <div className="space-y-1">
              {OUTPUT_FIELDS.map((field) => {
                const value = experiment.outputs[field]
                return (
                  <div key={field} className="flex justify-between text-sm">
                    <span className="text-gray-700">{field}</span>
                    {value === 0 ? (
                      <span className="text-gray-400">not used</span>
                    ) : (
                      <span className="font-medium text-gray-900">{value}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
