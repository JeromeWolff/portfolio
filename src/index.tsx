import * as Sentry from '@sentry/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';

import '@styles/main/_index.scss';

let vendorInitialized = false;

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <DeferredVendor />
    </HelmetProvider>
  </React.StrictMode>
);

function DeferredVendor() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (cancelled) {
        return;
      }

      if (!vendorInitialized) {
        vendorInitialized = true;
        Sentry.init({
          dsn: process.env.SENTRY_DSN,
          sendDefaultPii: true,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.browserProfilingIntegration(),
            Sentry.replayIntegration(),
          ],
          tracesSampleRate: 0.85,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
        });
      }

      setMounted(true);
    };

    const idleId =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(run)
        : undefined;
    const timeoutId = idleId === undefined ? window.setTimeout(run, 1) : undefined;

    return () => {
      cancelled = true;
      if (typeof idleId === 'number' && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (typeof timeoutId === 'number') {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
