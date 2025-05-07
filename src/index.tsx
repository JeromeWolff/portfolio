import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import {SpeedInsights} from "@vercel/speed-insights/react";
import {Analytics} from "@vercel/analytics/react";
import './styles/index.scss';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 0.85,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const rootElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App/>
    <SpeedInsights/>
    <Analytics/>
  </React.StrictMode>
);
