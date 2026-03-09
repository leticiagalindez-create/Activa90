/**
 * Renders React Email templates → HTML for Supabase email template editor.
 * Run: npx tsx emails/build-supabase-templates.ts
 */

import { render } from '@react-email/components';
import { createElement } from 'react';
import * as fs from 'fs';
import * as path from 'path';
import WelcomeEmail       from './welcome.tsx';
import ResetPasswordEmail from './reset-password.tsx';

const CONFIRM_PH = 'SUPABASE_CONFIRMATION_URL';
const RESET_PH   = 'SUPABASE_RESET_URL';

const outDir = path.join(process.cwd(), 'emails', 'supabase-html');
fs.mkdirSync(outDir, { recursive: true });

function cleanForSupabase(html: string): string {
  return html
    // Remove React internal comment markers
    .replace(/<!--\$-->/g, '').replace(/<!--\/\$-->/g, '')
    // Remove React text node comments like <!-- --> around variables
    .replace(/<!-- -->/g, '')
    // Remove the invisible preview filler characters (zero-width chars)
    .replace(/<div>\s*[\u200C\u200D\u200E\u200F\uFEFF\u034F ]+[\s\S]*?<\/div>/g, '')
    // ⚠️  CRITICAL: Remove <style> blocks — CSS curly braces {} break
    //    Supabase's Go template parser. All styles are already inlined by
    //    React Email so removing these blocks is safe.
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    // Fix logo to absolute production URL
    .replace(/src="\/static\/KWLogo\.png"/g, 'src="https://www.activa90.com/KWLogo.png"')
    .trim();
}

async function main() {
  // 1. Confirm Signup
  let confirmHtml = await render(
    createElement(WelcomeEmail, { name: '{{ .Email }}', loginUrl: CONFIRM_PH })
  );
  confirmHtml = cleanForSupabase(confirmHtml)
    .replaceAll(CONFIRM_PH, '{{ .ConfirmationURL }}');
  fs.writeFileSync(path.join(outDir, 'confirm-signup.html'), confirmHtml);
  console.log(`✅  confirm-signup.html  (${(confirmHtml.length / 1024).toFixed(1)} KB)`);

  // 2. Reset Password
  let resetHtml = await render(
    createElement(ResetPasswordEmail, { name: '{{ .Email }}', resetUrl: RESET_PH })
  );
  resetHtml = cleanForSupabase(resetHtml)
    .replaceAll(RESET_PH, '{{ .ConfirmationURL }}');
  fs.writeFileSync(path.join(outDir, 'reset-password.html'), resetHtml);
  console.log(`✅  reset-password.html  (${(resetHtml.length / 1024).toFixed(1)} KB)`);

  console.log('\nArchivos en: emails/supabase-html/');
}

main().catch(console.error);
