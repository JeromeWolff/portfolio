import { expect, test } from '@playwright/test';

test('home page renders the Astro landing sections', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Jerome Wolff/);
  await expect(page.getByRole('heading', { level: 1, name: 'Jerome Wolff' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Get in touch/i })).toBeVisible();
});

test('blog routes render listing and article content', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.getByRole('heading', { level: 1, name: 'Blog' })).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: /Optimizing Spring Boot Startup Time with Lazy Initialization/i,
    })
  ).toBeVisible();

  await page.goto('/blog/optimizing-spring-boot-startup-lazy-initialization');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Optimizing Spring Boot Startup Time with Lazy Initialization',
    })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to blog/i })).toBeVisible();
});
