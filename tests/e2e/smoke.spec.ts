import { expect, test } from '@playwright/test';

test('home page renders the hero and primary sections', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Jerome Wolff/);
  await expect(
    page.getByRole('heading', { level: 1, name: /I build the backends/i })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /See the work/i })).toBeVisible();

  // Section landmarks are present.
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#path')).toBeVisible();
});
