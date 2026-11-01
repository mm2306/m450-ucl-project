import react from '@vitejs/plugin-react';
import { loadEnv, type ProxyOptions } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const token = env.VITE_FOOTBALL_DATA_API_KEY?.trim();

  const apiProxy: Record<string, ProxyOptions> = {
    '/api/football-data': {
      target: 'https://api.football-data.org',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/football-data/, '/v4'),
      headers: token ? { 'X-Auth-Token': token } : {},
    },
  };

  return {
    plugins: [react()],
    define: {
      __UCL_API_ENABLED__: JSON.stringify(Boolean(token) || mode === 'test'),
    },
    server: {
      port: 5173,
      proxy: apiProxy,
    },
    preview: {
      port: 4173,
      proxy: apiProxy,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      reporters: ['default', 'junit'],
      outputFile: {
        junit: './reports/vitest/junit.xml',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        exclude: [
          'src/test/**',
          'src/mocks/**',
          'src/lib/types.ts',
          'src/main.tsx',
          'e2e/**',
          'dist/**',
          '.vite/**',
          '**/*.config.*',
          '**/*.d.ts',
        ],
      },
    },
  };
});
