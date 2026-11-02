import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { server } from './server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  window.scrollTo = vi.fn();
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

afterAll(() => {
  server.close();
});
