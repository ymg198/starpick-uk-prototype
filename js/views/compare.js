// PK (head-to-head comparison) page — up to 3 products, winners highlighted per row
import { PRODUCTS } from '../../data/products.js';
import { $, $$, esc, money, pctOff, fmtCount, productArt, getProduct, dimsText, store } from '../utils.js';
import { setPK } from '../app.js';

// Each row: label, how to show the value, and how to score it (higher = better; null = no winner)
const ROWS = [
  { group: 'Price', label: 'Price', show: (p) => money(p.price), score: (p) => -p.price },
  { label: 'Discount', show: (p) => `−${pctOff(p)}%`, score: (p) => pctOff(p) },
  { group: 'Trust', label: 'Rating', show: (p) => `${p.rating} ★`, score: (p) => p.rating },
  { label: 'Ratings', show: (p) => fmtCount(p.reviews), score: (p) => p.reviews },
  { label: 'Size as described', show: (p) => p.aspects.size + '%', score: (p) => p.aspects.size },
  { label: 'Looks like the photos', show: (p) => p.aspects.photo + '%', score: (p) => p.aspects.photo },
  { label: 'Good quality', show: (p) => p.aspects.quality + '%', score: (p) => p.aspects.quality },
  { group: 'Delivery & returns', label: 'Delivery', show: (p) => (p.warehouse === 'UK' ? '2–4 days · UK' : '7–14 days · China'), score: (p) => (p.warehouse === 'UK' ? 1 : 0) },
  { label: 'Returns', show: (p) => (p.returns.free ? `Free · ${p.returns.days} days` : `Paid · ${p.returns.days} days`), score: (p) => (p.returns.free ? 100 : 0) + p.returns.days },
  { group: 'Specs', label: 'Plug', show: (p) => ({ UK: 'UK 3-pin ✓', EU: 'EU 2-pin — adapter needed', USB: 'USB', None: '—' }[p.plug]), score: (p) => ({ UK: 2, USB: 2, EU: 0, None: null }[p.plug]) },
  { label: 'Safety marks', show: (p) => p.safety.join(', ') || '—', score: (p) => (p.plug === 'None' ? null : p.safety.includes('UKCA') ? 1 : 0) },
  { label: 'Dimensions', show: (p) => dimsText(p.dims), score: () => null },
  { label: 'Material', show: (p) => esc(p.material), score: () => null },
  { label: 'Weight', show: (p) => p.weight, score: () => null },
];

function verdicts(items) {
  const best = (fn) => items.reduce((a, b) => (fn(b) > fn(a) ? b : a));
  const surprises = (p) => -((p.plug === 'EU') + !p.returns.free + (p.sizeNote ? 1 : 0) + (p.warehouse === 'CN' ? 0.5 : 0));
  return [
    ['Best price', best((p) => -p.price)],
    ['Best rated', best((p) => p.rating + p.aspects.photo / 1000)],
    ['Fastest delivery', best((p) => (p.warehouse === 'UK' ? 1 : 0) + p.rating / 100)],
    ['Fewest surprises', best((p) => surprises(p) + p.aspects.size / 1000)],
  ];
}

export function renderCompare(el, params) {
  let ids = (params.get('ids') || store.get('pk', []).join(',')).split(',').filter((id) => getProduct(id)).slice(0, 3);
  setPK(ids);
  const items = ids.map(getProduct);

  if (!items.length) {
    el.innerHTML = `<header class="page-head"><p class="eyebrow">PK</p><h1>Compare</h1></header>
      <div class="empty card"><h3>Nothing to compare yet</h3><p class="muted">Tap “+ PK compare” on any product, or try one of these:</p>
      <div class="chips"><a class="chip" href="#/compare?ids=k1,k2">Kettle PK</a><a class="chip" href="#/compare?ids=l1,l2,l4">Lamp PK</a><a class="chip" href="#/compare?ids=s1,s2">Under-bed storage PK</a></div></div>`;
    return;
  }

  const cat = items[0].category;
  const candidates = PRODUCTS.filter((p) => !ids.includes(p.id)).sort((a, b) => (b.category === cat) - (a.category === cat));
  const cols = items.length + (items.length < 3 ? 1 : 0);

  el.innerHTML = `
  <header class="page-head"><p class="eyebrow">PK</p><h1>Head to head</h1>
    <p class="muted">Green marks the winner in each row.</p></header>

  ${items.length > 1 ? `<div class="verdicts">${verdicts(items).map(([label, p]) => `
    <a class="verdict card" href="#/product/${p.id}">${productArt(p, 'mini')}<div><span class="eyebrow">${label}</span><strong>${esc(p.name)}</strong></div></a>`).join('')}</div>` : ''}

  <div class="pk-table card" style="--cols:${cols}">
    <div class="pk-row pk-head">
      <div class="pk-label"></div>
      ${items.map((p) => `<div class="pk-cell">
        <button class="remove" data-id="${p.id}" aria-label="Remove">×</button>
        <a href="#/product/${p.id}">${productArt(p, 'pk-art')}<strong>${esc(p.name)}</strong></a>
        <span class="muted">${esc(p.seller)}</span>
      </div>`).join('')}
      ${items.length < 3 ? `<div class="pk-cell add-slot">
        <label>Add a product<select id="add-select"><option value="">Choose…</option>
          ${candidates.map((p) => `<option value="${p.id}">${esc(p.name)} — ${money(p.price)}</option>`).join('')}
        </select></label></div>` : ''}
    </div>
    ${ROWS.map((r) => {
      const scores = items.map((p) => r.score(p));
      const valid = scores.filter((s) => s !== null && s !== undefined);
      const top = items.length > 1 && valid.length > 1 && new Set(valid).size > 1 ? Math.max(...valid) : null;
      return `${r.group ? `<div class="pk-group">${r.group}</div>` : ''}<div class="pk-row">
        <div class="pk-label">${r.label}</div>
        ${items.map((p, i) => `<div class="pk-cell ${top !== null && scores[i] === top ? 'win' : ''} ${scores[i] === 0 && r.label === 'Plug' ? 'lose' : ''}">${r.show(p)}</div>`).join('')}
        ${items.length < 3 ? '<div class="pk-cell"></div>' : ''}
      </div>`;
    }).join('')}
  </div>`;

  $$('.remove', el).forEach((b) => (b.onclick = () => {
    const next = ids.filter((x) => x !== b.dataset.id);
    setPK(next);
    location.hash = '#/compare?ids=' + next.join(',');
  }));
  const sel = $('#add-select', el);
  if (sel) sel.onchange = () => { if (sel.value) location.hash = '#/compare?ids=' + [...ids, sel.value].join(','); };
}
