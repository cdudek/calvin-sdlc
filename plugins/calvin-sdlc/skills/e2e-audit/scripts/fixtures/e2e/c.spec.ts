import { test, expect } from '@playwright/test'

test('clocked', async ({ page }) => {
  await page.clock.install()
  const d = new Date()
  await page.getByRole('link').last().click()
  await expect(page.getByTestId('x')).toBeVisible()
})
