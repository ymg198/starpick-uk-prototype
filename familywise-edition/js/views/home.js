import {store} from '../utils.js';
import {familyScore} from '../domain.js';
import {openFamily,showDialog} from '../family.js';
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

export function guessYouLike(user = currentUser()) {
  const bought = purchasedIds(user).map(getProduct).filter(Boolean);
  if (bought.length) {
    const boughtIds = new Set(bought.map((p) => p.id));
    return PRODUCTS.filter((p) => !boughtIds.has(p.id)).map((p) => {
      let best = null, bestScore = 0, total = 0;
      for (const q of bought) {
        let s = 0;
        if (p.sub && p.sub === q.sub) s += 4;
        else if (p.category === q.category) s += 2;
        else if ((RELATED[q.category] || []).includes(p.category)) s += 1;
        s += p.tags.filter((t) => q.tags.includes(t)).length * 1.5;
        total += s;
        if (s > bestScore) { bestScore = s; best = q; }
      }
      return { p, score: total + p.rating / 2, reason: best ? `You bought ${shortName(best)}` : null };
    }).filter((x) => x.reason).sort((a, b) => b.score - a.score).slice(0, 10);
  }
  // New customer: alternate high-value top-rated picks with big-brand picks
  const score = (p) => p.rating * 2 + pctOff(p) / 25 + Math.log10(p.reviews) / 2;
  const pool = PRODUCTS.filter((p) => p.rating >= 4.5).sort((a, b) => score(b) - score(a));
  const value = pool.filter((p) => !p.official).map((p) => ({ p, reason: pctOff(p) >= 40 ? 'Great value' : 'Top rated' }));
  const brands = pool.filter((p) => p.official).map((p) => ({ p, reason: 'Big brand' }));
  const mixed = [];
  while (mixed.length < 10 && (value.length || brands.length)) {
    if (value.length) mixed.push(value.shift());
    if (brands.length && mixed.length < 10) mixed.push(brands.shift());
  }
  return mixed;
}

const COLLECTIONS = [
  { title: 'Christmas gifts they’ll love', sub: 'Chocolates, headphones, serums and more', ids: ['d2', 'e4', 'y1', 'f5', 'd1', 'p3'], colors: ['#7a1020', '#c8323f'] },
  { title: 'Winter wardrobe', sub: 'Warm layers from £12.99', ids: ['f2', 'f3', 'f6', 'f1'], colors: ['#1d1d1f', '#3a3a5c'] },
  { title: 'Pantry favourites', sub: 'Coffee, snacks and treats, delivered in 2–4 days', ids: ['d1', 'd5', 'd4', 'd3'], colors: ['#8a4b12', '#e08a2e'] },
];

// ---------- Family picks: one air fryer for the cost comparison, then one pick per other category ----------
export function familyPicks(profile) {
  const rank = (p) => familyScore(p, profile).score + Math.log10(p.reviews) * 2;
  const fryer = PRODUCTS.filter((p) => p.familywiseImage).sort((a, b) => rank(b) - rank(a))[0];
  const perCat = CATEGORIES.filter((c) => c.id !== fryer.category).map((c) =>
    PRODUCTS.filter((p) => p.category === c.id && !p.variant).sort((a, b) => rank(b) - rank(a))[0]);
  return [fryer, ...perCat.sort((a, b) => rank(b) - rank(a)).slice(0, 5)];
}

// ---------- Shop by moment: scenario shelves, defaulting to the one that fits right now ----------
export const MOMENTS = [
  { id: 'workout', title: 'Morning workout', sub: 'Kit for an early run or a home session', ids: ['f1', 'p1', 'e6', 'p3', 'f6', 'p2', 'e5', 'd4'] },
  { id: 'wfh', title: 'Work from home', sub: 'A calmer, better-lit desk day', ids: ['l2', 'e3', 'e4', 'd1', 'e1', 'k1', 's3', 'k4'] },
  { id: 'away', title: 'Weekend away', sub: 'Pack light, stay charged', ids: ['t1', 't4', 't3', 'e7', 'y2', 'e5', 'f2', 't2'] },
  { id: 'cosy', title: 'Cosy night in', sub: 'Warm layers, soft light and a treat', ids: ['f3', 'd2', 'l3', 'b1', 'e4', 'd3', 'l1', 'd5'] },
  { id: 'hosting', title: 'Friends round for dinner', sub: 'Cook, serve and make up the guest room', ids: ['fw-air-sage', 'k3', 'd1', 'd4', 'k4', 'h1', 'b2', 'l3'] },
  { id: 'gifting', title: 'Christmas gifting', sub: 'Presents across every budget', ids: ['d2', 'e4', 'y1', 'f5', 'd1', 'p3', 'e6', 'l3'] },
];
export function momentFor(date = new Date()) {
  const h = date.getHours(), day = date.getDay(), month = date.getMonth();
  if (month >= 10) return { id: 'gifting', why: 'Christmas is coming' };
  if (day === 5 && h >= 15 || day === 6 && h < 12) return { id: 'away', why: 'It’s nearly the weekend' };
  if (h >= 5 && h < 10) return { id: 'workout', why: 'Good morning' };
  if (day >= 1 && day <= 5 && h >= 10 && h < 17) return { id: 'wfh', why: 'Weekday, working hours' };
  if (h >= 17 && (day === 5 || day === 6)) return { id: 'hosting', why: 'Weekend evening' };
  return { id: 'cosy', why: 'Evening at home' };
}

export function renderHome(el) {
  const user = currentUser();
  const picks = todaysPicks();
  const guess = guessYouLike(user);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const isReturning = purchasedIds(user).length > 0;

  const profile=store.get('family',null);
  const family=familyPicks(profile);
  const now=momentFor();
  el.innerHTML = `
  <section class="fw-hero"><div class="hero-copy"><p class="eyebrow">A little wiser. A little more you.</p><h1>Make every<br>purchase <em>count.</em></h1><p>Good things for your home.<br>Thoughtful choices for your family.</p><div class="button-row"><a class="pill pill-blue" href="#/search">Find your everyday favourites <span>↗</span></a><button class="hero-how link-btn" id="hero-how">How it works</button></div><div class="hero-trust"><span>◎ Consider the whole cost</span><span>⌂ Choose a closer warehouse</span></div></div><div class="hero-photo"><img src="assets/home-living.jpg" alt="A calm, sunlit living room with natural colours"><div class="hero-caption"><span class="caption-icon">✳</span><span>A home that feels like you.<small>Shop a little more thoughtfully.</small></span></div></div></section>
  <section class="family-intro"><div><p class="eyebrow">YOUR HOME, YOUR WAY</p><h2>Thoughtful picks for your family</h2></div><button class="pill pill-grey" id="home-family">${profile?profile.people+' people · Edit preferences':'Personalise your picks ↗'}</button></section>
  <div class="family-grid">${family.map(p=>productCard(p,{reason:profile?familyScore(p,profile).reasons[0]:p.familywiseImage?'Ownership cost available':getCategory(p.category).name})).join('')}</div>
  <div class="family-compare-link"><a class="link-btn" href="#/compare?ids=fw-air-sage,fw-air-cream,fw-air-dark">Compare all three air fryers, beyond the price tag →</a></div>
  <section class="moments" id="moments">
    <div class="shelf-head"><div><p class="eyebrow" id="moment-why">Suggested now · ${now.why}</p><h2>Shop by moment</h2></div></div>
    <div class="seg moment-tabs" role="tablist">${MOMENTS.map(m=>`<button role="tab" data-m="${m.id}" class="${m.id===now.id?'on':''}" aria-selected="${m.id===now.id}">${m.title}</button>`).join('')}</div>
    <p class="muted moment-sub" id="moment-sub"></p>
    <div class="shelf-row" id="moment-row"></div>
  </section>
  <div class="section-kicker"><h2>Find your everyday</h2><a class="link-btn" href="#/search">All 413 products ↗</a></div>
  <section class="cat-grid">
    ${CATEGORIES.map(c=>`<a class="cat-tile card" href="#/search?cat=${c.id}"><span class="cat-icon" style="background:linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})">${categoryIcon(c)}</span><span>${c.name}</span></a>`).join('')}
  </section>

  <header class="page-head picks-head">
    <div>
      <p class="eyebrow">${today}</p>
      <h2>Today’s Picks</h2>

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

  ${shelf('Guess You Like',
    isReturning ? 'Based on what you’ve bought before' : 'Great value, top rated and big brands — hand-picked for new customers',
    guess,
    { extra: user ? '' : '<button class="link-btn" id="signin-hint">Sign in for picks based on your orders</button>' })}

  <details class="discover-more"><summary>More to discover <span>Brands, seasonal collections & little finds ↗</span></summary>
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

  ${shelf('A little closer to home', 'UK warehouse available', PRODUCTS.filter((p) => p.warehouse === 'UK').sort((a, b) => b.weekSold - a.weekSold).slice(0, 12), { link: '#/search?uk=1' })}
  ${shelf('Under £10', 'Little things, big difference', PRODUCTS.filter((p) => p.price < 10).sort((a, b) => b.weekSold - a.weekSold).slice(0, 12), { link: '#/search?max=10' })}
  </details>`;

  $('#home-family',el).onclick=openFamily;
  const showMoment=(id)=>{const m=MOMENTS.find(x=>x.id===id);
    $$('.moment-tabs button',el).forEach(b=>{b.classList.toggle('on',b.dataset.m===id);b.setAttribute('aria-selected',b.dataset.m===id);});
    $('#moment-why',el).textContent=id===now.id?`Suggested now · ${now.why}`:'Scenario';
    $('#moment-sub',el).textContent=m.sub;
    $('#moment-row',el).innerHTML=m.ids.map(getProduct).filter(Boolean).map(p=>productCard(p,{reason:m.title})).join('');};
  $$('.moment-tabs button',el).forEach(b=>b.onclick=()=>showMoment(b.dataset.m));
  showMoment(now.id);
  $('#hero-how',el).onclick=()=>showDialog('A thoughtful choice, in three steps','<ol class="how-steps"><li><strong>Find your fit.</strong><p>Browse StarPick’s catalogue or add optional household preferences.</p></li><li><strong>Look beyond the price.</strong><p>Compare eligible appliances with an editable ownership-cost estimate.</p></li><li><strong>Choose the journey.</strong><p>Pick a warehouse, place a demo order and follow each parcel.</p></li></ol>');
  // ---- carousel behaviour: arrows, dots, swipe (scroll-snap), autoplay ----
  const track = $('#carousel', el);
  const dots = $$('#dots button', el);
  const go = (i) => track.scrollTo({ left: track.children[(i + picks.length) % picks.length].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  $('#prev', el).onclick = () => go(current() - 1);
  $('#next', el).onclick = () => go(current() + 1);
  dots.forEach((d) => (d.onclick = () => go(+d.dataset.i)));
  track.addEventListener('scroll', () => dots.forEach((d, i) => d.classList.toggle('on', i === current())), { passive: true });
  let paused = false;
  ['mouseenter', 'touchstart', 'focusin'].forEach((e) => track.addEventListener(e, () => (paused = true), { passive: true }));
  track.addEventListener('mouseleave', () => (paused = false));
  const timer = setInterval(() => {
    if (!document.body.contains(track)) return clearInterval(timer);
    if (!paused && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) go(current() + 1);
  }, 5000);

  const hint = $('#signin-hint', el);
  if (hint) hint.onclick = () => document.dispatchEvent(new CustomEvent('open-signin'));
}
