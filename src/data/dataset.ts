import rawData from '../assets/UncountableFrontEndDataset.json'
import type { ExperimentRow, InputFieldName, OutputFieldName } from '../types/index.ts'

export const allExperiments: ExperimentRow[] = Object.entries(rawData).map(
  ([id, exp]) => ({
    id,
    inputs: exp.inputs as ExperimentRow['inputs'],
    outputs: exp.outputs as ExperimentRow['outputs'],
  })
)

const _firstExp = Object.values(rawData)[0]
const EXPECTED_INPUTS = Object.keys(_firstExp.inputs) as InputFieldName[]
const EXPECTED_OUTPUTS = Object.keys(_firstExp.outputs) as OutputFieldName[]

for (const exp of allExperiments) {
  for (const field of EXPECTED_INPUTS) {
    if (exp.inputs[field] == null) {
      console.error(`Dataset: experiment "${exp.id}" missing input field "${field}"`)
    }
  }
  for (const field of EXPECTED_OUTPUTS) {
    if (exp.outputs[field] == null) {
      console.error(`Dataset: experiment "${exp.id}" missing output field "${field}"`)
    }
  }
}
