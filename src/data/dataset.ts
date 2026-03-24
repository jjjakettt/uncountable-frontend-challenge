import rawData from '../assets/UncountableFrontEndDataset.json'
import type { ExperimentRow } from '../types/index.ts'

export const allExperiments: ExperimentRow[] = Object.entries(rawData).map(
  ([id, exp]) => ({
    id,
    inputs: exp.inputs as ExperimentRow['inputs'],
    outputs: exp.outputs as ExperimentRow['outputs'],
  })
)
