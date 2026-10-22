import {addItem,getCart} from './commerce.js';
import {comparable} from './domain.js';
import {initFamily} from './family.js';
import {renderCart,renderCheckout,renderOrders,renderTracking} from './views/shopping.js';
// App shell: hash router, header search with autocomplete, PK tray, basket counter.
import { HOT_KEYWORDS } from '../data/products.js';
import { suggest } from './search.js';
import { $, $$, esc, store, toast, getProduct, productArt } from './utils.js';
import { renderHome } from './views/home.js';
import { renderSearch } from './views/search.js';
import { renderProduct } from './views/product.js';
import { renderCompare } from './views/compare.js';
import { renderAccount } from './views/account.js';
import { currentUser, signIn, initials } from './auth.js';
import { icon } from './utils.js';

// ---------- Shared state ----------
export function setPK(ids) { store.set('pk', ids); renderTray(); }
export function addToPK(id) {
  const ids = store.get('pk', []);
  if (ids.length && !comparable(getProduct(ids[0]),getProduct(id))) return toast('Choose products of the same type to compare');
  if (ids.includes(id)) return toast('Already in your PK list');
  if (ids.length >= 3) return toast('PK holds up to 3 items — remove one first');
  setPK([...ids, id]);
  toast(ids.length ? 'Added — open PK to compare' : 'Added to PK. Add another to compare');
}
export function addToBasket(id,options={}) {
  const p=getProduct(id);if(!p)return false;
  try{addItem(p,options);updateBasket();toast('Added to your basket');return true;}catch(e){toast(e.message);if(p.sizes&&!options.size)location.hash='#/product/'+id;return false;}
}
function updateBasket() {
  const n=getCart().reduce((sum,l)=>sum+l.quantity,0);
  $('#basket-count').textContent=n;$('#basket-count').hidden=!n;
}
document.addEventListener('cart-changed',updateBasket);

// ---------- PK tray (floating bar at the bottom) ----------
function renderTray() {
  const ids = store.get('pk', []);
  const tray = $('#pk-tray');
  const onCompare = ['compare','cart','checkout','orders','tracking','account'].some(path=>location.hash.startsWith('#/'+path));
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

// ---------- Account: avatar + sign-in sheet ----------
function renderAvatar() {
  const u = currentUser();
  const btn = $('#avatar');
  btn.innerHTML = u ? `<span class="avatar-initials">${initials(u.name)}</span>` : icon('user');
  btn.classList.toggle('signed-in', !!u);
  btn.setAttribute('aria-label', u ? `Account: ${u.name}` : 'Sign in');
}

function openSignIn() {
  const sheet = $('#signin');
  sheet.innerHTML = `
    <button class="sheet-close" id="si-close" aria-label="Close">×</button>
    <div class="si-logo">${icon('user')}</div>
    <h2 id="signin-title">Sign in to StarPick</h2>
    <p class="muted">Track orders and get picks based on what you buy.</p>
    <button class="si-btn si-apple" data-method="apple"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.8zM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>Continue with Apple</button>
    <button class="si-btn si-google" data-method="google"><span class="g-mark">G</span>Continue with Google</button>
    <div class="si-or"><span>or use email</span></div>
    <form id="si-form">
      <label class="sr-only" for="si-email">Demo account email</label><input type="email" id="si-email" placeholder="Email" value="emma.wilson@example.co.uk" required>
      <label class="sr-only" for="si-pass">Demo password</label><input type="password" id="si-pass" placeholder="Password" value="demo1234" required>
      <button class="pill pill-blue si-submit" type="submit">Sign in</button>
    </form>
    <p class="si-foot muted">New here? <button class="link-btn" data-method="register">Create an account</button></p>
    <p class="si-note muted">Prototype: every option signs in to the demo account.</p>`;
  sheet.hidden = false;
  $('#signin-backdrop').hidden = false;
  requestAnimationFrame(() => sheet.classList.add('show'));
  const done = (method) => {
    const u = signIn(method, $('#si-email').value);
    closeSignIn();
    renderAvatar();
    toast(`Welcome back, ${u.name.split(' ')[0]}`);
    route();
  };
  $$('[data-method]', sheet).forEach((b) => (b.onclick = () => done(b.dataset.method)));
  $('#si-form').onsubmit = (e) => { e.preventDefault(); done('email'); };
  $('#si-close').onclick = closeSignIn;
}
function closeSignIn() {
  $('#signin').classList.remove('show');
  $('#signin').hidden = true;
  $('#signin-backdrop').hidden = true;
}
function initAccount() {
  renderAvatar();
  $('#avatar').onclick = () => (currentUser() ? (location.hash = '#/account') : openSignIn());
  $('#signin-backdrop').onclick = closeSignIn;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSignIn(); });
  document.addEventListener('open-signin', openSignIn);
  document.addEventListener('auth-changed', renderAvatar);
}

// ---------- Router ----------
function route() {
  const el = $('#view');
  const [path, query] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(query || '');
  const parts = (path || '/').split('/').filter(Boolean);

  $$('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === (parts[0] || 'home')));
  $('#avatar').classList.toggle('on', parts[0] === 'account');
  if (parts[0] !== 'search') $('#q').value = '';
  else $('#q').value = params.get('q') || '';

  if (!parts.length) renderHome(el);
  else if (parts[0] === 'search') renderSearch(el, params);
  else if (parts[0] === 'product') renderProduct(el, parts[1]);
  else if (parts[0] === 'compare') renderCompare(el, params);
  else if (parts[0] === 'cart') renderCart(el);
  else if (parts[0] === 'checkout') renderCheckout(el);
  else if (parts[0] === 'orders') renderOrders(el);
  else if (parts[0] === 'tracking') renderTracking(el,parts[1],params);
  else if (parts[0] === 'account') renderAccount(el);
  else renderHome(el);

  renderTray();
  window.scrollTo(0, 0);
}

document.addEventListener('family-changed',route);
window.addEventListener('hashchange', route);
initFamily();
initSearch();
initAccount();
updateBasket();
route();
