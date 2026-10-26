// Customer-facing SPA entry point; bundled into public/app.js and served to every browser session.
import createDebug from 'debug';
import { trackPageView } from './telemetry.js';

const log = createDebug('mrf:spa');

async function loadAccounts() {
  const res = await fetch('/api/accounts', { credentials: 'include' });
  const accounts = await res.json();
  log('loaded %d accounts', accounts.length);
  document.querySelector('#accounts').textContent = accounts.map((a) => `${a.name}: ${a.balance}`).join('\n');
}

trackPageView(window.location.pathname);
loadAccounts();
