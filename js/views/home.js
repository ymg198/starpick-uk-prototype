// Home = recommendation page (like the App Store "Today" + "Discover" tabs)
import { PRODUCTS, CATEGORIES } from '../../data/products.js';
import { productCard, productArt, money, esc, store, getProduct, categoryIcon, pctOff } from '../utils.js';

function shelf(title, sub, items, opts = {}) {
  if (!items.length) return '';
  return `<section class="shelf">
    <div class="shelf-head"><div><h2>${title}</h2>${sub ? `<p class="muted">${sub}</p>` : ''}</div>
    ${opts.link ? `<a class="see-all" href="${opts.link}">See all</a>` : ''}</div>
    <div class="shelf-row">${items.map((x) => productCard(x.p || x, { reason: x.reason })).join('')}</div>
  </section>`;
}

// Simple recommendation logic — swap for something smarter later
function recommended() {
  const viewed = store.get('viewed', []).map(getProduct).filter(Boolean);
  if (!viewed.length) {
    return PRODUCTS.filter((p) => p.rating >= 4.6).sort((a, b) => b.sold - a.sold).slice(0, 10)
      .map((p) => ({ p, reason: p.warehouse === 'UK' ? 'Popular in the UK' : 'Top rated' }));
  }
  const cats = [...new Set(viewed.map((p) => p.category))];
  const seen = new Set(viewed.map((p) => p.id));
  return PRODUCTS.filter((p) => cats.includes(p.category) && !seen.has(p.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((p) => ({ p, reason: `Because you viewed ${viewed.find((v) => v.category === p.category).name.split(' ').slice(0, 2).join(' ')}` }));
}

const COLLECTIONS = [
  { title: 'Get the guest room ready', sub: 'Everything for visitors this Christmas', ids: ['b1', 'b3', 'l1', 'h1', 's1', 'e1'], colors: ['#1d1d1f', '#3a3a5c'] },
  { title: 'Moving in? Start here', sub: 'Student & first-flat essentials under £20', ids: ['e1', 'k1', 's3', 'h2', 'k4', 'l3'], colors: ['#0b5cad', '#4aa3ff'] },
];

export function renderHome(el) {
  const featured = PRODUCTS.filter((p) => p.featured);
  const hero = getProduct('l1');
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  el.innerHTML = `
  <header class="page-head">
    <p class="eyebrow">${today}</p>
    <h1>Today</h1>
  </header>

  <a class="hero card" href="#/product/${hero.id}">
    <div class="hero-text">
      <p class="eyebrow light">EDITOR'S PICK</p>
      <h2>The bedside lamp 9,000 Brits chose</h2>
      <p>UK plug, UKCA certified, arrives in 2–4 days. ${pctOff(hero)}% off this week.</p>
      <span class="pill pill-light">${money(hero.price)} · View</span>
    </div>
    ${productArt(hero, 'hero-art')}
  </a>

  <section class="cat-row">
    ${CATEGORIES.map((c) => `<a class="cat-chip" href="#/search?cat=${c.id}" style="--c1:${c.colors[0]};--c2:${c.colors[1]}"><span class="cat-icon">${categoryIcon(c)}</span>${c.name}</a>`).join('')}
  </section>

  ${shelf('Recommended for you', store.get('viewed', []).length ? 'Based on what you viewed' : 'Top rated by UK shoppers', recommended())}

  <section class="collections">
    ${COLLECTIONS.map((c) => `
      <a class="collection card" href="#/search?ids=${c.ids.join(',')}&title=${encodeURIComponent(c.title)}" style="background:linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})">
        <p class="eyebrow light">COLLECTION</p>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.sub)}</p>
        <div class="collection-icons">${c.ids.slice(0, 4).map((id) => productArt(getProduct(id), 'mini')).join('')}</div>
      </a>`).join('')}
  </section>

  ${shelf('Arrives in 2–4 days', 'From our UK warehouse', PRODUCTS.filter((p) => p.warehouse === 'UK').sort((a, b) => b.sold - a.sold), { link: '#/search?uk=1' })}
  ${shelf('Under £10', 'Small things that make a home', PRODUCTS.filter((p) => p.price < 10), { link: '#/search?max=10' })}
  ${shelf('Editor’s choice', 'Hand-picked by our team', featured)}
  `;
}
