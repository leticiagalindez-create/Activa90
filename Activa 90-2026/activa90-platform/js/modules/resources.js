/* ============================================================
   ACTIVA 90 — Resources Page Module
   Renders resource download cards from config
   ============================================================ */

import { getCurrentUser, getProfile, signOut } from '../supabase-client.js';
import { showToast, getInitials, getFirstName } from '../utils.js';

/* ── Bootstrap ──────────────────────────────────────────────── */
async function init() {
  const user = await getCurrentUser();
  if (!user) { window.location.replace('index.html'); return; }

  const profile = await getProfile(user.id);
  const name    = profile?.full_name || user.email.split('@')[0];

  renderHeader(name);
  renderResourceCards();
  setupSignOut();
}

/* ── Header ─────────────────────────────────────────────────── */
function renderHeader(name) {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl   = document.getElementById('user-name-display');
  if (avatarEl) avatarEl.textContent = getInitials(name);
  if (nameEl)   nameEl.textContent   = getFirstName(name);
}

/* ── Resource Cards ─────────────────────────────────────────── */
function renderResourceCards() {
  const grid = document.getElementById('resources-grid');
  if (!grid) return;

  grid.innerHTML = RESOURCES.map(r => {
    const isExternal = r.file.startsWith('http://') || r.file.startsWith('https://');
    const isExcel = r.file.endsWith('.xlsx') || r.file.endsWith('.xlsm');

    let buttonText, buttonAttrs;
    if (isExternal) {
      buttonText = 'Abrir Formulario';
      buttonAttrs = 'target="_blank" rel="noopener noreferrer"';
    } else if (isExcel) {
      buttonText = 'Descargar Excel';
      buttonAttrs = 'download';
    } else {
      buttonText = 'Descargar';
      buttonAttrs = 'download';
    }

    return `
      <article class="resource-card">
        <div class="resource-card__top">
          <div class="resource-card__icon" style="background-color: ${hexToRgba(r.color, 0.1)};">
            ${r.icon}
          </div>
          <span class="badge badge-gray">${r.category}</span>
        </div>

        <div class="resource-card__body">
          <h3 class="resource-card__title">${r.title}</h3>
          <p class="resource-card__desc">${r.description}</p>
        </div>

        <div class="resource-card__footer">
          <a href="${r.file}"
             ${buttonAttrs}
             class="btn btn-primary btn-full btn-sm"
             onclick="logResourceAccess('${r.title}', ${isExternal})">
            ${buttonText}
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/* ── Resource Access Logger ─────────────────────────────────── */
window.logResourceAccess = function(title, isExternal) {
  if (isExternal) {
    console.log('[External Link]', title);
    showToast(`Abriendo: ${title}`, 'info');
  } else {
    console.log('[Download]', title);
    showToast(`Descargando: ${title}`, 'info');
  }
};

/* ── Sign Out ───────────────────────────────────────────────── */
function setupSignOut() {
  document.getElementById('signout-btn')?.addEventListener('click', async () => {
    await signOut();
    window.location.replace('index.html');
  });
}

/* ── Helpers ────────────────────────────────────────────────── */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Init ───────────────────────────────────────────────────── */
init().catch(err => {
  console.error('Resources page error:', err);
  showToast('Error al cargar los recursos.', 'error');
});
