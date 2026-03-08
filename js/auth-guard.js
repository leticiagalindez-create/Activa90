/* ============================================================
   ACTIVA 90 — Auth Guard
   Blocks access to protected pages if user is not logged in.
   Load this as an async module script in <head> of each
   protected page AFTER config.js.
   ============================================================ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

(async function authGuard() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON);

  // Exchange auth code for session if coming from email confirmation link
  const params = new URLSearchParams(window.location.search);
  const code   = params.get('code');
  if (code) {
    await client.auth.exchangeCodeForSession(code);
    // Clean the URL without reloading
    const clean = window.location.pathname;
    window.history.replaceState(null, '', clean);
  }

  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    window.location.replace('index.html');
  }
})();
