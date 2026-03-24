import type { FieldName } from '../../types/index'
import { INPUT_FIELDS, OUTPUT_FIELDS } from '../../utils/fields'

interface Props {
  fields: FieldName[]
  value: FieldName
  onChange: (f: FieldName) => void
  label?: string
}

const ALL_INPUTS = new Set(INPUT_FIELDS)
const ALL_OUTPUTS = new Set(OUTPUT_FIELDS)

export function FieldSelect({ fields, value, onChange, label }: Props) {
  const inputs = fields.filter((f) => ALL_INPUTS.has(f as typeof INPUT_FIELDS[number]))
  const outputs = fields.filter((f) => ALL_OUTPUTS.has(f as typeof OUTPUT_FIELDS[number]))
  const grouped = inputs.length > 0 && outputs.length > 0

  return (
    <label className="flex items-center gap-2 text-sm">
      {label && <span className="text-gray-600">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FieldName)}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {grouped ? (
          <>
            <optgroup label="Inputs">
              {inputs.map((f) => <option key={f} value={f}>{f}</option>)}
            </optgroup>
            <optgroup label="Outputs">
              {outputs.map((f) => <option key={f} value={f}>{f}</option>)}
            </optgroup>
          </>
        ) : (
          fields.map((f) => <option key={f} value={f}>{f}</option>)
        )}
      </select>
    </label>
  )
}
