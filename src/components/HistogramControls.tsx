import { useState } from 'react'
import type { InputFieldName, OutputFieldName } from '../types/index'
import { INPUT_FIELDS, OUTPUT_FIELDS } from '../utils/fields'
import { allExperiments } from '../data/dataset'
import { FieldSelect } from './shared/FieldSelect'
import { RangeSlider } from './shared/RangeSlider'
import { InputHistogram } from './InputHistogram'

function dataRangeForOutput(field: OutputFieldName): { min: number; max: number } {
  const vals = allExperiments.map((e) => e.outputs[field])
  return { min: Math.floor(Math.min(...vals)), max: Math.ceil(Math.max(...vals)) }
}

export function HistogramControls() {
  const [outputField, setOutputField] = useState<OutputFieldName>(OUTPUT_FIELDS[0])
  const initialRange = dataRangeForOutput(OUTPUT_FIELDS[0])
  const [outputMin, setOutputMin] = useState<number>(initialRange.min)
  const [outputMax, setOutputMax] = useState<number>(initialRange.max)
  const [dataMin, setDataMin] = useState<number>(initialRange.min)
  const [dataMax, setDataMax] = useState<number>(initialRange.max)
  const [inputField, setInputField] = useState<InputFieldName>(INPUT_FIELDS[0])
  const [binCount, setBinCount] = useState<number>(10)
  const [excludeZeros, setExcludeZeros] = useState<boolean>(true)

  const config = { outputField, outputMin, outputMax, inputField, binCount, excludeZeros }

  function handleOutputFieldChange(field: OutputFieldName) {
    const { min, max } = dataRangeForOutput(field)
    setOutputField(field)
    setDataMin(min)
    setDataMax(max)
    setOutputMin(min)
    setOutputMax(max)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <FieldSelect
          fields={OUTPUT_FIELDS}
          value={outputField}
          onChange={(f) => handleOutputFieldChange(f as OutputFieldName)}
          label="Output field"
        />

        <RangeSlider
          min={dataMin}
          max={dataMax}
          low={outputMin}
          high={outputMax}
          onLowChange={setOutputMin}
          onHighChange={setOutputMax}
          label="Output range"
        />

        <FieldSelect
          fields={INPUT_FIELDS}
          value={inputField}
          onChange={(f) => setInputField(f as InputFieldName)}
          label="Input field"
        />

        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Bins</span>
          <input
            type="number"
            min={1}
            max={50}
            value={binCount}
            onChange={(e) => setBinCount(Math.max(1, Number(e.target.value)))}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={excludeZeros}
            onChange={(e) => setExcludeZeros(e.target.checked)}
            className="rounded"
          />
          Exclude zeros (not used)
        </label>
      </div>

      <InputHistogram config={config} />
    </div>
  )
}
