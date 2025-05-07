import * as Sentry from "@sentry/react";

interface SentryProps {
  dsn: string | undefined;
}

export function initSentry(props: SentryProps) {
  Sentry.init({
    dsn: props.dsn,
    sendDefaultPii: true,
  });
}
