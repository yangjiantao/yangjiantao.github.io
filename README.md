# Jiantao · Personal studio

A static personal site built with Astro, TypeScript and GSAP. The design uses an editorial layout, an interactive 3 × 3 grid, and original Pandadoku product images.

## Run locally

Node.js 22.12 or later is required.

```sh
npm ci --ignore-scripts
npm run dev
```

Run the checks and produce the static site:

```sh
npm run verify
npm run preview
```

`npm run verify` checks Astro/TypeScript, builds the site, then verifies all local links and anchors, expected routes, and the preserved privacy policy checksum. The output folder is `dist/`. In agent environments, Astro may start servers in the background; use `--ignore-lock` for a foreground server, or `astro dev stop` / `astro preview stop` to stop the tracked background server.

## Pages

- `/`: introduction, selected work, personal approach and contact.
- `/resume/`: historical work experience and a print layout. The browser's Print / Save as PDF dialog exports the resume.
- `/projects/pandadoku/`: actual product screenshots and development story.
- `/pandadoku/privacy/`: the original bilingual privacy policy, copied without modification from `public/pandadoku/privacy/index.html`.
- `/404.html`: missing-page navigation.

## Update content

Edit `src/data/profile.ts` to change public name, email and career history. The career information is from the 2018 resume; the site intentionally does not represent the last listed employer as current. Add verified recent experience before using it as an up-to-date professional resume.

Shared markup lives in `src/components/` and `src/layouts/Base.astro`. Page content lives in `src/pages/`; the visual system is `src/styles/global.css`; animation and interaction logic is `src/scripts/motion.ts`.

The motion preference is saved locally. System reduced-motion takes priority. Navigation, content and contact links work without JavaScript; animated grid controls and the motion switch require JavaScript. Fonts are bundled locally. No analytics scripts are added.

## Assets and privacy

`public/images/pandadoku-*.png` are copied from the user's Pandadoku project, including approved brand artwork and real development screenshots. Their source paths were:

- `assets/art/brand/store_icon.png`
- `docs/art-proposals/panda/delivery/panda_home.png`
- `docs/art-proposals/panda/delivery/panda_board_idle.png`

The privacy document SHA-256 is pinned in `scripts/verify-build.mjs`. An intentional future privacy update must also update that digest after reviewing the bilingual content.

## Legacy and publication

The previous generated Hexo blog is preserved intact in `legacy/`, outside the new build. The Git tag `legacy-blog-2026-10-09` also points to its original commit. No legacy dependencies or pages enter `dist/`.

Source files, the lockfile and the archive are kept on `codex/personal-studio`. The `master` branch contains only the built static site and is the existing GitHub Pages publishing source (branch `master`, folder `/`). No Pages settings change is required. `.nojekyll` preserves the `_astro/` assets and skips Jekyll processing.

After committing your source changes, publish with:

```sh
npm run deploy
```

This command verifies and builds the site, pushes the current source branch, and creates a normal commit on remote `master` containing only `dist/`. Its commit message records the source revision. It uses a separate temporary Git index, keeps the source checkout intact, preserves the existing `master` history, and never force-pushes. A concurrent remote update causes the push to fail safely; rerun after reviewing that update.

GitHub then deploys `master` automatically to https://yangjiantao.github.io/. Watch the **pages build and deployment** run in [Actions](https://github.com/yangjiantao/yangjiantao.github.io/actions) to confirm publication. `.github/workflows/check.yml` also checks source pushes and pull requests; pushing source alone does not publish it.
