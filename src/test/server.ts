import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getDemoMatches, getDemoStandings } from '../mocks/footballData';

export const handlers = [
  http.get('*/api/football-data/competitions/CL/standings', () =>
    HttpResponse.json(getDemoStandings()),
  ),
  http.get('*/api/football-data/competitions/CL/matches', () =>
    HttpResponse.json(getDemoMatches()),
  ),
];

export const server = setupServer(...handlers);
