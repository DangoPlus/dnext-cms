import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/DNext Blog/)
    await expect(page.getByRole('heading', { name: 'DNext Blog' })).toBeVisible()
    await expect(page.getByRole('link', { name: '首页' })).toBeVisible()
    await expect(page.locator('main')).toContainText(/最新文章|暂无文章/)
  })
})
