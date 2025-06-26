declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SENTRY_DSN: string;
      SENTRY_AUTH_TOKEN: string;
    }
  }
}
