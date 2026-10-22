// Home = recommendation page: Today's Picks carousel, Guess You Like, brand & collection shelves
import { PRODUCTS, CATEGORIES } from '../../data/products.js';
import { productCard, productArt, money, esc, getProduct, getCategory, categoryIcon, pctOff, stars, fmtCount, $, $$ } from '../utils.js';
import { currentUser, purchasedIds } from '../auth.js';

function shelf(title, sub, items, opts = {}) {
  if (!items.length) return '';
  return `<section class="shelf">
    <div class="shelf-head"><div><h2>${title}</h2>${sub ? `<p class="muted">${sub}</p>` : ''}</div>
    ${opts.link ? `<a class="see-all" href="${opts.link}">See all</a>` : ''}${opts.extra || ''}</div>
    <div class="shelf-row">${items.map((x) => productCard(x.p || x, { reason: x.reason })).join('')}</div>
  </section>`;
}

// ---------- Today's Picks: weekly best sellers + highest rated (max 5 slides) ----------
export function todaysPicks() {
  const bestSellers = [...PRODUCTS].sort((a, b) => b.weekSold - a.weekSold).slice(0, 3)
    .map((p, i) => ({ p, label: `Best seller this week · No.${i + 1}`, stat: `${fmtCount(p.weekSold)} sold this week` }));
  const taken = new Set(bestSellers.map((x) => x.p.id));
  const topRated = [...PRODUCTS].filter((p) => !taken.has(p.id))
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 2)
    .map((p, i) => ({ p, label: `Highest rated · No.${i + 1}`, stat: `${p.rating} from ${fmtCount(p.reviews)} reviews` }));
  return [...bestSellers, ...topRated].slice(0, 5);
}

// ---------- Guess You Like ----------
// Related categories, used when someone bought in one area (e.g. trainers → sportswear)
const RELATED = { fashion: ['sports'], sports: ['fashion', 'electronics'], food: ['kitchen'], kitchen: ['food', 'home'], electronics: ['travel', 'sports'], travel: ['electronics'], beauty: ['fashion'], home: ['kitchen'] };
const shortName = (p) => p.name.replace(/^(Kestrun|Norhaven|Sonaro|Aurevia|Maison Ardel|Hearthly)\s/, '').split(' ').slice(0, 3).join(' ');

// One pick per slot, so the shelf mixes home, beauty, clothing, shoes, drinkware, food and more.
// Each product appears once: similar listings of the same base product (f1, f1v1, f1v2 …) count as one.
const GUESS_SLOTS = [
  { id: 'furniture', match: (p) => p.sub === 'Furniture' },
  { id: 'beauty', match: (p) => p.category === 'beauty' },
  { id: 'dresses', match: (p) => p.sub === 'Dresses' },
  { id: 'shoes', match: (p) => p.sub === 'Shoes' },
  { id: 'drinkware', match: (p) => p.tags.some((t) => /bottle|flask|mug|cup/.test(t)) },
  { id: 'food', match: (p) => p.category === 'food' },
  { id: 'electronics', match: (p) => p.category === 'electronics' },
  { id: 'home', match: (p) => p.category === 'home' && p.sub !== 'Furniture' },
  { id: 'kitchen', match: (p) => p.category === 'kitchen' },
  { id: 'clothing', match: (p) => p.category === 'fashion' && !['Shoes', 'Bags', 'Dresses'].includes(p.sub) },
  { id: 'sports', match: (p) => p.category === 'sports' && !p.tags.some((t) => /bottle|flask/.test(t)) },
  { id: 'travel', match: (p) => p.category === 'travel' },
];
const baseOf = (p) => p.base || p.id;

export function guessYouLike(user = currentUser(), limit = 10) {
  const bought = purchasedIds(user).map(getProduct).filter(Boolean);
  const boughtIds = new Set(bought.map((p) => p.id));
  const boughtBases = new Set(bought.map(baseOf)); // owned products, from any shop: used only if a slot has nothing else
  const value = (p) => p.rating * 2 + pctOff(p) / 25 + Math.log10(p.reviews) / 2;
  const scored = PRODUCTS.filter((p) => !boughtIds.has(p.id)).map((p) => {
    // Returning customer: similarity to what they bought (e.g. trainers → sportswear), plus overall value
    let best = null, bestScore = 0;
    for (const q of bought) {
      let s = 0;
      if (p.sub && p.sub === q.sub) s += 4;
      else if (p.category === q.category) s += 2;
      else if ((RELATED[q.category] || []).includes(p.category)) s += 1;
      s += p.tags.filter((t) => q.tags.includes(t)).length * 1.5;
      if (s > bestScore) { bestScore = s; best = q; }
    }
    const reason = boughtBases.has(baseOf(p)) ? `Like your ${shortName(best)}` : bestScore >= 4 ? `You bought ${shortName(best)}` : p.official ? 'Big brand' : pctOff(p) >= 40 ? 'Great value' : 'Top rated';
    return { p, score: value(p) + bestScore, reason };
  }).sort((a, b) => b.score - a.score);

  const picked = [], usedBase = new Set();
  const take = (slot, allowOwned) => {
    const fits = (x) => slot.match(x.p) && !usedBase.has(baseOf(x.p));
    const x = scored.find((x) => fits(x) && !boughtBases.has(baseOf(x.p))) || (allowOwned && scored.find(fits));
    if (x) { picked.push(x); usedBase.add(baseOf(x.p)); }
  };
  // First round: one per slot; then a second round (still one per product) if there is room
  for (const round of [1, 2]) for (const slot of GUESS_SLOTS) if (picked.length < limit) take(slot, round === 1);
  return picked;
}

const COLLECTIONS = [
  { title: 'Christmas gifts they’ll love', sub: 'Chocolates, headphones, serums and more', ids: ['d2', 'e4', 'y1', 'f5', 'd1', 'p3'], colors: ['#7a1020', '#c8323f'] },
  { title: 'Winter wardrobe', sub: 'Warm layers from £12.99', ids: ['f2', 'f3', 'f6', 'f1'], colors: ['#1d1d1f', '#3a3a5c'] },
  { title: 'Pantry favourites', sub: 'Coffee, snacks and treats, delivered in 2–4 days', ids: ['d1', 'd5', 'd4', 'd3'], colors: ['#8a4b12', '#e08a2e'] },
];

export function renderHome(el) {
  const user = currentUser();
  const picks = todaysPicks();
  const guess = guessYouLike(user);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const isReturning = purchasedIds(user).length > 0;

  el.innerHTML = `
  <header class="page-head picks-head">
    <div>
      <p class="eyebrow">${today}</p>
      <h1>Today’s Picks</h1>
      <p class="muted">This week’s best sellers and highest-rated products, across every category.</p>
    </div>
    <div class="carousel-nav">
      <button class="round-btn" id="prev" aria-label="Previous">‹</button>
      <button class="round-btn" id="next" aria-label="Next">›</button>
    </div>
  </header>

  <section class="carousel" id="carousel" aria-roledescription="carousel">
    ${picks.map(({ p, label, stat }, i) => {
      const c = getCategory(p.category);
      return `<a class="slide" href="#/product/${p.id}" aria-label="${i + 1} of ${picks.length}: ${esc(p.name)}"
        style="background:radial-gradient(120% 140% at 85% 30%, ${c.colors[1]} 0%, #111114 62%)">
        <div class="slide-text">
          <p class="eyebrow light">${label}</p>
          ${p.official ? `<p class="slide-brand">${esc(p.brand)} · Official store</p>` : `<p class="slide-brand">${c.name}</p>`}
          <h2>${esc(p.name)}</h2>
          <p class="slide-desc">${esc(p.desc)}</p>
          <p class="slide-stat">${stars(p.rating, 13)} <span>${stat}</span></p>
          <div class="slide-buy"><span class="pill pill-light">${money(p.price)} · View</span><s>${money(p.was)}</s></div>
        </div>
        ${productArt(p, 'slide-art')}
      </a>`;
    }).join('')}
  </section>
  <div class="dots" id="dots">${picks.map((_, i) => `<button class="${i === 0 ? 'on' : ''}" data-i="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('')}</div>

  <section class="cat-grid">
    ${CATEGORIES.map((c) => `<a class="cat-tile card" href="#/search?cat=${c.id}">
      <span class="cat-icon" style="background:linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})">${categoryIcon(c)}</span>
      <span>${c.name}</span></a>`).join('')}
  </section>

  ${shelf('Guess You Like',
    isReturning ? 'Based on what you’ve bought before' : 'Great value, top rated and big brands — hand-picked for new customers',
    guess,
    { extra: user ? '' : '<button class="link-btn" id="signin-hint">Sign in for picks based on your orders</button>' })}

  ${shelf('Big Brands', 'Official stores · genuine products · free UK returns', PRODUCTS.filter((p) => p.official).sort((a, b) => (a.variant - b.variant) || b.rating - a.rating).slice(0, 12), { link: '#/search?brand=1' })}

  <section class="collections">
    ${COLLECTIONS.map((c) => `
      <a class="collection card" href="#/search?ids=${c.ids.join(',')}&title=${encodeURIComponent(c.title)}" style="background:linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})">
        <p class="eyebrow light">Collection</p>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.sub)}</p>
        <div class="collection-icons">${c.ids.slice(0, 4).map((id) => productArt(getProduct(id), 'mini')).join('')}</div>
      </a>`).join('')}
  </section>

  ${shelf('Arrives in 2–4 days', 'From our UK warehouse', PRODUCTS.filter((p) => p.warehouse === 'UK').sort((a, b) => b.weekSold - a.weekSold).slice(0, 12), { link: '#/search?uk=1' })}
  ${shelf('Under £10', 'Little things, big difference', PRODUCTS.filter((p) => p.price < 10).sort((a, b) => b.weekSold - a.weekSold).slice(0, 12), { link: '#/search?max=10' })}
  `;

  // ---- carousel behaviour: arrows, dots, swipe (scroll-snap), autoplay ----
  const track = $('#carousel', el);
  const dots = $$('#dots button', el);
  const go = (i) => {
    const slide = track.children[(((i % picks.length) + picks.length) % picks.length)];
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const current = () => (track.clientWidth ? Math.round(track.scrollLeft / track.clientWidth) : 0); // 0 width when the tab is hidden
  $('#prev', el).onclick = () => go(current() - 1);
  $('#next', el).onclick = () => go(current() + 1);
  dots.forEach((d) => (d.onclick = () => go(+d.dataset.i)));
  track.addEventListener('scroll', () => dots.forEach((d, i) => d.classList.toggle('on', i === current())), { passive: true });
  let paused = false;
  ['mouseenter', 'touchstart', 'focusin'].forEach((e) => track.addEventListener(e, () => (paused = true), { passive: true }));
  track.addEventListener('mouseleave', () => (paused = false));
  const timer = setInterval(() => {
    if (!document.body.contains(track)) return clearInterval(timer);
    if (!paused && !document.hidden) go(current() + 1);
  }, 5000);

  const hint = $('#signin-hint', el);
  if (hint) hint.onclick = () => document.dispatchEvent(new CustomEvent('open-signin'));
}
