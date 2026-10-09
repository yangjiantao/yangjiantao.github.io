import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);
document.documentElement.classList.add('js-enabled');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let userMotion = true;
try { userMotion = localStorage.getItem('jiantao-motion') !== 'off'; } catch { /* Preferences remain usable when storage is unavailable. */ }
let context: gsap.Context | undefined;
let cleanup: (() => void)[] = [];
let entrancePlayed = false;
const motionButton = document.querySelector<HTMLButtonElement>('.motion-toggle');
const shuffle = document.querySelector<HTMLButtonElement>('.grid-shuffle');
const scene = document.querySelector<HTMLElement>('[data-grid-scene]');
const grid = document.querySelector<HTMLElement>('.motion-grid');
const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]');
const progress = document.querySelector<HTMLElement>('.reading-progress');

function animateSite() {
  const mm = gsap.matchMedia();
  if (scene) mm.add('(min-width: 781px)', () => {
    gsap.to('.statement-grid', { rotation: 16, y: -45, ease: 'none', scrollTrigger: { trigger: '.statement-section', start: 'top bottom', end: 'bottom top', scrub: .7 } });
    gsap.fromTo('.project-big-type', { y: 20 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.project-visual', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });
  cleanup.push(() => mm.revert());
  if (scene && !entrancePlayed) {
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entrance.from('.hero-intro', { y: 12, opacity: 0, duration: .6 })
      .from('.hero-line', { y: 56, opacity: 0, duration: .95, stagger: .11 }, .1)
      .from('.hero-description, .hero-cta', { y: 18, opacity: 0, duration: .7, stagger: .1 }, .5)
      .from(tiles, { x: i => (i % 3 - 1) * 34, y: i => (Math.floor(i / 3) - 1) * 34, rotation: i => (i % 2 ? 9 : -9), scale: .7, opacity: 0, stagger: { amount: .42, from: 'center' }, duration: 1.2 }, .2);
    entrancePlayed = true;
  }
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
    gsap.from(el, { y: 26, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 91%', once: true } });
  });
  if (scene && grid && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const xTo = gsap.quickTo(grid, 'rotationY', { duration: .7, ease: 'power3.out' });
    const yTo = gsap.quickTo(grid, 'rotationX', { duration: .7, ease: 'power3.out' });
    const pointerMove = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect();
      xTo((event.clientX - bounds.left - bounds.width / 2) / bounds.width * 13);
      yTo(-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 13);
    };
    const pointerLeave = () => { xTo(0); yTo(0); };
    scene.addEventListener('pointermove', pointerMove);
    scene.addEventListener('pointerleave', pointerLeave);
    cleanup.push(() => { scene.removeEventListener('pointermove', pointerMove); scene.removeEventListener('pointerleave', pointerLeave); });
  }
  if (tiles.length) {
    const spin = gsap.to('.tile-rings', { rotationY: 32, rotationX: -12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
    ScrollTrigger.create({ trigger: scene, start: 'top bottom', end: 'bottom top', onToggle: self => { self.isActive && !document.hidden ? spin.resume() : spin.pause(); } });
    const visibility = () => { !document.hidden && scene && scene.getBoundingClientRect().bottom > 0 && scene.getBoundingClientRect().top < innerHeight ? spin.resume() : spin.pause(); };
    document.addEventListener('visibilitychange', visibility);
    cleanup.push(() => document.removeEventListener('visibilitychange', visibility));
    visibility();
  }
}

function configureMotion() {
  cleanup.forEach(fn => fn());
  cleanup = [];
  context?.revert();
  const enabled = userMotion && !reduced.matches;
  document.documentElement.classList.toggle('motion-off', !enabled);
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.disabled = reduced.matches;
    motionButton.setAttribute('aria-pressed', String(enabled));
    motionButton.setAttribute('aria-label', reduced.matches ? '已跟随系统减少动态效果设置' : enabled ? '关闭动态效果' : '开启动态效果');
    const label = motionButton.querySelector('.motion-label');
    if (label) label.textContent = reduced.matches ? '系统关闭' : enabled ? '开' : '关';
  }
  if (shuffle) {
    shuffle.hidden = false;
    shuffle.disabled = !enabled;
    shuffle.title = enabled ? '重新排列装饰网格' : '减少动态效果时暂停网格动画';
  }
  if (enabled) context = gsap.context(animateSite);
}
configureMotion();
reduced.addEventListener('change', configureMotion);
motionButton?.addEventListener('click', () => {
  userMotion = !userMotion;
  try { localStorage.setItem('jiantao-motion', userMotion ? 'on' : 'off'); } catch { /* The toggle still works without storage. */ }
  configureMotion();
});

shuffle?.addEventListener('click', () => {
  if (!userMotion || reduced.matches || !tiles.length) return;
  shuffle.disabled = true;
  // Keep timelines in the active GSAP context so switching motion off cancels them.
  context?.add(() => {
    if (!grid) return;
    const state = Flip.getState(tiles);
    const current = Array.from(grid.children) as HTMLElement[];
    const next = [...current];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    // A click always changes the arrangement, even if the random shuffle is identical.
    if (next.every((tile, i) => tile === current[i])) next.push(next.shift()!);
    next.forEach(tile => grid.appendChild(tile));
    Flip.from(state, {
      duration: .9, ease: 'power3.inOut', stagger: .025, scale: true,
      onComplete: () => { shuffle.disabled = !userMotion || reduced.matches; },
    });
  });
});

// Reading progress has a tiny native listener and also works with motion disabled.
let scheduled = false;
function updateProgress() {
  const height = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0})`;
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Non-modal mobile navigation: ordinary links remain keyboard accessible.
const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#site-nav');
function closeMenu(returnFocus = false) { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); if (returnFocus) menu?.focus(); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('is-open', open); });
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', e => { if (e.target instanceof Node && !nav?.contains(e.target) && !menu?.contains(e.target)) closeMenu(); });

const copyButton = document.querySelector<HTMLButtonElement>('.copy-email');
if (copyButton) copyButton.hidden = false;
copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  const status = document.querySelector<HTMLElement>('.copy-status');
  if (!email || !status) return;
  try { await navigator.clipboard.writeText(email); status.textContent = '邮箱已复制，期待你的来信。'; }
  catch { status.textContent = `可以直接复制 ${email}，或点击邮箱打开邮件应用。`; }
});

const printButton = document.querySelector<HTMLButtonElement>('[data-print]');
if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }
