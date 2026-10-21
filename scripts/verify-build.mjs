import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const required = ['index.html', 'resume/index.html', 'projects/pandadoku/index.html', 'pandadoku/privacy/index.html', '404.html', '.nojekyll', 'app-ads.txt', 'google079d94aae576d184.html'];
const failures = [];
for (const file of required) {
  try { await stat(join(root, file)); } catch { failures.push(`Missing route: ${file}`); }
}
const privacy = await readFile(join(root, 'pandadoku/privacy/index.html'));
const digest = createHash('sha256').update(privacy).digest('hex');
if (digest !== '3393d249ad983470ee035fc2a3550efcf52d847cfefb03bf1c9ed0df086d9ff9') {
  failures.push('Privacy policy changed from the reviewed version. Review the change and update its checksum intentionally.');
}
const verification = await readFile(join(root, 'google079d94aae576d184.html'), 'utf8').catch(() => null);
if (verification !== 'google-site-verification: google079d94aae576d184.html') {
  failures.push('Google site verification file is missing or changed. Preserve the existing verification file exactly.');
}
const appHome = await readFile(join(root, 'projects/pandadoku/index.html'), 'utf8');
if (!/<h1\b[^>]*>pandadoku\b/.test(appHome) || !appHome.includes('熊猫数独')) {
  failures.push('App homepage must visibly identify pandadoku and its Chinese name.');
}
if (!appHome.includes('pandadoku is an Android logic-puzzle game.') || !/<a\b[^>]*href="\/pandadoku\/privacy\/"/.test(appHome)) {
  failures.push('App homepage must include a static app description and the configured privacy-policy link.');
}
if (!appHome.includes('Google Play Games sign-in identifies the player.') || !appHome.includes('Google Saved Games cloud backups save and restore game progress.')) {
  failures.push('App homepage must explain why Google player identity and cloud saves are used.');
}
const policyText = privacy.toString('utf8');
for (const text of ['当前封测版本与适用范围', 'Current closed-test version and scope', 'Google AdMob rewarded ads in a test environment', 'data-retention rules configured for this project']) {
  if (!policyText.includes(text)) failures.push(`Privacy policy is missing the current closed-test disclosure: ${text}`);
}
if (/首版上线前|Before the first app release|0\.1\.3|2 个月或 14 个月|either 2 or 14 months/.test(policyText)) {
  failures.push('Privacy policy contains obsolete version or unfinished retention wording.');
}
async function collect(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? collect(join(folder, entry.name)) : [join(folder, entry.name)]));
  return nested.flat();
}
const files = await collect(root);
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([\/#][^"]*)"/g)) {
    const current = new URL('/' + file.slice(root.length + 1), 'https://yangjiantao.github.io');
    const url = new URL(match[1].replaceAll('&amp;', '&'), current);
    if (url.origin !== 'https://yangjiantao.github.io') continue;
    const pathname = decodeURIComponent(url.pathname);
    let target = join(root, pathname);
    try {
      const info = await stat(target);
      if (info.isDirectory()) target = join(target, 'index.html');
      await stat(target);
      if (url.hash && target.endsWith('.html')) {
        const destination = await readFile(target, 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        if (!destination.includes(`id="${id}"`)) failures.push(`Missing anchor: ${url.pathname}${url.hash}`);
      }
    } catch { failures.push(`Broken local link in ${file.slice(root.length + 1)}: ${match[1]}`); }
  }
}
for (const old of ['2017', '2018', '2019', 'archives', 'categories', 'tags', 'lib']) {
  if (files.some(file => file.startsWith(join(root, old) + '/'))) failures.push(`Legacy output still shipped: ${old}`);
}
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${required.length - 1} routes, the Pages .nojekyll marker, all local links and anchors, reviewed privacy checksum, unchanged Google verification file, static app identity and description, and removal of legacy output.`);
}
