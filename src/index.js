import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import './index.css';
import App from './App';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import pkg from '../package.json';

Sentry.init({
  release: `${pkg.name}@${pkg.version}`,
  environment: process.env.NODE_ENV,
  dsn: "https://53781389736347e09847935fb3bfc227@o378063.ingest.sentry.io/5755695",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.25,
});

ReactDOM.render(<App />, document.getElementById('root'));
unregisterServiceWorker();
