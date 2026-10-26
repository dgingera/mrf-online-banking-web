import createDebug from 'debug';

const log = createDebug('mrf:spa:telemetry');

export function trackPageView(page) {
  log('page view %s', page);
  navigator.sendBeacon('/api/telemetry', JSON.stringify({ page, at: Date.now() }));
}
