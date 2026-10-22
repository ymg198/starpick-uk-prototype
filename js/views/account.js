// Account centre (shown after sign-in): profile, orders, quick settings
import { productArt, money, esc, getProduct, $, $$, toast } from '../utils.js';
import { currentUser, signOut, initials } from '../auth.js';
import { addToBasket } from '../app.js';

const STATUS = { Delivered: 'green', 'In transit': 'blue', Processing: 'orange' };
const fmt = (iso) => new Date(iso + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function renderAccount(el) {
  const u = currentUser();
  if (!u) {
    el.innerHTML = `<div class="empty card account-empty"><h3>Sign in to see your account</h3>
      <p class="muted">Track orders, get picks based on what you buy, and check out faster.</p>
      <button class="pill pill-blue" id="acc-signin">Sign in</button></div>`;
    $('#acc-signin', el).onclick = () => document.dispatchEvent(new CustomEvent('open-signin'));
    return;
  }
  const spent=u.orders.reduce((s,o)=>s+(o.total??o.items.reduce((t,id)=>t+(getProduct(id)?.price||0),0)),0);

  el.innerHTML = `
  <header class="page-head"><p class="eyebrow">Account</p><h1>Hi, ${esc(u.name.split(' ')[0])}</h1></header>

  <section class="profile card">
    <div class="avatar-lg">${initials(u.name)}</div>
    <div class="profile-text">
      <h2>${esc(u.name)}</h2>
      <p class="muted">${esc(u.email)} · ${esc(u.city)}</p>
      <p class="muted">Member since ${esc(u.memberSince)}</p>
    </div>
    <span class="tier">${esc(u.tier)}</span>
  </section>

  <section class="stats">
    <div class="stat card"><span class="stat-num">${u.orders.length}</span><span class="muted">Orders</span></div>
    <div class="stat card"><span class="stat-num">${money(spent)}</span><span class="muted">Spent this year</span></div>
    <div class="stat card"><span class="stat-num">${u.points.toLocaleString('en-GB')}</span><span class="muted">StarPoints</span></div>
    <div class="stat card"><span class="stat-num">${u.vouchers}</span><span class="muted">Vouchers</span></div>
  </section>

  <section class="shelf">
    <div class="shelf-head"><div><h2>Your orders</h2><p class="muted">Your past orders power “Guess You Like” on the home page.</p></div></div>
    <div class="orders">
      ${u.orders.map((o) => `
        <article class="order card">
          <div class="order-head">
            <div><strong>Order ${o.id}</strong><span class="muted"> · ${fmt(o.date)}</span></div>
            <div>${o.lines?`<a class="link-btn" href="#/tracking/${o.id}">Track journey →</a>`:''} <span class="status status-${STATUS[o.status] || 'blue'}">${o.status}</span></div>
          </div>
          ${o.items.map(getProduct).filter(Boolean).map((p) => `
            <div class="order-item">
              <a href="#/product/${p.id}" class="order-prod">${productArt(p, 'mini')}<span>${esc(p.name)}<br><span class="muted">${money(p.price)}</span></span></a>
              <div class="order-actions">
                <button class="pill pill-grey small" data-again="${p.id}">Buy again</button>
                ${o.status === 'Delivered' ? `<button class="pill pill-grey small" data-review="${p.id}">Write a review</button>` : `<a class="pill pill-grey small" href="#/tracking/${o.id}">Track</a>`}
              </div>
            </div>`).join('')}
        </article>`).join('')}
    </div>
  </section>

  <section class="settings">
    <div class="group card">
      <div class="row"><span>Addresses</span><span class="muted">${esc(u.addresses[0])}</span></div>
      <div class="row"><span>Payment methods</span><span class="muted">${u.payment.map(esc).join(' · ')}</span></div>
      <div class="row"><span>Notifications</span><span class="muted">Order updates, price drops</span></div>
    </div>
    <div class="group card">
      <div class="row"><span>Help & returns</span><span class="muted">Free UK returns on UK-warehouse items</span></div>
      <button class="row danger" id="signout">Sign out</button>
    </div>
  </section>`;

  $$('[data-again]', el).forEach((b) => (b.onclick = () => addToBasket(b.dataset.again)));
  $$('[data-review]', el).forEach((b) => (b.onclick = () => toast('Thanks! Review form coming soon')));
  $$('[data-track]', el).forEach((b) => (b.onclick = () => toast('Your order is being packed')));
  $('#signout', el).onclick = () => {
    signOut();
    document.dispatchEvent(new CustomEvent('auth-changed'));
    toast('Signed out');
    location.hash = '#/';
  };
}
