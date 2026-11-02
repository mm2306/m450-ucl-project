import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../App';
import { getDemoStandings } from '../mocks/footballData';
import { server } from './server';

const renderApp = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRoutes />
    </MemoryRouter>,
  );

describe('Champions League app integration', () => {
  it('loads and renders the standings from the API', async () => {
    renderApp();

    expect(
      screen.getByRole('heading', { name: /Die Tabelle der Königsklasse/i }),
    ).toBeInTheDocument();

    const table = await screen.findByRole('table', {
      name: /Tabelle der UEFA Champions League/i,
    });

    expect(await screen.findByText('FC Bayern München')).toBeInTheDocument();
    expect(within(table).getAllByRole('row')).toHaveLength(37);
    expect(screen.getByText('Live-Daten')).toBeInTheDocument();
    expect(screen.queryByText(/Demo-Daten/)).not.toBeInTheDocument();
  });

  it('shows a loading skeleton before the data arrives', async () => {
    server.use(
      http.get('*/api/football-data/competitions/CL/standings', async () => {
        await delay(120);
        return HttpResponse.json(getDemoStandings());
      }),
    );

    renderApp();

    expect(screen.getByLabelText('Tabelle wird geladen')).toBeInTheDocument();
    expect(
      await screen.findByRole('table', { name: /Tabelle der UEFA Champions League/i }),
    ).toBeInTheDocument();
  });

  it('navigates to matches, filters by matchday and opens a detail view', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByRole('table', { name: /Tabelle der UEFA Champions League/i });

    await user.click(screen.getByRole('link', { name: 'Spiele' }));

    expect(
      await screen.findByRole('heading', { name: /Jeder Spieltag/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText('144 Spiele gefunden')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '3' }));
    expect(await screen.findByText('18 Spiele gefunden')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ergebnisse' }));
    expect(screen.getByText('18 Spiele gefunden')).toBeInTheDocument();
    expect(screen.getAllByTestId(/match-card-/)).toHaveLength(18);

    await user.click(screen.getAllByTestId(/match-card-/)[0]);

    expect(await screen.findByText('Zurück zum Spielplan')).toBeInTheDocument();
    expect(screen.getByText('Halbzeitstand')).toBeInTheDocument();
    expect(screen.getAllByText('Ligaphase').length).toBeGreaterThan(0);
  });

  it('falls back to demo data when the API rate limit is hit', async () => {
    server.use(
      http.get('*/api/football-data/competitions/CL/standings', () =>
        HttpResponse.json(
          { message: 'You have exceeded your request limit.' },
          { status: 429, headers: { 'Retry-After': '30' } },
        ),
      ),
    );

    renderApp();

    expect(
      await screen.findByText(/API-Limit von 10 Anfragen pro Minute ist erreicht/i),
    ).toBeInTheDocument();
    expect(await screen.findByText('FC Bayern München')).toBeInTheDocument();
    expect(screen.getByText('Demo-Daten')).toBeInTheDocument();
  });

  it('filters the standings table by team name', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByRole('table', {
      name: /Tabelle der UEFA Champions League/i,
    });

    await user.type(screen.getByRole('searchbox', { name: 'Team suchen' }), 'Bayern');

    expect(await screen.findByText('FC Bayern München')).toBeInTheDocument();
    expect(screen.queryByText('Real Madrid CF')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/standings-row-/)).toHaveLength(1);
  });

  it('renders the 404 page for unknown routes', async () => {
    renderApp('/unbekannt');

    expect(await screen.findByRole('heading', { name: 'Abseits.' })).toBeInTheDocument();
    expect(screen.getByText('Fehler 404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zur Tabelle' })).toHaveAttribute('href', '/');
  });

  it('renders a not-found state for unknown matches', async () => {
    renderApp('/spiele/999999');

    expect(await screen.findByText('Spiel nicht gefunden')).toBeInTheDocument();
  });
});
