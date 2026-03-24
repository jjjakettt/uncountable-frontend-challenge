import type { FieldName } from '../../types/index'

interface Props {
  fields: FieldName[]
  value: FieldName
  onChange: (f: FieldName) => void
  label?: string
}

export function FieldSelect({ fields, value, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      {label && <span className="text-gray-600">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FieldName)}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {fields.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
    </label>
  )
}
