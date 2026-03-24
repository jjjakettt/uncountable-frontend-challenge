import { describe, it, expect } from 'vitest'
import { linearRegression } from '../../src/utils/regression'

describe('linearRegression', () => {
  it('returns null for 0, 1, or 2 points', () => {
    expect(linearRegression([])).toBeNull()
    expect(linearRegression([{ x: 1, y: 2 }])).toBeNull()
    expect(linearRegression([{ x: 1, y: 2 }, { x: 2, y: 4 }])).toBeNull()
  })

  it('returns null when all X values are identical', () => {
    expect(linearRegression([{ x: 5, y: 1 }, { x: 5, y: 3 }, { x: 5, y: 7 }])).toBeNull()
  })

  it('computes correct slope and intercept for y = 2x + 1', () => {
    const result = linearRegression([{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }])
    expect(result).not.toBeNull()
    expect(result!.slope).toBeCloseTo(2)
    expect(result!.intercept).toBeCloseTo(1)
  })

  it('returns slope ≈ 0 for a flat line', () => {
    const result = linearRegression([{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }])
    expect(result).not.toBeNull()
    expect(result!.slope).toBeCloseTo(0)
    expect(result!.intercept).toBeCloseTo(4)
  })

  it('returns a numeric result for a noisy 4-point set', () => {
    const result = linearRegression([{ x: 1, y: 2 }, { x: 2, y: 2.5 }, { x: 3, y: 4.1 }, { x: 4, y: 3.9 }])
    expect(result).not.toBeNull()
    expect(typeof result!.slope).toBe('number')
    expect(typeof result!.intercept).toBe('number')
  })

  it('handles exactly 3 points (minimum valid input)', () => {
    const result = linearRegression([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }])
    expect(result).not.toBeNull()
    expect(result!.slope).toBeCloseTo(1)
    expect(result!.intercept).toBeCloseTo(0)
  })

  it('r² = 1 for a perfect linear fit', () => {
    const result = linearRegression([{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }])
    expect(result!.r2).toBeCloseTo(1)
  })

  it('r² = 1 when all Y values are identical (flat line, ssTot = 0)', () => {
    const result = linearRegression([{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }])
    expect(result!.r2).toBe(1)
  })

  it('0 ≤ r² ≤ 1 for a noisy dataset', () => {
    const result = linearRegression([{ x: 1, y: 2 }, { x: 2, y: 2.5 }, { x: 3, y: 4.1 }, { x: 4, y: 3.9 }])
    expect(result!.r2).toBeGreaterThanOrEqual(0)
    expect(result!.r2).toBeLessThanOrEqual(1)
  })
})
