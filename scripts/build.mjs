import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const identity = JSON.parse(readFileSync(path.join(root, 'identity.json'), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const email = identity.supportEmail;
if (email && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email)) throw new Error('Invalid support email');
const ready = Boolean(identity.copyrightOwner && email);
const base = identity.basePath || '';
const nav = `<a class="brand" href="/"><span class="brand-mark" aria-hidden="true">P</span>PodiumPro</a><nav aria-label="Main navigation"><a href="/support/">Support</a><a href="/privacy/">Privacy</a></nav>`;
const contact = email
  ? `<a class="button" href="mailto:${escape(email)}">Email support</a><p class="small">${escape(email)}</p>`
  : '<p class="contact-pending">Contact address pending. This draft is not ready for public release.</p>';
const footer = `${identity.copyrightOwner ? `© 2026 ${escape(identity.copyrightOwner)}` : 'PodiumPro · Independent rehearsal software'}<span><a href="/support/">Support</a><a href="/privacy/">Privacy policy</a></span>`;
for (const page of ['index', 'support', 'privacy']) {
  const template = readFileSync(path.join(root, 'pages', `${page}.html`), 'utf8');
  const output = page === 'index' ? 'dist' : `dist/${page}`;
  mkdirSync(path.join(root, output), { recursive: true });
  const html = template.replaceAll('{{NAV}}', nav).replaceAll('{{FOOTER}}', footer)
    .replaceAll('{{CONTACT}}', contact)
    .replaceAll('{{OWNER}}', escape(identity.copyrightOwner || "PodiumPro's developer (identity pending)"))
    .replaceAll('{{DRAFT}}', ready ? '' : '<aside class="draft">Review draft — support contact information is pending.</aside>')
    .replaceAll('href="/', `href="${base}/`);
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error(`Unresolved template in ${page}`);
  writeFileSync(path.join(root, output, 'index.html'), html);
}
writeFileSync(path.join(root, 'dist', 'robots.txt'), ready
  ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n');
console.log(ready ? 'Built public-ready content; verify deployment and app links before submission.' : 'Built review draft; support contact information must be finalized.');
