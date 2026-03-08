/**
 * Supabase Edge Function — send-auth-email
 *
 * Intercepts Supabase Auth email events (signup confirmation, password reset)
 * and sends them via Resend using our React Email templates.
 *
 * Setup in Supabase Dashboard:
 *   Authentication → Hooks → Send Email → HTTP Request → this function URL
 *
 * Required env vars (set in Supabase Dashboard → Project Settings → Edge Functions):
 *   RESEND_API_KEY          — your Resend API key
 *   SEND_EMAIL_HOOK_SECRET  — the secret shown in Supabase when you create the hook
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!;
const HOOK_SECRET          = Deno.env.get('SEND_EMAIL_HOOK_SECRET')!;
const SUPABASE_PROJECT_URL = Deno.env.get('SUPABASE_URL')!;
const FROM                 = 'Activa 90 <onboarding@resend.dev>';

// ─── Email HTML Templates ─────────────────────────────────────────────────────
// Rendered from React Email. Placeholders replaced at send time:
//   __EMAIL__            → recipient email
//   __CONFIRMATION_URL__ → Supabase verification link

const CONFIRM_HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><html dir="ltr" lang="es"><head><style></style><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/><style>
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      mso-font-alt: 'Arial';
      src: url(https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2) format('woff2');
    }
    * { font-family: 'Montserrat', Arial; }
  </style><style>
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      mso-font-alt: 'Arial';
      src: url(https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXo.woff2) format('woff2');
    }
    * { font-family: 'Montserrat', Arial; }
  </style></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Bienvenido a Activa 90 — Tu transformación empieza hoy</div><body style="background-color:#f2f2f2;margin:0"><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td style="background-color:#f2f2f2;font-family:Montserrat, Arial, sans-serif;margin:0;padding:40px 0"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;margin:0 auto"><tbody><tr style="width:100%"><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#A8001C;padding:28px 40px;border-radius:8px 8px 0 0;text-align:center"><tbody><tr><td><img alt="Keller Williams" height="52" src="https://www.activa90.com/KWLogo.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto 10px" width="52"/><p style="font-size:22px;line-height:24px;color:#ffffff;font-weight:700;margin:0;letter-spacing:2px;text-transform:uppercase">Activa 90</p><p style="font-size:11px;line-height:24px;color:rgba(255,255,255,0.7);margin:2px 0 0;letter-spacing:1px;text-transform:uppercase">Keller Williams</p></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#ffffff;padding:40px 48px"><tbody><tr><td><h1 style="color:#0D0D0D;font-size:28px;font-weight:700;margin:0 0 16px;line-height:1.2">¡Bienvenida, __EMAIL__!</h1><p style="font-size:15px;line-height:1.7;color:#5C5C5C;margin:0 0 16px">Nos da mucho gusto tenerte en el programa. <strong>Activa 90</strong> es el programa de entrenamiento profesional de Keller Williams diseñado para transformar asesores en productores de alto rendimiento en <strong>90 días</strong>.</p><p style="font-size:15px;line-height:1.7;color:#5C5C5C;margin:0 0 32px">Tu acceso ya está activo. Confirma tu cuenta para comenzar tu primer módulo.</p><a href="__CONFIRMATION_URL__" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#A8001C;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:6px;text-align:center;box-sizing:border-box" target="_blank">Confirmar mi cuenta</a><hr style="width:100%;border:none;border-top:1px solid #E4DDD6;margin:36px 0"/><p style="font-size:12px;color:#0D0D0D;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px">Qué encontrarás en Activa 90</p><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td style="width:33%;padding-right:12px;vertical-align:top"><p style="font-size:24px;margin:0 0 6px">📋</p><p style="font-size:13px;color:#0D0D0D;font-weight:700;margin:0 0 4px">Clínicas</p><p style="font-size:12px;line-height:1.5;color:#5C5C5C;margin:0">Sesiones de práctica y refuerzo</p></td><td style="width:33%;padding:0 6px;vertical-align:top"><p style="font-size:24px;margin:0 0 6px">🎯</p><p style="font-size:13px;color:#0D0D0D;font-weight:700;margin:0 0 4px">Presentaciones</p><p style="font-size:12px;line-height:1.5;color:#5C5C5C;margin:0">Material de apoyo profesional</p></td><td style="width:33%;padding-left:12px;vertical-align:top"><p style="font-size:24px;margin:0 0 6px">📓</p><p style="font-size:13px;color:#0D0D0D;font-weight:700;margin:0 0 4px">Workbooks</p><p style="font-size:12px;line-height:1.5;color:#5C5C5C;margin:0">Ejercicios y seguimiento</p></td></tr></tbody></table></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#F5F0EB;padding:24px 48px;border-radius:0 0 8px 8px"><tbody><tr><td><p style="font-size:12px;line-height:1.6;color:#9B9B9B;text-align:center;margin:0">Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026<br/>Si no creaste esta cuenta, ignora este mensaje.</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html><!--/$-->`;

const RESET_HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><html dir="ltr" lang="es"><head><style></style><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/><style>
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      mso-font-alt: 'Arial';
      src: url(https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2) format('woff2');
    }
    * { font-family: 'Montserrat', Arial; }
  </style><style>
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      mso-font-alt: 'Arial';
      src: url(https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXo.woff2) format('woff2');
    }
    * { font-family: 'Montserrat', Arial; }
  </style></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Restablecer contraseña — Activa 90</div><body style="background-color:#f2f2f2;margin:0"><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td style="background-color:#f2f2f2;font-family:Montserrat, Arial, sans-serif;margin:0;padding:40px 0"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;margin:0 auto"><tbody><tr style="width:100%"><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#A8001C;padding:28px 40px;border-radius:8px 8px 0 0;text-align:center"><tbody><tr><td><img alt="Keller Williams" height="52" src="https://www.activa90.com/KWLogo.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto 10px" width="52"/><p style="font-size:22px;line-height:24px;color:#ffffff;font-weight:700;margin:0;letter-spacing:2px;text-transform:uppercase">Activa 90</p><p style="font-size:11px;line-height:24px;color:rgba(255,255,255,0.7);margin:2px 0 0;letter-spacing:1px;text-transform:uppercase">Keller Williams</p></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#ffffff;padding:40px 48px"><tbody><tr><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:rgba(168,0,28,0.08);border-radius:50%;width:64px;height:64px;margin:0 auto 24px;text-align:center"><tbody><tr><td><p style="font-size:30px;line-height:64px;margin:0">🔒</p></td></tr></tbody></table><h1 style="color:#0D0D0D;font-size:24px;font-weight:700;margin:0 0 16px;text-align:center;line-height:1.2">Restablecer contraseña</h1><p style="font-size:15px;line-height:1.7;color:#5C5C5C;margin:0 0 16px">Hola __EMAIL__, recibimos una solicitud para restablecer la contraseña de tu cuenta en Activa 90.</p><p style="font-size:15px;line-height:1.7;color:#5C5C5C;margin:0 0 32px">Haz clic en el botón para crear una nueva contraseña. Este enlace expira en <strong>1 hora</strong>.</p><a href="__CONFIRMATION_URL__" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#A8001C;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:6px;text-align:center;box-sizing:border-box" target="_blank">Restablecer mi contraseña</a><hr style="width:100%;border:none;border-top:1px solid #E4DDD6;margin:36px 0"/><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td style="background-color:#FEF3C7;border:1px solid #B45309;border-radius:6px;padding:14px 18px"><p style="font-size:13px;line-height:1.5;color:#B45309;margin:0"><strong>Aviso de seguridad:</strong> Si no solicitaste este cambio, ignora este mensaje. Tu contraseña actual no se verá afectada.</p></td></tr></tbody></table><p style="font-size:12px;line-height:1.5;color:#9B9B9B;margin:24px 0 0">Si el botón no funciona, copia este enlace en tu navegador:<br/><span style="color:#A8001C">__CONFIRMATION_URL__</span></p></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#F5F0EB;padding:24px 48px;border-radius:0 0 8px 8px"><tbody><tr><td><p style="font-size:12px;line-height:1.6;color:#9B9B9B;text-align:center;margin:0">Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026<br/>Este enlace es de uso único y expira en 1 hora.</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html><!--/$-->`;

// ─── Handler ──────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Validate hook secret
  const authHeader = req.headers.get('authorization');
  if (!HOOK_SECRET || authHeader !== `Bearer ${HOOK_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: { user: { email: string; user_metadata?: { full_name?: string } }; email_data: { token_hash: string; redirect_to: string; email_action_type: string } };

  try {
    payload = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { user, email_data } = payload;
  const { email } = user;
  const { token_hash, redirect_to, email_action_type } = email_data;

  // Build Supabase confirmation URL
  const confirmationUrl =
    `${SUPABASE_PROJECT_URL}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

  let subject: string;
  let html: string;

  if (email_action_type === 'signup') {
    subject = 'Confirma tu cuenta — Activa 90';
    html = CONFIRM_HTML
      .replaceAll('__EMAIL__', email)
      .replaceAll('__CONFIRMATION_URL__', confirmationUrl);
  } else if (email_action_type === 'recovery') {
    subject = 'Restablecer contraseña — Activa 90';
    html = RESET_HTML
      .replaceAll('__EMAIL__', email)
      .replaceAll('__CONFIRMATION_URL__', confirmationUrl);
  } else {
    // Pass through unsupported types (magic link, email change, etc.)
    return new Response(JSON.stringify({ message: 'Email type not handled, skipped' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Send via Resend
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [email], subject, html }),
  });

  if (!resendRes.ok) {
    const err = await resendRes.text();
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Email sent' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
