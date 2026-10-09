import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const required = ['index.html', 'resume/index.html', 'projects/pandadoku/index.html', 'pandadoku/privacy/index.html', '404.html', '.nojekyll'];
const failures = [];
for (const file of required) {
  try { await stat(join(root, file)); } catch { failures.push(`Missing route: ${file}`); }
}
const privacy = await readFile(join(root, 'pandadoku/privacy/index.html'));
const digest = createHash('sha256').update(privacy).digest('hex');
if (digest !== 'ae63a8dd11ffe33faf2c5d1b6cb3e6a4186a60d912dbd95551913d8270fac08b') {
  failures.push('Privacy policy changed from the preserved original. Review the change and update its checksum intentionally.');
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
  console.log(`Verified ${required.length - 1} routes, the Pages .nojekyll marker, all local links and anchors, preserved privacy checksum, and removal of legacy output.`);
}
