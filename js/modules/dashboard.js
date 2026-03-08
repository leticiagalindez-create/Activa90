/* ============================================================
   ACTIVA 90 — Dashboard Module
   Loads user info, renders module grid, progress ring, manual
   ============================================================ */

import { getCurrentUser, getProfile, signOut } from '../supabase-client.js';
import { getAllProgress, calculateProgress, buildProgressMap } from '../progress.js';
import { showToast, getInitials, getFirstName, animateProgressRing } from '../utils.js';

const RING_RADIUS       = 50;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~314.16

/* ── Bootstrap ──────────────────────────────────────────────── */
async function init() {
  const user = await getCurrentUser();
  if (!user) { window.location.replace('index.html'); return; }

  const [profile, progressRows] = await Promise.all([
    getProfile(user.id),
    getAllProgress(user.id)
  ]);

  const name    = profile?.full_name || user.email.split('@')[0];
  const percent = calculateProgress(progressRows);
  const progMap = buildProgressMap(progressRows);

  renderUserInfo(name);
  renderProgressRing(percent);
  renderModuleGrid(progMap);
  setupSignOut(user);
}

/* ── User Info ──────────────────────────────────────────────── */
function renderUserInfo(name) {
  const greetingEl = document.getElementById('greeting-name');
  const avatarEl   = document.getElementById('user-avatar');
  const nameEl     = document.getElementById('user-name-display');

  if (greetingEl)  greetingEl.textContent = getFirstName(name);
  if (avatarEl)    avatarEl.textContent   = getInitials(name);
  if (nameEl)      nameEl.textContent     = getFirstName(name);
}

/* ── Progress Ring ──────────────────────────────────────────── */
function renderProgressRing(percent) {
  const ringFill = document.getElementById('progress-ring-fill');
  const pctLabel = document.getElementById('progress-percent');

  if (!ringFill) return;
  if (pctLabel) pctLabel.textContent = `${percent}%`;

  animateProgressRing(ringFill, percent, RING_CIRCUMFERENCE);
}

/* ── Module Grid ────────────────────────────────────────────── */
function renderModuleGrid(progMap) {
  const grid = document.getElementById('modules-grid');
  if (!grid) return;

  grid.innerHTML = MODULES.map(m => {
    const prog      = progMap[m.id] || {};
    const completed = prog.completed || false;
    const tabs      = buildTabChips(m.tabs);

    return `
      <a href="module.html?module=${m.id}"
         class="module-card ${completed ? 'completed' : ''}"
         title="${m.title}">

        <div class="module-card__header">
          <span class="module-card__number-badge">
            ${completed ? '✓ ' : ''}Módulo ${m.number}
          </span>
          <span class="module-card__icon">${m.icon}</span>
        </div>

        <div>
          <h3 class="module-card__title">${m.title}</h3>
          <p class="module-card__subtitle">${m.subtitle}</p>
        </div>

        <div class="module-card__footer">
          <div class="module-card__chips">${tabs}</div>
          <span class="module-card__status">
            ${completed ? '✓ Completado' : '→ Comenzar'}
          </span>
        </div>
      </a>
    `;
  }).join('');
}

function buildTabChips(tabs) {
  const chips = [];
  if (tabs.clinica)      chips.push('<span class="chip chip-clinica">📋 Clínica</span>');
  if (tabs.presentacion) chips.push('<span class="chip chip-presentacion">📊 Presentación</span>');
  if (tabs.workbook)     chips.push('<span class="chip chip-workbook">📝 Workbook</span>');
  return chips.join('');
}

/* ── Sign Out ───────────────────────────────────────────────── */
function setupSignOut(user) {
  const btn = document.getElementById('signout-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    await signOut();
    window.location.replace('index.html');
  });
}

/* ── Init ───────────────────────────────────────────────────── */
init().catch(err => {
  console.error('Dashboard init error:', err);
  showToast('Error al cargar el panel. Recarga la página.', 'error');
});
