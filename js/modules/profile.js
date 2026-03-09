/* ============================================================
   ACTIVA 90 — Profile Page Module
   ============================================================ */

import {
  supabase,
  getCurrentUser,
  getProfile,
  updateProfile,
  updatePassword,
  onAuthStateChange,
} from '../supabase-client.js';
import { showToast, setButtonLoading } from '../utils.js';

/* ── State ───────────────────────────────────────────────────── */
let currentUser  = null;
let currentProfile = null;

/* ── DOM Refs ────────────────────────────────────────────────── */
const avatarLg       = document.getElementById('profile-avatar-lg');
const heroName       = document.getElementById('profile-hero-name');
const heroEmail      = document.getElementById('profile-hero-email');
const heroBio        = document.getElementById('profile-hero-bio');
const headerAvatar   = document.getElementById('user-avatar');
const headerName     = document.getElementById('user-name-display');

const infoForm       = document.getElementById('info-form');
const emailForm      = document.getElementById('email-form');
const passwordForm   = document.getElementById('password-form');

/* ── Init ────────────────────────────────────────────────────── */
async function init() {
  currentUser = await getCurrentUser();
  if (!currentUser) return;

  currentProfile = await getProfile(currentUser.id);

  const name = currentProfile?.full_name || currentUser.user_metadata?.full_name || '';
  const email = currentUser.email || '';
  const bio   = currentProfile?.bio || '';
  const initials = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

  // Header
  if (headerAvatar)  headerAvatar.textContent  = initials;
  if (headerName)    headerName.textContent    = name || email;

  // Hero
  avatarLg.textContent   = initials;
  heroName.textContent   = name  || '—';
  heroEmail.textContent  = email;
  heroBio.textContent    = bio;
  heroBio.hidden         = !bio;

  // Forms
  document.getElementById('field-name').value  = name;
  document.getElementById('field-bio').value   = bio;
  document.getElementById('field-email').value = email;
}

init();

/* ── Sign out ────────────────────────────────────────────────── */
document.getElementById('signout-btn')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.replace('index.html');
});

/* ── Info Form ───────────────────────────────────────────────── */
infoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn      = document.getElementById('info-submit');
  const feedback = document.getElementById('info-feedback');
  const name     = document.getElementById('field-name').value.trim();
  const bio      = document.getElementById('field-bio').value.trim();

  setFeedback(feedback, '');
  setButtonLoading(btn, true);

  const { error } = await updateProfile(currentUser.id, { full_name: name, bio });

  setButtonLoading(btn, false, 'Guardar cambios');

  if (error) {
    setFeedback(feedback, error.message, 'error');
  } else {
    // Refresh hero
    const initials = name ? name.charAt(0).toUpperCase() : (currentUser.email || '?').charAt(0).toUpperCase();
    avatarLg.textContent  = initials;
    heroName.textContent  = name || '—';
    heroBio.textContent   = bio;
    heroBio.hidden        = !bio;
    if (headerAvatar) headerAvatar.textContent = initials;
    if (headerName)   headerName.textContent   = name;
    setFeedback(feedback, 'Cambios guardados.', 'success');
    showToast('Perfil actualizado', 'success');
  }
});

/* ── Email Form ──────────────────────────────────────────────── */
emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn      = document.getElementById('email-submit');
  const feedback = document.getElementById('email-feedback');
  const newEmail = document.getElementById('field-email').value.trim();

  if (newEmail === currentUser.email) {
    setFeedback(feedback, 'Este ya es tu correo actual.', 'error');
    return;
  }

  setFeedback(feedback, '');
  setButtonLoading(btn, true);

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  setButtonLoading(btn, false, 'Actualizar correo');

  if (error) {
    setFeedback(feedback, error.message, 'error');
  } else {
    heroEmail.textContent = newEmail;
    setFeedback(feedback, 'Te enviamos un link de confirmación al nuevo correo.', 'success');
    showToast('Revisa tu nuevo correo para confirmar el cambio', 'success');
  }
});

/* ── Password Form ───────────────────────────────────────────── */
passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn      = document.getElementById('password-submit');
  const feedback = document.getElementById('password-feedback');
  const newPass  = document.getElementById('field-new-password').value;
  const confirm  = document.getElementById('field-confirm-password').value;

  setFeedback(feedback, '');

  if (newPass.length < 8) {
    setFeedback(feedback, 'La contraseña debe tener al menos 8 caracteres.', 'error');
    return;
  }
  if (newPass !== confirm) {
    setFeedback(feedback, 'Las contraseñas no coinciden.', 'error');
    return;
  }

  setButtonLoading(btn, true);

  const { error } = await updatePassword(newPass);

  setButtonLoading(btn, false, 'Cambiar contraseña');

  if (error) {
    setFeedback(feedback, error.message, 'error');
  } else {
    passwordForm.reset();
    setFeedback(feedback, '¡Contraseña actualizada!', 'success');
    showToast('Contraseña actualizada correctamente', 'success');
  }
});

/* ── Password Recovery: auto-scroll + highlight ─────────────── */
onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    const section = document.getElementById('section-password');
    const card    = passwordForm;
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    card.classList.add('profile-card--highlight');

    const feedback = document.getElementById('password-feedback');
    setFeedback(feedback, 'Ingresa tu nueva contraseña.', 'success');

    setTimeout(() => card.classList.remove('profile-card--highlight'), 3000);
  }
});

/* ── Helpers ─────────────────────────────────────────────────── */
function setFeedback(el, message, type = '') {
  if (!el) return;
  el.textContent = message;
  el.className   = `form-feedback${type ? ` ${type}` : ''}`;
  el.hidden      = !message;
}
