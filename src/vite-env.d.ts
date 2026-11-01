/// <reference types="vite/client" />

declare const __UCL_API_ENABLED__: boolean;

interface ImportMetaEnv {
  readonly VITE_FOOTBALL_DATA_API_KEY?: string;
  readonly VITE_FOOTBALL_DATA_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
