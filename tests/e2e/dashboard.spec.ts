import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('detail panel via table row: click row opens panel, close empties heading', async ({ page }) => {
  await page.getByRole('button', { name: 'Table' }).click()

  const rows = page.locator('tbody tr')
  await rows.first().click()

  const panel = page.locator('[data-testid="detail-panel"]')
  const heading = panel.locator('h2')
  await expect(heading).not.toBeEmpty()

  await panel.getByRole('button', { name: 'Close' }).click()
  await expect(heading).toBeEmpty()
})

test('deselect via re-click: click a row twice empties the panel heading', async ({ page }) => {
  await page.getByRole('button', { name: 'Table' }).click()

  const row = page.locator('tbody tr').first()
  await row.click()

  const panel = page.locator('[data-testid="detail-panel"]')
  await expect(panel.locator('h2')).not.toBeEmpty()

  await row.click()
  await expect(panel.locator('h2')).toBeEmpty()
})

test('filters → no results: impossible filter shows empty state in Table tab', async ({ page }) => {
  await page.getByRole('button', { name: /filters/i }).click()
  await page.getByRole('button', { name: /add filter/i }).click()

  // Set the slider to its maximum value via JS so the '>' filter matches 0 experiments
  const slider = page.locator('input[type="range"]').first()
  await slider.evaluate((el) => {
    const input = el as HTMLInputElement
    input.value = input.max
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })

  await page.getByRole('button', { name: 'Table' }).click()
  await expect(page.getByText('No experiments match the current filters')).toBeVisible()
})

test('histogram renders: <rect> exists inside histogram tab', async ({ page }) => {
  await page.getByRole('button', { name: 'Histogram' }).click()
  const histogramTab = page.locator('[data-testid="tab-histogram"]')
  await expect(histogramTab.locator('rect').first()).toBeVisible()
})

test('"not used" in panel: opening any row shows "not used" text', async ({ page }) => {
  await page.getByRole('button', { name: 'Table' }).click()
  await page.locator('tbody tr').first().click()
  const panel = page.locator('[data-testid="detail-panel"]')
  await expect(panel.getByText('not used').first()).toBeVisible()
})

test('long field name renders: "Carbon Black High Grade" appears in an axis select', async ({ page }) => {
  await page.getByRole('button', { name: 'Scatterplot' }).click()
  const found = await page.locator('select').evaluateAll((els) =>
    els.some((el) =>
      Array.from((el as HTMLSelectElement).options).some(
        (o) => o.text === 'Carbon Black High Grade'
      )
    )
  )
  expect(found).toBe(true)
})
