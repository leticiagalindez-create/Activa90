/* ============================================================
   ACTIVA 90 — Module Page
   Dynamic tab router, lazy DOCX loading, completion gate
   ============================================================ */

import { supabase, getCurrentUser, getProfile, signOut } from '../supabase-client.js';
import { getModuleProgress, markTabVisited, markModuleComplete, getAllProgress } from '../progress.js';
import { loadDocx }         from '../docx-viewer.js';
import { renderPptxCards }  from '../pptx-handler.js?v=2';
import { showToast, getInitials, getFirstName, setButtonLoading } from '../utils.js';

/* ── Parse URL ──────────────────────────────────────────────── */
const params    = new URLSearchParams(window.location.search);
const moduleId  = params.get('module');
const moduleConfig = MODULES.find(m => m.id === moduleId);

if (!moduleConfig) {
  window.location.replace('dashboard.html');
  throw new Error('Invalid module');
}

/* ── State ──────────────────────────────────────────────────── */
let currentUser       = null;
let moduleProgress    = { completed: false, tabs_visited: [] };
const loadedTabs      = new Set();
let activeTab         = null;

/* ── Bootstrap ──────────────────────────────────────────────── */
async function init() {
  const [user] = await Promise.all([getCurrentUser()]);
  if (!user) { window.location.replace('index.html'); return; }

  currentUser    = user;
  moduleProgress = await getModuleProgress(user.id, moduleId);

  const profile = await getProfile(user.id);
  const name    = profile?.full_name || user.email.split('@')[0];

  renderHeader(name);
  renderModuleHeader();
  renderTabNav();
  renderCompletionFooter();
  setupSignOut();

  // Auto-activate first available tab
  const firstTab = getAvailableTabs()[0];
  if (firstTab) activateTab(firstTab);
}

/* ── Header ─────────────────────────────────────────────────── */
function renderHeader(name) {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl   = document.getElementById('user-name-display');
  if (avatarEl) avatarEl.textContent = getInitials(name);
  if (nameEl)   nameEl.textContent   = getFirstName(name);

  // Breadcrumb
  const crumb = document.getElementById('breadcrumb-module-title');
  if (crumb) crumb.textContent = moduleConfig.title;
  document.title = `Módulo ${moduleConfig.number} — Activa 90`;
}

/* ── Module Header ──────────────────────────────────────────── */
function renderModuleHeader() {
  const numBadge  = document.getElementById('module-number-badge');
  const titleEl   = document.getElementById('module-title');
  const subtitleEl = document.getElementById('module-subtitle');
  const statusBadge = document.getElementById('module-status-badge');

  if (numBadge)   numBadge.textContent   = `Módulo ${moduleConfig.number}`;
  if (titleEl)    titleEl.textContent    = `${moduleConfig.icon} ${moduleConfig.title}`;
  if (subtitleEl) subtitleEl.textContent = moduleConfig.subtitle;

  if (statusBadge && moduleProgress.completed) {
    statusBadge.className  = 'badge badge-success visible';
    statusBadge.textContent = '✓ Completado';
  }
}

/* ── Tab Navigation ─────────────────────────────────────────── */
function getAvailableTabs() {
  return Object.entries(moduleConfig.tabs)
    .filter(([, val]) => val !== null)
    .map(([key]) => key);
}

function renderTabNav() {
  const nav = document.getElementById('tab-nav');
  if (!nav) return;

  const tabs    = getAvailableTabs();
  nav.innerHTML = tabs.map(tab => {
    const cfg = TAB_LABELS[tab];
    return `
      <button class="tab-btn" data-tab="${tab}">
        ${cfg.icon} ${cfg.label}
      </button>
    `;
  }).join('');

  nav.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    activateTab(btn.dataset.tab);
  });
}

/* ── Tab Activation ─────────────────────────────────────────── */
function activateTab(tabName) {
  if (activeTab === tabName) return;
  activeTab = tabName;

  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });

  // Show/hide panels
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabName}`);
  });

  // Lazy-load content on first visit
  if (!loadedTabs.has(tabName)) {
    loadedTabs.add(tabName);
    loadTabContent(tabName);
  }

  // Save tab visit to Supabase (fire-and-forget)
  if (currentUser) {
    markTabVisited(currentUser.id, moduleId, tabName)
      .then(() => {
        const visited = new Set([...(moduleProgress.tabs_visited || []), ...loadedTabs]);
        moduleProgress.tabs_visited = Array.from(visited);
        updateCompletionButton();
      });
  }
}

/* ── Content Loading ────────────────────────────────────────── */
async function loadTabContent(tabName) {
  const cfg = moduleConfig.tabs[tabName];

  if (tabName === 'clinica') {
    const container = document.getElementById('clinica-content');
    await loadDocx(cfg.file, container, { downloadLabel: cfg.label });

  } else if (tabName === 'presentacion') {
    const container = document.getElementById('presentacion-content');
    renderPptxCards(container, cfg);

  } else if (tabName === 'workbook') {
    const container = document.getElementById('workbook-content');
    renderWorkbookCard(cfg, container);

  } else if (tabName === 'evaluacion') {
    const container = document.getElementById('evaluacion-content');
    renderEvaluacionEmbed(cfg, container);
  }
}

function renderWorkbookCard(cfg, container) {
  container.innerHTML = `
    <div class="workbook-dl-card">
      <div class="workbook-dl-card__icon">📝</div>
      <h3 class="workbook-dl-card__title">${cfg.label}</h3>
      <p class="workbook-dl-card__desc">
        Descarga este workbook para completar los ejercicios y actividades del módulo.
        Puedes llenarlo directamente en Word o imprimirlo.
      </p>
      <a href="${encodeURI(cfg.file)}" download class="btn btn-primary workbook-dl-card__btn">
        📥 Descargar Workbook
      </a>
      <p class="workbook-dl-card__meta">Formato: Microsoft Word (.docx)</p>
    </div>
  `;
}

function renderEvaluacionEmbed(cfg, container) {
  container.innerHTML = `
    <div class="google-form-embed">
      <div class="google-form-embed__header">
        <div class="google-form-embed__info">
          <h3 class="google-form-embed__title">${cfg.label}</h3>
          <p class="google-form-embed__subtitle">Completa esta evaluación para reflexionar sobre lo aprendido</p>
        </div>
        <div class="google-form-embed__actions">
          <a href="${cfg.embedUrl.replace('?embedded=true', '')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Abrir en Nueva Pestaña
          </a>
        </div>
      </div>
      <div class="google-form-embed__container">
        <iframe
          src="${cfg.embedUrl}"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          class="google-form-embed__iframe">
          Cargando…
        </iframe>
      </div>
    </div>
  `;
}

/* ── Completion Footer ──────────────────────────────────────── */
function renderCompletionFooter() {
  const btn      = document.getElementById('complete-btn');
  const hintEl   = document.getElementById('complete-hint');
  if (!btn) return;

  if (moduleProgress.completed) {
    markCompleteUI(btn, hintEl);
    return;
  }

  btn.addEventListener('click', handleComplete);
  updateCompletionButton();
}

function updateCompletionButton() {
  const btn    = document.getElementById('complete-btn');
  const hintEl = document.getElementById('complete-hint');
  if (!btn || moduleProgress.completed) return;

  const available = getAvailableTabs();
  const visited   = new Set([...(moduleProgress.tabs_visited || []), ...loadedTabs]);
  const allSeen   = available.every(tab => visited.has(tab));

  btn.disabled = !allSeen;

  if (hintEl) {
    const remaining = available.filter(t => !visited.has(t));
    const labels    = remaining.map(t => TAB_LABELS[t].label);
    hintEl.textContent = allSeen
      ? 'Has revisado todos los materiales. ¡Puedes marcar el módulo como completado!'
      : `Visita los materiales faltantes: ${labels.join(', ')}`;
  }
}

async function handleComplete() {
  const btn = document.getElementById('complete-btn');
  setButtonLoading(btn, true);

  const result = await markModuleComplete(currentUser.id, moduleId);

  if (result) {
    moduleProgress.completed = true;
    const hintEl = document.getElementById('complete-hint');
    markCompleteUI(btn, hintEl);
    showToast(`¡Módulo ${moduleConfig.number} completado! 🎉`, 'success');

    // Send progress email (fire-and-forget — don't block the user)
    sendProgressEmail().catch(err => console.warn('Progress email error:', err));

    // Return to dashboard after short delay
    setTimeout(() => window.location.replace('dashboard.html'), 2000);
  } else {
    setButtonLoading(btn, false, 'Marcar como Completado');
    showToast('Error al guardar. Intenta de nuevo.', 'error');
  }
}

async function sendProgressEmail() {
  const allProgress     = await getAllProgress(currentUser.id);
  const completedCount  = allProgress.filter(p => p.completed).length;
  const totalModules    = MODULES.length;

  // Find the next module in the manifest
  const currentIndex = MODULES.findIndex(m => m.id === moduleId);
  const nextModule   = MODULES[currentIndex + 1];

  await supabase.functions.invoke('send-progress-email', {
    body: {
      moduleName:       moduleConfig.title,
      moduleNumber:     moduleConfig.number,
      totalModules,
      completedModules: completedCount,
      nextModuleName:   nextModule?.title,
      nextModuleUrl:    nextModule
        ? `https://www.activa90.com/module.html?module=${nextModule.id}`
        : null,
    },
  });
}

function markCompleteUI(btn, hintEl) {
  btn.disabled    = false;
  btn.className   = 'btn btn-success done btn-lg';
  btn.textContent = '✓ Módulo Completado';

  if (hintEl) hintEl.textContent = `Completado el ${new Date().toLocaleDateString('es-MX')}`;

  const badge = document.getElementById('module-status-badge');
  if (badge) {
    badge.className   = 'badge badge-success visible';
    badge.textContent = '✓ Completado';
  }
}

/* ── Sign Out ───────────────────────────────────────────────── */
function setupSignOut() {
  document.getElementById('signout-btn')?.addEventListener('click', async () => {
    await signOut();
    window.location.replace('index.html');
  });
}

/* ── Init ───────────────────────────────────────────────────── */
init().catch(err => {
  console.error('Module page error:', err);
  showToast('Error al cargar el módulo.', 'error');
});
