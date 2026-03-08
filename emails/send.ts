import { Resend } from 'resend';
import { WelcomeEmail } from './welcome';
import { ResetPasswordEmail } from './reset-password';
import { ModuleCompleteEmail } from './module-complete';
import { CourseCompleteEmail } from './course-complete';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Activa 90 <leticiagalindez@kwcostarica.com>';
const BASE_URL = 'https://www.activa90.com';

// ─── Email de bienvenida/registro ─────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: '¡Bienvenido a Activa 90!',
    react: WelcomeEmail({
      name,
      loginUrl: `${BASE_URL}/dashboard.html`,
    }),
  });
}

// ─── Restablecer contraseña ───────────────────────────────────────────────────
export async function sendResetPasswordEmail(
  to: string,
  name: string,
  resetToken: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Restablecer tu contraseña — Activa 90',
    react: ResetPasswordEmail({
      name,
      resetUrl: `${BASE_URL}/index.html?reset=${resetToken}`,
      expiresInHours: 1,
    }),
  });
}

// ─── Módulo completado ────────────────────────────────────────────────────────
export async function sendModuleCompleteEmail(
  to: string,
  params: {
    name: string;
    moduleName: string;
    moduleNumber: number;
    totalModules: number;
    nextModuleName?: string;
  }
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `✅ Módulo ${params.moduleNumber} completado — Activa 90`,
    react: ModuleCompleteEmail({
      ...params,
      nextModuleUrl: `${BASE_URL}/module.html`,
      dashboardUrl: `${BASE_URL}/dashboard.html`,
    }),
  });
}

// ─── Curso completado ─────────────────────────────────────────────────────────
export async function sendCourseCompleteEmail(
  to: string,
  name: string,
  totalModules: number
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: '🏆 ¡Felicidades! Completaste Activa 90',
    react: CourseCompleteEmail({
      name,
      totalModules,
      dashboardUrl: `${BASE_URL}/dashboard.html`,
    }),
  });
}
