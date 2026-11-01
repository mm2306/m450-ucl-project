import { getDemoMatches, getDemoStandings } from '../mocks/footballData';
import type {
  DataResult,
  MatchesResponse,
  Standing,
  StandingsResponse,
  TableRow,
} from './types';

type ApiStandingRow = Omit<TableRow, 'played'> & {
  played?: number;
  playedGames?: number;
};

type ApiStanding = Omit<Standing, 'table'> & { table: ApiStandingRow[] };

type ApiStandingsResponse = Omit<StandingsResponse, 'standings'> & {
  standings: ApiStanding[];
};

const API_BASE = (
  import.meta.env.VITE_FOOTBALL_DATA_API_URL || '/api/football-data'
).replace(/\/+$/, '');
const SHOULD_USE_API = __UCL_API_ENABLED__;
const CACHE_PREFIX = 'ucl-center:cache:v2:';
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  status: number;
  retryAfterSeconds: number | null;

  constructor(message: string, status: number, retryAfterSeconds: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface CachedEntry<T> {
  savedAt: number;
  data: T;
}

const requestTimestamps: number[] = [];
const inFlightRequests = new Map<string, Promise<DataResult<unknown>>>();
let requestChain: Promise<unknown> = Promise.resolve();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForRequestSlot = async () => {
  for (;;) {
    const now = Date.now();
    while (
      requestTimestamps.length > 0 &&
      now - requestTimestamps[0] >= RATE_LIMIT_WINDOW_MS
    ) {
      requestTimestamps.shift();
    }

    if (requestTimestamps.length < MAX_REQUESTS_PER_WINDOW) {
      requestTimestamps.push(now);
      return;
    }

    const waitMs = RATE_LIMIT_WINDOW_MS - (now - requestTimestamps[0]) + 100;
    await sleep(waitMs);
  }
};

const scheduleRequest = <T>(task: () => Promise<T>): Promise<T> => {
  const run = requestChain.then(async () => {
    await waitForRequestSlot();
    return task();
  });

  requestChain = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
};

const readCache = <T>(key: string, allowExpired = false): CachedEntry<T> | null => {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry<T>;
    if (!entry?.savedAt || entry.data === undefined) return null;
    if (!allowExpired && Date.now() - entry.savedAt > CACHE_TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
};

const writeCache = <T>(key: string, data: T) => {
  try {
    const entry: CachedEntry<T> = { savedAt: Date.now(), data };
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Storage can be full or disabled – the in-memory fallback still works.
  }
};

const apiRequest = async <T>(path: string): Promise<T> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      const resetHeader =
        response.headers.get('X-RequestCounter-Reset') ??
        response.headers.get('Retry-After');
      const retryAfter =
        resetHeader && Number.isFinite(Number(resetHeader))
          ? Number(resetHeader)
          : null;
      const body = await response.text().catch(() => '');
      throw new ApiError(
        body || `API-Fehler ${response.status}`,
        response.status,
        retryAfter,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Die Anfrage an die API hat zu lange gedauert.', 408);
    }
    throw new ApiError('Die API ist momentan nicht erreichbar.', 0);
  } finally {
    window.clearTimeout(timeout);
  }
};

const loadResource = async <T>(options: {
  cacheKey: string;
  path: string;
  fallback: () => T;
  force?: boolean;
}): Promise<DataResult<T>> => {
  const { cacheKey, path, fallback, force = false } = options;

  if (!force) {
    const cached = readCache<T>(cacheKey);
    if (cached) {
      return {
        data: cached.data,
        source: 'cache',
        fetchedAt: new Date(cached.savedAt).toISOString(),
      };
    }

    const pending = inFlightRequests.get(cacheKey);
    if (pending) return pending as Promise<DataResult<T>>;
  }

  const execute = async (): Promise<DataResult<T>> => {
    if (!SHOULD_USE_API) {
      return {
        data: fallback(),
        source: 'demo',
        fetchedAt: new Date().toISOString(),
        warning:
          'Kein API-Key hinterlegt. Die App zeigt realistische Demo-Daten, damit du alle Funktionen testen kannst.',
      };
    }

    try {
      const data = await scheduleRequest(() => apiRequest<T>(path));
      writeCache(cacheKey, data);
      return {
        data,
        source: 'live',
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const stale = readCache<T>(cacheKey, true);
      const isRateLimit = apiError?.status === 429;

      if (stale) {
        return {
          data: stale.data,
          source: 'cache',
          fetchedAt: new Date(stale.savedAt).toISOString(),
          warning: isRateLimit
            ? 'Das API-Limit von 10 Anfragen pro Minute ist erreicht. Es werden zwischengespeicherte Daten angezeigt.'
            : 'Die API ist momentan nicht erreichbar. Es werden zwischengespeicherte Daten angezeigt.',
        };
      }

      return {
        data: fallback(),
        source: 'demo',
        fetchedAt: new Date().toISOString(),
        warning: isRateLimit
          ? 'Das API-Limit von 10 Anfragen pro Minute ist erreicht. Solange werden Demo-Daten angezeigt.'
          : apiError?.status === 403
            ? 'Der API-Key wurde abgelehnt. Prüfe deinen X-Auth-Token in der .env-Datei. Bis dahin werden Demo-Daten angezeigt.'
            : 'Die Champions-League-Daten konnten nicht geladen werden. Bis die API wieder antwortet, werden Demo-Daten angezeigt.',
      };
    }
  };

  const request = execute().finally(() => {
    inFlightRequests.delete(cacheKey);
  });

  if (!force) {
    inFlightRequests.set(cacheKey, request as Promise<DataResult<unknown>>);
  }

  return request;
};

const adaptStandings = (response: ApiStandingsResponse): StandingsResponse => ({
  ...response,
  standings: response.standings.map((standing) => ({
    ...standing,
    table: standing.table.map((row) => ({
      ...row,
      played: row.played ?? row.playedGames ?? 0,
    })),
  })),
});

export const fetchStandings = async (force = false) => {
  const result = await loadResource<ApiStandingsResponse>({
    cacheKey: 'standings:CL',
    path: '/competitions/CL/standings',
    fallback: getDemoStandings,
    force,
  });

  return { ...result, data: adaptStandings(result.data) };
};

export const fetchMatches = (force = false) =>
  loadResource<MatchesResponse>({
    cacheKey: 'matches:CL',
    path: '/competitions/CL/matches',
    fallback: getDemoMatches,
    force,
  });

export const clearApiCache = () => {
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
};
