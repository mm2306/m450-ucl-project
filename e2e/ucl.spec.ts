import { expect, test } from '@playwright/test';
import { getDemoMatches, getDemoStandings } from '../src/mocks/footballData';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/football-data/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/competitions/CL/standings')) {
      await route.fulfill({ json: getDemoStandings() });
      return;
    }

    if (url.includes('/competitions/CL/matches')) {
      await route.fulfill({ json: getDemoMatches() });
      return;
    }

    await route.continue();
  });
});

test('shows the standings on the start page', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Die Tabelle der Königsklasse/i }),
  ).toBeVisible();

  const table = page.getByRole('table', {
    name: /Tabelle der UEFA Champions League/i,
  });

  await expect(table).toBeVisible();
  await expect(table.locator('tbody tr')).toHaveCount(36);
  await expect(table.getByText('FC Bayern München')).toBeVisible();
  await expect(page.getByText('Live-Daten')).toBeVisible();
  await expect(page.getByText('Demo-Daten')).toHaveCount(0);
});

test('navigates to matches, filters a matchday and opens a match detail', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('table', { name: /Tabelle der UEFA Champions League/i }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Spiele' }).click();

  await expect(
    page.getByRole('heading', { name: /Jeder Spieltag. Jedes Tor/i }),
  ).toBeVisible();
  await expect(page.locator('[data-testid^="match-card-"]')).toHaveCount(144);

  await page.getByRole('button', { name: '3', exact: true }).click();
  await expect(page.getByText('18 Spiele gefunden')).toBeVisible();
  await expect(page.locator('[data-testid^="match-card-"]')).toHaveCount(18);

  await page.getByRole('button', { name: 'Ergebnisse' }).click();
  await expect(page.getByText('18 Spiele gefunden')).toBeVisible();

  await page.locator('[data-testid^="match-card-"]').first().click();
  await expect(page).toHaveURL(/\/spiele\/\d+$/);
  await expect(page.getByText('Zurück zum Spielplan')).toBeVisible();
  await expect(page.getByRole('article')).toBeVisible();
  await expect(page.getByText('Halbzeitstand')).toBeVisible();

  await page.getByRole('link', { name: 'Zurück zum Spielplan' }).click();
  await expect(
    page.getByRole('heading', { name: /Jeder Spieltag. Jedes Tor/i }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Tabelle' }).click();
  await expect(
    page.getByRole('table', { name: /Tabelle der UEFA Champions League/i }),
  ).toBeVisible();
});
