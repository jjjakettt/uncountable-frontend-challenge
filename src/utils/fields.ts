import rawData from '../assets/UncountableFrontEndDataset.json'
import type { FieldName, InputFieldName, OutputFieldName, ExperimentRow } from '../types/index.ts'

const firstExp = Object.values(rawData)[0]

export const INPUT_FIELDS = Object.keys(firstExp.inputs) as InputFieldName[]
export const OUTPUT_FIELDS = Object.keys(firstExp.outputs) as OutputFieldName[]
export const ALL_FIELDS: FieldName[] = [...INPUT_FIELDS, ...OUTPUT_FIELDS]

export function getValue(exp: ExperimentRow, field: FieldName): number {
  const v = isInputField(field) ? exp.inputs[field] : exp.outputs[field]
  if (v == null || Number.isNaN(v)) {
    console.error(`getValue: missing value for field "${field}" on experiment "${exp.id}"`)
    return NaN
  }
  return v
}

export function isInputField(field: FieldName): field is InputFieldName {
  return (INPUT_FIELDS as FieldName[]).includes(field)
}
