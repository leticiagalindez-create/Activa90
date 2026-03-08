/* ============================================================
   ACTIVA 90 — Manual de Orientación Page Module (Tabbed)
   Renders static content organized by tabs
   ============================================================ */

import { getCurrentUser, getProfile, signOut } from '../supabase-client.js';
import { showToast, getInitials, getFirstName } from '../utils.js';
import { MANUAL_CONTENT } from '../manual-content.js';

/* ── Bootstrap ──────────────────────────────────────────────── */
async function init() {
  const user = await getCurrentUser();
  if (!user) { window.location.replace('index.html'); return; }

  const profile = await getProfile(user.id);
  const name    = profile?.full_name || user.email.split('@')[0];

  renderHeader(name);
  renderManualContent();
  setupTabs();
  setupDownloadButton();
  setupSignOut();
}

/* ── Header ─────────────────────────────────────────────────── */
function renderHeader(name) {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl   = document.getElementById('user-name-display');
  if (avatarEl) avatarEl.textContent = getInitials(name);
  if (nameEl)   nameEl.textContent   = getFirstName(name);
}

/* ── Render Manual Content ──────────────────────────────────── */
function renderManualContent() {
  document.getElementById('tab-programa').innerHTML = MANUAL_CONTENT.programa;
  document.getElementById('tab-estructura').innerHTML = MANUAL_CONTENT.estructura;
  document.getElementById('tab-clinicas').innerHTML = MANUAL_CONTENT.clinicas;
  document.getElementById('tab-workbook').innerHTML = MANUAL_CONTENT.workbook;
  document.getElementById('tab-prompts').innerHTML = MANUAL_CONTENT.prompts;
  document.getElementById('tab-compromiso').innerHTML = MANUAL_CONTENT.compromiso;
  addCopyButtons();
}

/* ── Copy Buttons for Prompts ───────────────────────────────── */
function addCopyButtons() {
  document.querySelectorAll('#tab-prompts p code').forEach(code => {
    const btn = document.createElement('button');
    btn.className = 'copy-prompt-btn';
    btn.textContent = 'Copiar';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = '✓ Copiado';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copiar';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
    code.parentElement.insertAdjacentElement('afterend', btn);
  });
}

/* ── Setup Tabs ─────────────────────────────────────────────── */
function setupTabs() {
  const tabs = document.querySelectorAll('.manual-tab');
  const contents = document.querySelectorAll('.manual-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Remove active from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });
}

/* ── Download Button ────────────────────────────────────────── */
function setupDownloadButton() {
  const downloadBtn = document.getElementById('download-manual-btn');
  if (!downloadBtn) return;

  const filePath = MANUAL_DOC.file;
  downloadBtn.href = filePath;

  downloadBtn.addEventListener('click', () => {
    showToast('Descargando Manual de Orientación...', 'info');
  });
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
  console.error('Manual page error:', err);
  showToast('Error al inicializar la página del manual', 'error');
});
