interface Props {
  min: number
  max: number
  low: number
  high: number
  onLowChange: (v: number) => void
  onHighChange: (v: number) => void
  step?: number
  label?: string
}

// Track width in px — must match the w-* class on the track container
const TRACK_W = 160 // w-40
const THUMB = 16    // h-4 w-4

function thumbPx(frac: number) {
  return THUMB / 2 + frac * (TRACK_W - THUMB)
}

export function RangeSlider({ min, max, low, high, onLowChange, onHighChange, step = 1, label }: Props) {
  const range = max - min || 1
  const lowFrac  = (low  - min) / range
  const highFrac = (high - min) / range
  const lowPx    = thumbPx(lowFrac)
  const highPx   = thumbPx(highFrac)

  return (
    <div className="flex items-center gap-2 text-sm">
      {label && <span className="text-gray-600">{label}</span>}

      {/* Low value */}
      <span className="w-8 text-right text-xs tabular-nums text-gray-500">
        {Math.round(low)}
      </span>

      {/* Track */}
      <div className="relative h-5 w-40 shrink-0">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-gray-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-blue-400"
          style={{ left: lowPx, width: highPx - lowPx }}
        />
        <input
          type="range"
          min={min} max={max} step={step} value={low}
          onChange={(e) => onLowChange(Math.min(Number(e.target.value), high))}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: lowFrac > 0.95 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min} max={max} step={step} value={high}
          onChange={(e) => onHighChange(Math.max(Number(e.target.value), low))}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* High value */}
      <span className="w-8 text-xs tabular-nums text-gray-500">
        {Math.round(high)}
      </span>
    </div>
  )
}
