import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hansoom/);
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('hero shows Static label initially', async ({ page }) => {
    const staticLabel = page.locator('.static-label');
    await expect(staticLabel).toBeVisible();
  });

  test('theme toggle is present', async ({ page }) => {
    const toggle = page.getByLabel(/switch to/i);
    await expect(toggle).toBeVisible();
  });

  test('footer links are present', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('GitHub')).toBeVisible();
    await expect(footer.getByText('Documentation')).toBeVisible();
  });

  test('install command is visible', async ({ page }) => {
    const code = page.locator('.install-code code');
    await expect(code).toContainText('npx hansoom');
  });

  test('OG meta tags are present', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Hansoom/);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /og-image/);

    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
  });

  test('outbound links have UTM tags', async ({ page }) => {
    const githubLink = page.locator('.footer-links a[href*="github.com"]');
    const href = await githubLink.getAttribute('href');
    expect(href).toContain('utm_source=hansoom_dev');
    expect(href).toContain('utm_campaign=launch');
  });
});

test.describe('visual regression', () => {
  test('hero at desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const hero = page.locator('.hero-sticky');
    await expect(hero).toHaveScreenshot('hero-desktop.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('hero at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const hero = page.locator('.hero-sticky');
    await expect(hero).toHaveScreenshot('hero-mobile.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('pitch section at desktop', async ({ page }) => {
    await page.goto('/');
    const pitch = page.locator('.pitch');
    await pitch.scrollIntoViewIfNeeded();
    await expect(pitch).toHaveScreenshot('pitch-desktop.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
