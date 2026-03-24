import rawData from '../assets/UncountableFrontEndDataset.json'

type RawExperiment = typeof rawData[keyof typeof rawData]

export type InputFieldName = keyof RawExperiment['inputs']
export type OutputFieldName = keyof RawExperiment['outputs']
export type FieldName = InputFieldName | OutputFieldName;

export interface ExperimentRow {
  id: string;
  inputs: Record<InputFieldName, number>;
  outputs: Record<OutputFieldName, number>;
}

export type FilterOperator = '>' | '<' | '=' | 'range';

export interface Filter {
  id: string;
  field: FieldName;
  operator: FilterOperator;
  value: number;
  valueTo?: number;   // only for 'range'
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  label: string;
  count: number;
  experimentIds: string[];
}

export interface HistogramConfig {
  outputField: OutputFieldName;
  outputMin: number;
  outputMax: number;
  inputField: InputFieldName;
  binCount: number;
  excludeZeros: boolean;
}
