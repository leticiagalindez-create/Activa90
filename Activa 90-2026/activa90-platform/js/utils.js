/* ============================================================
   ACTIVA 90 — Utilities
   Shared helpers used across all pages
   ============================================================ */

/* ── Toast Notifications ────────────────────────────────────── */
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 * @param {number} duration ms
 */
export function showToast(message, type = 'info', duration = 3500) {
  const container = ensureToastContainer();
  const toast     = document.createElement('div');

  const icons = { info: 'ℹ️', success: '✅', error: '❌' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration + 300); // slight buffer for animation
}

/* ── User Initials ──────────────────────────────────────────── */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
}

/* ── Format Date ────────────────────────────────────────────── */
export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* ── Get First Name ─────────────────────────────────────────── */
export function getFirstName(fullName) {
  if (!fullName) return 'Asesor';
  return fullName.trim().split(' ')[0];
}

/* ── Loading Spinner ────────────────────────────────────────── */
export function createSpinner(size = 24) {
  const el = document.createElement('div');
  el.style.cssText = `
    width:${size}px; height:${size}px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  `;
  if (!document.querySelector('#spin-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spin-keyframes';
    style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
  return el;
}

/* ── Animate Progress Ring ──────────────────────────────────── */
export function animateProgressRing(ringFill, percent, circumference) {
  const offset = circumference - (percent / 100) * circumference;
  ringFill.style.strokeDasharray  = circumference;
  ringFill.style.strokeDashoffset = circumference; // start at 0%

  // Trigger reflow then animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ringFill.style.strokeDashoffset = offset;
    });
  });
}

/* ── Set Button Loading State ───────────────────────────────── */
export function setButtonLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Cargando...';
  } else {
    btn.disabled = false;
    btn.textContent = originalText || btn.dataset.originalText || btn.textContent;
  }
}

/* ── Scroll to Top ──────────────────────────────────────────── */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
