import { test, expect } from '@playwright/test'

// ══════════════════════════════════════════════════════════════
// SCENARIO SCREENSHOT REGRESSION — P0.5 Captures Visuelles
// ══════════════════════════════════════════════════════════════
// Captures the visual state of each scenario as a baseline PNG.
// After refactors (P1 Effect Registry, P3 BaseNode), re-run to
// detect visual regressions (missing effects, shifted positions).
//
// Usage: pnpm dev & then pnpm e2e

const SCENARIOS = [
  'boot',
  'bonjour',
  'l2-audit',
  'l3-triangulation',
  'dream-cycle',
] as const

for (const scenario of SCENARIOS) {
  test(`${scenario} scenario renders correctly`, async ({ page }) => {
    // Navigate to the signal view with the desired scenario via hash URL.
    // Wait for networkidle so the SPA shell + JS bundles are fully loaded.
    await page.goto(`/#/signal?scenario=${scenario}`, { waitUntil: 'networkidle' })

    // The React app needs a moment to mount, route, and render the SVG.
    // Use locator-based wait instead of raw waitForSelector for reliability.
    const canvas = page.locator('[data-testid="signal-canvas"]')
    await canvas.waitFor({ state: 'visible', timeout: 15_000 })

    // Wait for the first step animation to settle.
    // SVG effects use CSS animations and JS-driven progress —
    // 2s gives enough time for the initial frame to render.
    await page.waitForTimeout(2000)

    // Clip to the signal canvas area to avoid flakiness from HUD/topnav
    const box = await canvas.boundingBox()
    if (!box) {
      throw new Error(`signal-canvas not visible for scenario ${scenario}`)
    }

    await expect(page).toHaveScreenshot(`${scenario}-baseline.png`, {
      clip: box,
    })
  })
}

test('signal view loads without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', err => errors.push(err.message))

  await page.goto('/#/signal?scenario=boot', { waitUntil: 'networkidle' })
  const canvas = page.locator('[data-testid="signal-canvas"]')
  await canvas.waitFor({ state: 'visible', timeout: 15_000 })
  await page.waitForTimeout(1500)

  // Filter out known benign errors (e.g. React DevTools, favicon)
  const realErrors = errors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('React DevTools') &&
    !e.includes('Download the React DevTools')
  )

  expect(realErrors).toEqual([])
})
