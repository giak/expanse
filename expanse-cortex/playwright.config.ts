import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    // Screenshots are sensitive to anti-aliasing, fonts, sub-pixel rendering.
    // Use a generous threshold to avoid false positives while still catching
    // major regressions (missing elements, broken layouts, shifted positions).
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1280, height: 720 },
  },
  // Dev server is managed externally (pnpm dev) — no webServer config needed.
  // Run: pnpm dev & then pnpm e2e
})
