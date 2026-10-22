import { CATEGORIES, PRODUCTS, ASPECT_LABELS } from '../data/products.js';
import { mainImageUri, cutoutUri } from './images.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const money = (n) => '£' + n.toFixed(2);
export const pctOff = (p) => Math.round((1 - p.price / p.was) * 100);
export const fmtCount = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n));

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const aspectLabels = (p) => ASPECT_LABELS[p.category] || ASPECT_LABELS.default;

// ---------- Delivery ----------
const WINDOWS = { UK: [2, 4], CN: [7, 14] };
export function deliveryWindow(p, from = new Date()) {
  const [a, b] = WINDOWS[p.warehouse];
  const add = (d) => { const x = new Date(from); x.setDate(x.getDate() + d); return x; };
  return { earliest: add(a), latest: add(b), days: [a, b] };
}
export const fmtDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
export const deliveryText = (p) => {
  const w = deliveryWindow(p);
  return `${fmtDate(w.earliest)} – ${fmtDate(w.latest)}`;
};

// ---------- Units ----------
export const cmToIn = (cm) => (cm / 2.54).toFixed(1);
export function dimsText(dims, unit = 'cm') {
  if (!dims) return '—';
  const v = unit === 'in' ? dims.map(cmToIn) : dims;
  return `${v.join(' × ')} ${unit}`;
}

// ---------- Rating ----------
export function stars(r, size = 12) {
  const full = Math.round(r * 2) / 2;
  let out = '';
  for (let i = 1; i <= 5; i++) {
    const fill = full >= i ? 1 : full >= i - 0.5 ? 0.5 : 0;
    out += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g${i}${fill}"><stop offset="${fill * 100}%" stop-color="currentColor"/><stop offset="${fill * 100}%" stop-color="currentColor" stop-opacity=".25"/></linearGradient></defs><path fill="url(#g${i}${fill})" d="M12 2l3.1 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.6 21.4l1.5-7.1L1.7 9.4l7.2-.8z"/></svg>`;
  }
  return `<span class="stars" aria-label="${r} out of 5">${out}</span>`;
}

// ---------- Icons (white line icons, 24×24) ----------
export const ICONS = {
  lamp: '<path d="M8 4h8l3 8H5z"/><path d="M12 12v6"/><path d="M8 20h8"/>',
  box: '<path d="M3 8l9-4 9 4-9 4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/>',
  pot: '<path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M2 10h2M20 10h2"/><path d="M9 6c0-1 1-2 3-2s3 1 3 2"/>',
  kettle: '<path d="M7 8h9l1 11H6z"/><path d="M9 8V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2"/><path d="M17 10h1a2 2 0 0 1 2 2v2l-3 2"/>',
  bed: '<path d="M3 18V8"/><path d="M3 14h18v4"/><path d="M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  plug: '<path d="M9 3v5M15 3v5"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v3"/>',
  shirt: '<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
  shoe: '<path d="M3 16v-5l4-1 2 2 3-1 3 3 5 1a2 2 0 0 1 1 2v1H3z"/><path d="M3 19h18"/>',
  coat: '<path d="M9 3h6l2 3 3 2-1 13h-5l-2-9-2 9H5L4 8l3-2z"/><path d="M12 12V6"/>',
  bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  coffee: '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 11h1a2 2 0 0 1 0 4h-1"/><path d="M8 3v3M12 3v3"/>',
  cup: '<path d="M5 8h14l-2 12H7z"/><path d="M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2"/>',
  gift: '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 13h18M12 9v12"/><path d="M12 9c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 8c0-2 1-3 1-5M12 8c0-2 1-3 1-5M16 8c0-2 1-3 1-5"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  watch: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6l1-3h4l1 3M9 18l1 3h4l1-3"/><path d="M12 10v2l1.5 1.5"/>',
  battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4"/><path d="M11 9l-2 3h4l-2 3"/>',
  bottle: '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3z"/><path d="M8 13h8"/>',
  dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6"/><path d="M6 12h12"/>',
  flask: '<rect x="7" y="6" width="10" height="15" rx="3"/><path d="M9 3h6v3H9z"/><path d="M7 11h10"/>',
  suitcase: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V4h6v3"/><path d="M9 11v5M15 11v5"/>',
  car: '<path d="M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16"/><rect x="3" y="15" width="18" height="4" rx="1"/><path d="M6 19v2M18 19v2"/>',
  house: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
export const icon = (name, attrs = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${ICONS[name] || ICONS.box}</svg>`;

// Clean product shot (no text) — small tiles, carousel, PK table
export function productArt(p, cls = '') {
  return `<img class="art ${cls}" src="${cutoutUri(p)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`;
}
export const categoryIcon = (c) => icon(c.icon);

// ---------- Safe localStorage ----------
export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('starpick:' + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('starpick:' + key, JSON.stringify(value)); } catch { /* ignore */ }
  },
};

// ---------- Toast ----------
export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------- Product card (shared) ----------
export function productCard(p, opts = {}) {
  return `<a class="card product-card" href="#/product/${p.id}">
    <img class="card-img" src="${mainImageUri(p)}" alt="${esc(p.name)}" loading="lazy" decoding="async">
    <div class="pc-body">
      ${p.official ? `<div class="pc-brand">${esc(p.brand)} <span class="official">Official</span></div>` : ''}
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-meta">${stars(p.rating, 11)} <span>${p.rating} · ${fmtCount(p.sold)} sold</span></div>
      <div class="pc-price"><strong>${money(p.price)}</strong> <s>${money(p.was)}</s></div>
      <div class="pc-badges">
        ${p.warehouse === 'UK' ? '<span class="badge badge-green">UK · 2–4 days</span>' : '<span class="badge">From China · 7–14 days</span>'}
        ${opts.reason ? `<span class="badge badge-blue">${esc(opts.reason)}</span>` : ''}
      </div>
    </div>
  </a>`;
}

// ---------- Lightbox (merchant images, buyer photos) ----------
export function openLightbox(list, start = 0, caption = '') {
  let i = start;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  const render = () => {
    box.innerHTML = `<button class="lb-close" aria-label="Close">×</button>
      ${list.length > 1 ? '<button class="lb-prev" aria-label="Previous">‹</button><button class="lb-next" aria-label="Next">›</button>' : ''}
      <figure><img src="${list[i]}" alt=""><figcaption>${esc(caption)}${list.length > 1 ? ` · ${i + 1} / ${list.length}` : ''}</figcaption></figure>`;
    box.querySelector('.lb-close').onclick = close;
    if (list.length > 1) {
      box.querySelector('.lb-prev').onclick = (e) => { e.stopPropagation(); i = (i - 1 + list.length) % list.length; render(); };
      box.querySelector('.lb-next').onclick = (e) => { e.stopPropagation(); i = (i + 1) % list.length; render(); };
    }
  };
  const close = () => { box.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight' && list.length > 1) { i = (i + 1) % list.length; render(); }
    if (e.key === 'ArrowLeft' && list.length > 1) { i = (i - 1 + list.length) % list.length; render(); }
  };
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', onKey);
  render();
  document.body.appendChild(box);
}
