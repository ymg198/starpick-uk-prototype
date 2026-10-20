// App shell: hash router, header search with autocomplete, PK tray, basket counter.
import { HOT_KEYWORDS } from '../data/products.js';
import { suggest } from './search.js';
import { $, $$, esc, store, toast, getProduct, productArt } from './utils.js';
import { renderHome } from './views/home.js';
import { renderSearch } from './views/search.js';
import { renderProduct } from './views/product.js';
import { renderCompare } from './views/compare.js';

// ---------- Shared state ----------
export function setPK(ids) { store.set('pk', ids); renderTray(); }
export function addToPK(id) {
  const ids = store.get('pk', []);
  if (ids.includes(id)) return toast('Already in your PK list');
  if (ids.length >= 3) return toast('PK holds up to 3 items — remove one first');
  setPK([...ids, id]);
  toast(ids.length ? 'Added — open PK to compare' : 'Added to PK. Add another to compare');
}
export function addToBasket(id) {
  const b = store.get('basket', []);
  store.set('basket', [...b, id]);
  updateBasket();
  toast('Added to basket');
}
function updateBasket() {
  const n = store.get('basket', []).length;
  $('#basket-count').textContent = n;
  $('#basket-count').hidden = !n;
}

// ---------- PK tray (floating bar at the bottom) ----------
function renderTray() {
  const ids = store.get('pk', []);
  const tray = $('#pk-tray');
  const onCompare = location.hash.startsWith('#/compare');
  $('#pk-count').textContent = ids.length;
  $('#pk-count').hidden = !ids.length;
  if (!ids.length || onCompare) { tray.classList.remove('show'); return; }
  tray.innerHTML = `
    <div class="tray-items">${ids.map((id) => productArt(getProduct(id), 'mini')).join('')}
      ${ids.length < 3 ? '<span class="tray-slot">+</span>' : ''}</div>
    <span class="tray-text">${ids.length} of 3 in PK</span>
    <button class="link-btn" id="tray-clear">Clear</button>
    <a class="pill pill-blue" href="#/compare?ids=${ids.join(',')}">Compare</a>`;
  tray.classList.add('show');
  $('#tray-clear').onclick = () => setPK([]);
}

// ---------- Header search + autocomplete ----------
function initSearch() {
  const input = $('#q');
  const panel = $('#suggest');
  let active = -1;

  const go = (q) => {
    q = q.trim();
    if (!q) return;
    store.set('recent', [q, ...store.get('recent', []).filter((x) => x !== q)].slice(0, 6));
    panel.hidden = true;
    input.blur();
    location.hash = '#/search?q=' + encodeURIComponent(q);
  };

  const show = () => {
    const q = input.value;
    active = -1;
    if (!q.trim()) {
      const recent = store.get('recent', []);
      panel.innerHTML = `
        ${recent.length ? `<div class="sg-title">Recent <button class="link-btn" id="clear-recent">Clear</button></div>
          <div class="chips">${recent.map((k) => `<button class="chip" data-q="${esc(k)}">${esc(k)}</button>`).join('')}</div>` : ''}
        <div class="sg-title">Trending in the UK</div>
        <ol class="trending">${HOT_KEYWORDS.map((k, i) => `<li><button data-q="${esc(k)}"><span>${i + 1}</span>${esc(k)}</button></li>`).join('')}</ol>`;
    } else {
      const s = suggest(q);
      const hl = (t) => esc(t).replace(new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), (m) => `<b>${m}</b>`);
      panel.innerHTML = s.length
        ? `<ul class="sg-list">${s.map((t) => `<li><button data-q="${esc(t)}">🔍 ${hl(t)}</button></li>`).join('')}</ul>`
        : `<div class="sg-title">Press Enter to search “${esc(q)}”</div>`;
    }
    panel.hidden = false;
    $$('[data-q]', panel).forEach((b) => b.addEventListener('mousedown', (e) => { e.preventDefault(); go(b.dataset.q); }));
    const clr = $('#clear-recent', panel);
    if (clr) clr.addEventListener('mousedown', (e) => { e.preventDefault(); store.set('recent', []); show(); });
  };

  input.addEventListener('focus', show);
  input.addEventListener('input', show);
  input.addEventListener('blur', () => setTimeout(() => (panel.hidden = true), 120));
  input.addEventListener('keydown', (e) => {
    const items = $$('.sg-list button', panel);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((b, i) => b.classList.toggle('active', i === active));
    } else if (e.key === 'Enter') {
      go(active >= 0 && items[active] ? items[active].dataset.q : input.value);
    } else if (e.key === 'Escape') {
      panel.hidden = true; input.blur();
    }
  });
}

// ---------- Router ----------
function route() {
  const el = $('#view');
  const [path, query] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(query || '');
  const parts = (path || '/').split('/').filter(Boolean);

  $$('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === (parts[0] || 'home')));
  if (parts[0] !== 'search') $('#q').value = '';
  else $('#q').value = params.get('q') || '';

  if (!parts.length) renderHome(el);
  else if (parts[0] === 'search') renderSearch(el, params);
  else if (parts[0] === 'product') renderProduct(el, parts[1]);
  else if (parts[0] === 'compare') renderCompare(el, params);
  else renderHome(el);

  renderTray();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
initSearch();
updateBasket();
route();
