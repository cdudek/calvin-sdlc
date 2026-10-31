import { test, expect } from '@playwright/test'

test('slow and positional', async ({ page }) => {
  await page.waitForTimeout(500)
  await page.waitForLoadState('networkidle')
  await page.locator('.btn-primary').click()
  await page.locator('td').nth(2).click()
  await page.getByRole('button').first().click({ force: true })
  expect(await page.getByText('Save').isVisible()).toBe(true)
  if (await page.getByTestId('banner').isVisible()) {
    await page.getByRole('button', { name: 'Close' }).click()
  }
})

test.skip('later', async () => {})
