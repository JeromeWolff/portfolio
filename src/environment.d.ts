/// <reference types="vite/client" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SENTRY_DSN: string;
      SENTRY_AUTH_TOKEN: string;
    }
  }

  interface ImportMetaEnv {
    readonly VITE_SITE_URL?: string;
  }
}

export {};
