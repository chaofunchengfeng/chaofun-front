import * as Sentry from '@sentry/vue';
import Vue from 'vue';

try {
  Sentry.init({
    Vue,
    dsn: 'https://baef8193202a4fc680faf2889e6d5f3a@o4505047283793920.ingest.sentry.io/4505047285170176',
    environment: 'production',
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: ['localhost', /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
  });
} catch (e) {
  console.warn(e);
}