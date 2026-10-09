import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const publicationBranch = 'master';
const supportedRemotes = new Set([
  'git@github.com:yangjiantao/yangjiantao.github.io.git',
  'https://github.com/yangjiantao/yangjiantao.github.io.git',
]);

function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    ...options,
    env: { ...process.env, ...options.env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr?.trim() || `git ${args[0]} failed`);
  return result.stdout.trim();
}

let staging;
try {
  if (!supportedRemotes.has(git(['remote', 'get-url', '--push', 'origin']))) {
    throw new Error('The origin push URL does not match the personal site repository.');
  }
  const sourceBranch = git(['symbolic-ref', '--short', 'HEAD']);
  if (sourceBranch === publicationBranch) {
    throw new Error('Run deployment from the source branch, not the generated master branch.');
  }
  if (git(['status', '--porcelain'])) {
    throw new Error('Commit source changes before deploying so the published site has a traceable source revision.');
  }
  const sourceCommit = git(['rev-parse', 'HEAD']);
  const verification = spawnSync('npm', ['run', 'verify'], { cwd: root, stdio: 'inherit' });
  if (verification.error) throw verification.error;
  if (verification.status !== 0) throw new Error('Site verification failed; publication stopped.');

  console.log(`Backing up source branch ${sourceBranch} to origin…`);
  git(['push', 'origin', `${sourceBranch}:refs/heads/${sourceBranch}`]);
  git(['fetch', '--no-tags', 'origin', `refs/heads/${publicationBranch}:refs/remotes/origin/${publicationBranch}`]);
  const parent = git(['rev-parse', `refs/remotes/origin/${publicationBranch}`]);

  // A separate index stages only dist/. The source checkout and its index stay intact.
  staging = await mkdtemp(join(tmpdir(), 'jiantao-pages-'));
  const indexEnvironment = { GIT_INDEX_FILE: join(staging, 'index') };
  const gitDirectory = git(['rev-parse', '--absolute-git-dir']);
  const outputArguments = ['--git-dir', gitDirectory, '--work-tree', output];
  const outputOptions = { cwd: output, env: indexEnvironment };
  git([...outputArguments, 'read-tree', '--empty'], outputOptions);
  git([...outputArguments, 'add', '--all', '--force', '--', '.'], outputOptions);
  const tree = git([...outputArguments, 'write-tree'], outputOptions);
  if (tree === git(['rev-parse', `${parent}^{tree}`])) {
    console.log('The published branch already contains this build.');
  } else {
    const commit = git(['commit-tree', tree, '-p', parent], {
      input: `Publish personal site\n\nSource branch: ${sourceBranch}\nSource commit: ${sourceCommit}\n`,
    });
    console.log(`Publishing verified static files to ${publicationBranch}…`);
    // The normal push refuses a concurrent change; publication never force-pushes.
    git(['push', 'origin', `${commit}:refs/heads/${publicationBranch}`]);
    console.log(`Published commit: ${commit}`);
  }
  console.log('GitHub Pages will deploy the master branch automatically.');
  console.log('Site: https://yangjiantao.github.io/');
  console.log('Deployment status: https://github.com/yangjiantao/yangjiantao.github.io/actions');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (staging) await rm(staging, { recursive: true, force: true });
}
