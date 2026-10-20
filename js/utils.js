import { CATEGORIES, PRODUCTS } from '../data/products.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const money = (n) => '£' + n.toFixed(2);
export const pctOff = (p) => Math.round((1 - p.price / p.was) * 100);
export const fmtCount = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n));

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);

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

// ---------- Icons (category artwork, white line icons) ----------
const ICON_PATHS = {
  lamp: '<path d="M8 4h8l3 8H5z"/><path d="M12 12v6"/><path d="M8 20h8"/>',
  box: '<path d="M3 8l9-4 9 4-9 4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/>',
  pot: '<path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M2 10h2M20 10h2"/><path d="M9 6c0-1 1-2 3-2s3 1 3 2"/>',
  bed: '<path d="M3 18V8"/><path d="M3 14h18v4"/><path d="M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  plug: '<path d="M9 3v5M15 3v5"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v3"/>',
};
export function productArt(p, cls = '') {
  const c = getCategory(p.category);
  // vary the gradient angle per product so tiles don't look identical
  const angle = 120 + (p.id.charCodeAt(1) * 37) % 90;
  return `<div class="art ${cls}" style="background:linear-gradient(${angle}deg, ${c.colors[0]}, ${c.colors[1]})">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[c.icon]}</svg>
  </div>`;
}
export const categoryIcon = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[c.icon]}</svg>`;

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
  let el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------- Product card (shared) ----------
export function productCard(p, opts = {}) {
  return `<a class="card product-card" href="#/product/${p.id}">
    ${productArt(p)}
    <div class="pc-body">
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-meta">${stars(p.rating, 11)} <span>${p.rating} · ${fmtCount(p.sold)} sold</span></div>
      <div class="pc-price"><strong>${money(p.price)}</strong> <s>${money(p.was)}</s></div>
      <div class="pc-badges">
        ${p.warehouse === 'UK' ? '<span class="badge badge-green">UK warehouse · 2–4 days</span>' : '<span class="badge">Ships from China · 7–14 days</span>'}
        ${opts.reason ? `<span class="badge badge-blue">${esc(opts.reason)}</span>` : ''}
      </div>
    </div>
  </a>`;
}
