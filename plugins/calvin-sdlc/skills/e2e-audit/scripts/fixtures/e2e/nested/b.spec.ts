import { test, expect } from '@playwright/test'

// page.waitForTimeout(1) in a comment is ignored
test('dates', async ({ page }) => {
  const today = new Date()
  await expect(page.getByTestId('d')).toHaveText(String(Date.now()))
})
