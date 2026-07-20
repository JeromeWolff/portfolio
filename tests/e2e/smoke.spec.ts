import { expect, test } from '@playwright/test';

test('home page renders the Astro landing sections', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Jerome Wolff/);
  await expect(page.getByRole('heading', { level: 1, name: 'Jerome Wolff' })).toBeVisible();
  await expect(page.getByRole('link', { name: /View projects/i })).toBeVisible();
});
