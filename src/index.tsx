import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {SpeedInsights} from "@vercel/speed-insights/react";
import {Analytics} from "@vercel/analytics/react";
import './styles/index.scss';

const rootElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App/>
    <SpeedInsights/>
    <Analytics/>
  </React.StrictMode>
);
