/* ============================================================
   ACTIVA 90 — Landing Page Module
   Auth modal, sign-in/sign-up handlers
   ============================================================ */

import { signIn, signUp, getCurrentUser, sendPasswordReset, updatePassword, exchangeCode, onAuthStateChange } from '../supabase-client.js';
import { showToast, setButtonLoading }    from '../utils.js';

/* ── Redirect if already logged in ─────────────────────────── */
(async function checkAlreadyLoggedIn() {
  const user = await getCurrentUser();
  if (user) window.location.replace('dashboard.html');
})();

/* ── Module overview cards (landing hero panel) ─────────────── */
function renderHeroModules() {
  const container = document.getElementById('hero-modules');
  if (!container) return;

  container.innerHTML = MODULES.map(m => `
    <div class="hero__module-card">
      <span class="hero__module-card-icon">${m.icon}</span>
      <div>
        <div class="hero__module-card-num">Módulo ${m.number}</div>
        <div class="hero__module-card-title">${m.title}</div>
      </div>
    </div>
  `).join('');
}

/* ── Module overview on main section ────────────────────────── */
function renderModulesOverview() {
  const container = document.getElementById('modules-overview-grid');
  if (!container) return;

  container.innerHTML = MODULES.map(m => `
    <div class="card" style="text-align:center; padding: var(--space-8) var(--space-6);">
      <div style="font-size:2.5rem; margin-bottom: var(--space-3); line-height:1;">${m.icon}</div>
      <div class="badge badge-outline" style="margin: 0 auto var(--space-3);">Módulo ${m.number}</div>
      <h3 style="font-size:var(--font-size-md); margin-bottom:var(--space-2);">${m.title}</h3>
      <p style="font-size:var(--font-size-sm); color:var(--color-text-muted); margin:0;">${m.subtitle}</p>
    </div>
  `).join('');
}

/* ── Auth Modal ─────────────────────────────────────────────── */
const modal      = document.getElementById('auth-modal');
const signInForm = document.getElementById('signin-form');
const signUpForm = document.getElementById('signup-form');
const authTabs   = document.querySelectorAll('.auth-tab');

function openModal(tab = 'signin') {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  switchTab(tab);
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  clearErrors();
}

function switchTab(tab) {
  authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  signInForm.hidden = tab !== 'signin';
  signUpForm.hidden = tab !== 'signup';
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.auth-error').forEach(el => el.hidden = true);
}

function showError(form, message) {
  const err = form.querySelector('.auth-error');
  if (err) { err.textContent = message; err.hidden = false; }
}

// Tab clicks
authTabs.forEach(t => {
  t.addEventListener('click', () => switchTab(t.dataset.tab));
});

// Close button and Escape key (open buttons handled by inline delegation in index.html)
modal.querySelector('.modal__close')?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

/* ── Sign In Handler ────────────────────────────────────────── */
signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn      = signInForm.querySelector('button[type="submit"]');
  const email    = signInForm.querySelector('[name="email"]').value.trim();
  const password = signInForm.querySelector('[name="password"]').value;

  setButtonLoading(btn, true);
  clearErrors();

  const { error } = await signIn(email, password);

  if (error) {
    setButtonLoading(btn, false, 'Ingresar');
    const msg = error.message.includes('Invalid login credentials')
      ? 'Correo o contraseña incorrectos.'
      : error.message;
    showError(signInForm, msg);
  } else {
    showToast('Bienvenido de nuevo', 'success');
    window.location.replace('dashboard.html');
  }
});

/* ── Sign Up Handler ────────────────────────────────────────── */
signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn      = signUpForm.querySelector('button[type="submit"]');
  const fullName = signUpForm.querySelector('[name="fullname"]').value.trim();
  const email    = signUpForm.querySelector('[name="email"]').value.trim();
  const password = signUpForm.querySelector('[name="password"]').value;

  if (password.length < 8) {
    showError(signUpForm, 'La contraseña debe tener al menos 8 caracteres.');
    return;
  }

  setButtonLoading(btn, true);
  clearErrors();

  const { data, error } = await signUp(email, password, fullName);

  if (error) {
    setButtonLoading(btn, false, 'Crear Cuenta');
    const msg = error.message.includes('already registered')
      ? 'Este correo ya está registrado. ¿Quieres iniciar sesión?'
      : error.message;
    showError(signUpForm, msg);
  } else if (data?.user?.identities?.length === 0) {
    setButtonLoading(btn, false, 'Crear Cuenta');
    showError(signUpForm, 'Este correo ya está registrado.');
  } else {
    // If email confirmation is disabled in Supabase, redirect directly
    if (data?.session) {
      showToast('¡Cuenta creada! Bienvenido.', 'success');
      window.location.replace('dashboard.html');
    } else {
      btn.disabled = true;
      btn.textContent = 'Registro exitoso';
      const err = signUpForm.querySelector('.auth-error');
      if (err) {
        err.className = 'auth-success';
        err.hidden = false;
        err.textContent = '¡Cuenta creada! Revisa tu correo para confirmar tu cuenta, luego inicia sesión.';
      }
    }
  }
});

/* ── Forgot Password ────────────────────────────────────────── */
const forgotForm   = document.getElementById('forgot-form');
const resetForm    = document.getElementById('reset-form');
const forgotLink   = document.getElementById('forgot-password-link');
const backToSignin = document.getElementById('back-to-signin');
const forgotSubmit = document.getElementById('forgot-submit');
const resetSubmit  = document.getElementById('reset-submit');

function showPanel(panel) {
  [signInForm, signUpForm, forgotForm, resetForm].forEach(el => { if (el) el.hidden = true; });
  const tabs = document.querySelector('.auth-tabs');
  if (tabs) tabs.hidden = panel === forgotForm || panel === resetForm;
  if (panel) panel.hidden = false;
}

forgotLink?.addEventListener('click', e => {
  e.preventDefault();
  showPanel(forgotForm);
});

backToSignin?.addEventListener('click', e => {
  e.preventDefault();
  showPanel(signInForm);
  const tabs = document.querySelector('.auth-tabs');
  if (tabs) tabs.hidden = false;
  authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'signin'));
});

forgotSubmit?.addEventListener('click', async () => {
  const email = document.getElementById('forgot-email').value.trim();
  const errEl = forgotForm.querySelector('.auth-error');

  if (!email) {
    errEl.textContent = 'Ingresa tu correo electrónico.';
    errEl.hidden = false;
    return;
  }

  forgotSubmit.disabled = true;
  forgotSubmit.textContent = 'Enviando…';
  if (errEl) errEl.hidden = true;

  const { error } = await sendPasswordReset(email);

  if (error) {
    forgotSubmit.disabled = false;
    forgotSubmit.textContent = 'Enviar link';
    errEl.textContent = error.message;
    errEl.hidden = false;
  } else {
    forgotSubmit.textContent = 'Link enviado';
    errEl.className = 'auth-success';
    errEl.hidden = false;
    errEl.textContent = 'Revisa tu correo — te enviamos un link para restablecer tu contraseña.';
  }
});

/* ── Handle password recovery redirect ─────────────────────── */
// Works for both PKCE (?code=) and legacy (#access_token&type=recovery) flows.
// Supabase JS auto-detects the URL and fires PASSWORD_RECOVERY when appropriate.
onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    window.history.replaceState(null, '', window.location.pathname);
    openModal('signin');
    showPanel(resetForm);
  }
});

resetSubmit?.addEventListener('click', async () => {
  const newPass     = document.getElementById('new-password').value;
  const confirmPass = document.getElementById('confirm-password').value;
  const errEl       = resetForm.querySelector('.auth-error');

  if (newPass.length < 8) {
    errEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
    errEl.hidden = false;
    return;
  }
  if (newPass !== confirmPass) {
    errEl.textContent = 'Las contraseñas no coinciden.';
    errEl.hidden = false;
    return;
  }

  resetSubmit.disabled = true;
  resetSubmit.textContent = 'Guardando…';
  if (errEl) errEl.hidden = true;

  const { error } = await updatePassword(newPass);

  if (error) {
    resetSubmit.disabled = false;
    resetSubmit.textContent = 'Guardar contraseña';
    errEl.textContent = error.message;
    errEl.hidden = false;
  } else {
    showToast('Contraseña actualizada. Iniciando sesión…', 'success');
    setTimeout(() => window.location.replace('dashboard.html'), 1500);
  }
});

/* ── Header scroll effect ───────────────────────────────────── */
const header = document.querySelector('.landing-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── Init ───────────────────────────────────────────────────── */
renderHeroModules();
renderModulesOverview();
