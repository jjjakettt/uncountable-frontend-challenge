export function arrayMin(vals: number[]): number {
  return vals.reduce((a, b) => (b < a ? b : a))
}

export function arrayMax(vals: number[]): number {
  return vals.reduce((a, b) => (b > a ? b : a))
}
