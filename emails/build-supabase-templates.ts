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

async function main() {
  // 1. Confirm Signup
  let confirmHtml = await render(
    createElement(WelcomeEmail, { name: '{{ .Email }}', loginUrl: CONFIRM_PH })
  );
  confirmHtml = confirmHtml.replaceAll(CONFIRM_PH, '{{ .ConfirmationURL }}');
  fs.writeFileSync(path.join(outDir, 'confirm-signup.html'), confirmHtml);
  console.log('✅  confirm-signup.html');

  // 2. Reset Password
  let resetHtml = await render(
    createElement(ResetPasswordEmail, { name: '{{ .Email }}', resetUrl: RESET_PH })
  );
  resetHtml = resetHtml.replaceAll(RESET_PH, '{{ .ConfirmationURL }}');
  fs.writeFileSync(path.join(outDir, 'reset-password.html'), resetHtml);
  console.log('✅  reset-password.html');

  console.log('\nArchivos en: emails/supabase-html/');
}

main().catch(console.error);
