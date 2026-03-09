/**
 * Supabase Edge Function — send-progress-email
 *
 * Called by the client after a module is marked complete.
 * Sends a module-complete or course-complete email via Resend.
 *
 * Required env vars (Supabase Dashboard → Project Settings → Edge Functions):
 *   RESEND_API_KEY         — your Resend API key
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (auto-set by Supabase)
 */

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FROM                 = 'Activa 90 <hola@info.activa90.com>';
const DASHBOARD_URL        = 'https://www.activa90.com/dashboard.html';

// ─── Handler ──────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Verify user JWT
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await adminClient.auth.getUser(token);
  if (authErr || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get profile name
  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const name  = profile?.full_name || user.email?.split('@')[0] || 'Asesor';
  const email = user.email!;

  // Parse request body
  let body: {
    moduleName:      string;
    moduleNumber:    number;
    totalModules:    number;
    completedModules: number;
    nextModuleName?: string;
    nextModuleUrl?:  string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { moduleName, moduleNumber, totalModules, completedModules, nextModuleName, nextModuleUrl } = body;
  const isLastModule    = completedModules >= totalModules;
  const progressPercent = Math.round((completedModules / totalModules) * 100);

  const subject = isLastModule
    ? '¡Felicidades! Completaste Activa 90 🏆'
    : `¡Módulo ${moduleNumber} completado! — Activa 90`;

  const html = isLastModule
    ? buildCourseCompleteHtml(name, totalModules)
    : buildModuleCompleteHtml({ name, moduleName, moduleNumber, totalModules, completedModules, progressPercent, nextModuleName, nextModuleUrl });

  // Send via Resend
  const resendRes = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
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

// ─── Module Complete Email ─────────────────────────────────────────────────────
function buildModuleCompleteHtml(opts: {
  name:             string;
  moduleName:       string;
  moduleNumber:     number;
  totalModules:     number;
  completedModules: number;
  progressPercent:  number;
  nextModuleName?:  string;
  nextModuleUrl?:   string;
}): string {
  const { name, moduleName, moduleNumber, totalModules, completedModules, progressPercent, nextModuleName, nextModuleUrl } = opts;

  const nextSection = nextModuleName
    ? `<p style="color:#0D0D0D;font-weight:700;font-size:14px;margin:0 0 6px;">Siguiente módulo:</p>
       <p style="color:#5C5C5C;font-size:15px;margin:0 0 24px;line-height:1.6;">Módulo ${moduleNumber + 1}: ${nextModuleName}</p>
       <a href="${nextModuleUrl || DASHBOARD_URL}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#A8001C;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:6px;text-align:center;box-sizing:border-box;" target="_blank">Continuar con el siguiente módulo →</a>`
    : `<a href="${DASHBOARD_URL}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#A8001C;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:6px;text-align:center;box-sizing:border-box;" target="_blank">Ver mi progreso</a>`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="es"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head>
<body style="background-color:#f2f2f2;margin:0;padding:40px 0;font-family:Arial,sans-serif;">
<table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tbody><tr><td style="padding:40px 0;">
<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;">
<tbody><tr style="width:100%"><td>

  <!-- Header -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#A8001C;padding:28px 40px;border-radius:8px 8px 0 0;text-align:center;">
    <tbody><tr><td>
      <img alt="Keller Williams" height="52" src="https://www.activa90.com/KWLogo.png"
        style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto 10px;" width="52"/>
      <p style="font-size:22px;color:#ffffff;font-weight:700;margin:0;letter-spacing:2px;text-transform:uppercase;">Activa 90</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.7);margin:2px 0 0;letter-spacing:1px;text-transform:uppercase;">Keller Williams</p>
    </td></tr></tbody>
  </table>

  <!-- Achievement banner -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#EAF5EE;padding:16px 48px;">
    <tbody><tr>
      <td style="width:36px;vertical-align:middle;padding-right:12px;"><p style="font-size:24px;margin:0;">✅</p></td>
      <td style="vertical-align:middle;">
        <p style="color:#1A7A40;font-weight:700;font-size:14px;margin:0 0 2px;">¡Módulo ${moduleNumber} de ${totalModules} completado!</p>
        <p style="color:#1A7A40;font-size:13px;margin:0;">${progressPercent}% del programa completado</p>
      </td>
    </tr></tbody>
  </table>

  <!-- Body -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#ffffff;padding:40px 48px;">
    <tbody><tr><td>
      <h1 style="color:#0D0D0D;font-size:26px;font-weight:700;margin:0 0 16px;line-height:1.2;">¡Lo lograste, ${name}!</h1>
      <p style="color:#5C5C5C;font-size:14px;margin:0 0 8px;">Completaste el módulo:</p>

      <!-- Module highlight -->
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
        style="background-color:rgba(168,0,28,0.07);border-left:4px solid #A8001C;border-radius:4px;padding:12px 18px;margin-bottom:24px;">
        <tbody><tr><td>
          <p style="color:#A8001C;font-weight:700;font-size:15px;margin:0;">Módulo ${moduleNumber}: ${moduleName}</p>
        </td></tr></tbody>
      </table>

      <p style="color:#5C5C5C;font-size:15px;line-height:1.7;margin:0 0 32px;">
        Cada módulo que terminas te acerca más a convertirte en un productor de alto rendimiento. Tu consistencia y dedicación marcan la diferencia.
      </p>

      <!-- Progress bar -->
      <p style="color:#0D0D0D;font-weight:700;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Tu progreso</p>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
        style="background-color:#E4DDD6;border-radius:4px;height:8px;margin-bottom:8px;">
        <tbody><tr><td style="width:${progressPercent}%;background-color:#A8001C;border-radius:4px;height:8px;"></td>
        <td style="width:${100 - progressPercent}%;"></td></tr></tbody>
      </table>
      <p style="color:#9B9B9B;font-size:12px;margin:0 0 32px;">${completedModules} de ${totalModules} módulos · ${progressPercent}% completado</p>

      <hr style="width:100%;border:none;border-top:1px solid #E4DDD6;margin:0 0 32px;"/>
      ${nextSection}
    </td></tr></tbody>
  </table>

  <!-- Footer -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#F5F0EB;padding:24px 48px;border-radius:0 0 8px 8px;">
    <tbody><tr><td>
      <p style="font-size:12px;color:#9B9B9B;text-align:center;margin:0;line-height:1.6;">
        Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026
      </p>
    </td></tr></tbody>
  </table>

</td></tr></tbody></table>
</td></tr></tbody></table>
</body></html>`;
}

// ─── Course Complete Email ─────────────────────────────────────────────────────
function buildCourseCompleteHtml(name: string, totalModules: number): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="es"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head>
<body style="background-color:#f2f2f2;margin:0;padding:40px 0;font-family:Arial,sans-serif;">
<table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tbody><tr><td style="padding:40px 0;">
<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;">
<tbody><tr style="width:100%"><td>

  <!-- Hero Header -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#A8001C;padding:36px 40px;border-radius:8px 8px 0 0;text-align:center;">
    <tbody><tr><td>
      <p style="font-size:48px;margin:0 0 12px;">🏆</p>
      <img alt="Keller Williams" height="52" src="https://www.activa90.com/KWLogo.png"
        style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto 10px;" width="52"/>
      <p style="font-size:24px;color:#ffffff;font-weight:700;margin:0;letter-spacing:2px;text-transform:uppercase;">Activa 90</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.7);margin:4px 0 0;letter-spacing:1px;text-transform:uppercase;">Keller Williams · Programa Completado</p>
    </td></tr></tbody>
  </table>

  <!-- Gold strip -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#FEF3C7;padding:14px 48px;text-align:center;">
    <tbody><tr><td>
      <p style="color:#B45309;font-weight:700;font-size:13px;margin:0;text-transform:uppercase;letter-spacing:2px;">★  &nbsp;Productor de Alto Rendimiento&nbsp;  ★</p>
    </td></tr></tbody>
  </table>

  <!-- Body -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#ffffff;padding:40px 48px;">
    <tbody><tr><td>
      <h1 style="color:#0D0D0D;font-size:30px;font-weight:700;margin:0 0 8px;text-align:center;line-height:1.15;">¡Felicidades, ${name}!</h1>
      <p style="color:#A8001C;font-weight:700;font-size:17px;margin:0 0 28px;text-align:center;line-height:1.4;">
        Completaste los ${totalModules} módulos de Activa 90
      </p>

      <p style="color:#5C5C5C;font-size:15px;line-height:1.7;margin:0 0 16px;">
        En 90 días demostraste lo más importante: <strong>consistencia, disciplina y compromiso con tu crecimiento profesional</strong>. Eso es lo que separa a los asesores promedio de los productores de alto rendimiento.
      </p>
      <p style="color:#5C5C5C;font-size:15px;line-height:1.7;margin:0 0 36px;">
        Keller Williams está orgulloso de acompañarte en este camino. Lo que aprendiste aquí no es teoría — es el sistema que usan los mejores agentes del mundo.
      </p>

      <hr style="width:100%;border:none;border-top:1px solid #E4DDD6;margin:0 0 32px;"/>

      <!-- Stats -->
      <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:36px;">
        <tbody><tr>
          <td style="width:33%;text-align:center;">
            <p style="color:#A8001C;font-weight:700;font-size:36px;margin:0 0 4px;">${totalModules}</p>
            <p style="color:#9B9B9B;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;">Módulos</p>
          </td>
          <td style="width:33%;text-align:center;border-left:1px solid #E4DDD6;border-right:1px solid #E4DDD6;">
            <p style="color:#A8001C;font-weight:700;font-size:36px;margin:0 0 4px;">90</p>
            <p style="color:#9B9B9B;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;">Días</p>
          </td>
          <td style="width:33%;text-align:center;">
            <p style="color:#A8001C;font-weight:700;font-size:36px;margin:0 0 4px;">100%</p>
            <p style="color:#9B9B9B;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;">Completado</p>
          </td>
        </tr></tbody>
      </table>

      <hr style="width:100%;border:none;border-top:1px solid #E4DDD6;margin:0 0 32px;"/>
      <a href="${DASHBOARD_URL}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#A8001C;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:6px;text-align:center;box-sizing:border-box;" target="_blank">Ver mi progreso completo</a>
    </td></tr></tbody>
  </table>

  <!-- Motivational closing -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:rgba(168,0,28,0.07);padding:24px 48px;">
    <tbody><tr><td>
      <p style="color:#A8001C;font-weight:700;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">El siguiente paso es tuyo</p>
      <p style="color:#5C5C5C;font-size:14px;margin:0;line-height:1.7;">
        El programa terminó, pero tu carrera acaba de comenzar. Usa cada herramienta, cada técnica y cada hábito que construiste aquí para crear resultados reales. Keller Williams estará aquí para apoyarte.
      </p>
    </td></tr></tbody>
  </table>

  <!-- Footer -->
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#F5F0EB;padding:24px 48px;border-radius:0 0 8px 8px;">
    <tbody><tr><td>
      <p style="font-size:12px;color:#9B9B9B;text-align:center;margin:0;line-height:1.6;">
        Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026
      </p>
    </td></tr></tbody>
  </table>

</td></tr></tbody></table>
</td></tr></tbody></table>
</body></html>`;
}
