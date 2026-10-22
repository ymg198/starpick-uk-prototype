// Search results / category / collection page
import { PRODUCTS, CATEGORIES, HOT_KEYWORDS } from '../../data/products.js';
import { search } from '../search.js';
import { productCard, esc, getProduct, getCategory } from '../utils.js';

const SORTS = { relevance: 'Best match', sales: 'Best selling', priceAsc: 'Price: low to high', priceDesc: 'Price: high to low', rating: 'Top rated' };

export function renderSearch(el, params) {
  const q = params.get('q') || '';
  const cat = params.get('cat') || '';
  const uk = params.get('uk') === '1';
  const max = parseFloat(params.get('max')) || null;
  const ids = params.get('ids');
  const brand = params.get('brand') === '1';
  const sort = params.get('sort') || 'relevance';

  let items, corrected = null, title;
  if (ids) {
    items = ids.split(',').map(getProduct).filter(Boolean);
    title = params.get('title') || 'Collection';
  } else if (q) {
    const r = search(q);
    items = r.results.map((x) => x.product);
    corrected = r.corrected;
    title = `Results for “${esc(q)}”`;
  } else {
    items = [...PRODUCTS];
    title = cat ? getCategory(cat).name : brand ? 'Big Brands' : uk ? 'Arrives in 2–4 days' : max ? `Under £${max}` : 'All products';
  }
  if (cat) items = items.filter((p) => p.category === cat);
  if (uk) items = items.filter((p) => p.warehouse === 'UK');
  if (brand) items = items.filter((p) => p.official);
  if (max) items = items.filter((p) => p.price <= max);
  const sorters = {
    sales: (a, b) => b.sold - a.sold,
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  if (sorters[sort]) items = [...items].sort(sorters[sort]);

  // Every search shows at least 10 products: top up with related items from the same categories
  let related = [];
  if (q && items.length < 10) {
    const cats = new Set(items.map((p) => p.category));
    const pool = PRODUCTS.filter((p) => !items.includes(p) && (cats.size ? cats.has(p.category) : true)).sort((a, b) => b.weekSold - a.weekSold);
    related = pool.slice(0, Math.max(10 - items.length, cats.size ? 6 : 12));
  }

  const link = (patch) => {
    const p = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === null || v === '' ? p.delete(k) : p.set(k, v)));
    return '#/search?' + p.toString();
  };

  el.innerHTML = `
  <header class="page-head">
    <p class="eyebrow">${ids ? 'COLLECTION' : q ? 'SEARCH' : 'BROWSE'}</p>
    <h1>${title}</h1>
    ${corrected ? `<p class="muted">Showing results for <a href="#/search?q=${encodeURIComponent(corrected)}">${esc(corrected)}</a></p>` : ''}
  </header>

  <div class="filters">
    <div class="seg">
      <a class="${!cat ? 'on' : ''}" href="${link({ cat: null })}">All</a>
      ${CATEGORIES.map((c) => `<a class="${cat === c.id ? 'on' : ''}" href="${link({ cat: c.id })}">${c.name}</a>`).join('')}
    </div>
    <div class="filter-right">
      <a class="toggle ${brand ? 'on' : ''}" href="${link({ brand: brand ? null : '1' })}"><span class="dot"></span>Big brands</a>
      <a class="toggle ${uk ? 'on' : ''}" href="${link({ uk: uk ? null : '1' })}"><span class="dot"></span>UK warehouse only</a>
      <select id="sort" aria-label="Sort">
        ${Object.entries(SORTS).map(([k, v]) => `<option value="${k}" ${k === sort ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    </div>
  </div>

  <p class="muted count">${items.length} result${items.length === 1 ? '' : 's'}${related.length ? ` · plus ${related.length} related` : ''}</p>
  ${items.length ? `<div class="grid">${items.map((p) => productCard(p)).join('')}</div>` : `
    <div class="empty card">
      <h3>No exact matches for “${esc(q)}”</h3>
      <p class="muted">Try one of these popular searches, or browse what’s trending below.</p>
      <div class="chips">${HOT_KEYWORDS.map((k) => `<a class="chip" href="#/search?q=${encodeURIComponent(k)}">${k}</a>`).join('')}</div>
    </div>`}
  ${related.length ? `<div class="related-head"><h2>${items.length ? 'More you might like' : 'Trending now'}</h2></div><div class="grid">${related.map((p) => productCard(p)).join('')}</div>` : ''}
  `;

  el.querySelector('#sort').addEventListener('change', (e) => { location.hash = link({ sort: e.target.value }); });
}
