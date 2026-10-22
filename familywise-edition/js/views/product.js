import {mountCost} from '../cost.js';
import {openWarehouses,warehouseSummary} from '../warehouse.js';
import {warehouseFor,destination} from '../commerce.js';
import {shipping,energySpec} from '../domain.js';
// Product detail page: key facts (category-aware), delivery check, fit check, specs, reviews, PK entry points
import { PRODUCTS } from '../../data/products.js';
import { getReviews, starBreakdown } from '../reviews.js';
import {
  $, $$, esc, money, pctOff, stars, fmtCount, productArt, productCard, getProduct, getCategory, aspectLabels,
  deliveryWindow, deliveryText, fmtDate, dimsText, store, toast, openLightbox,
} from '../utils.js';
import { productImages, buyerPhotos } from '../images.js';
import { addToPK, addToBasket } from '../app.js';
import { currentUser, placeOrder } from '../auth.js';

const PLUG = {
  UK: { ok: true, text: 'UK 3-pin plug', sub: 'Works in UK sockets — no adapter needed' },
  EU: { ok: false, text: 'European 2-pin plug', sub: 'You will need a UK travel adapter (about £3)' },
  USB: { ok: true, text: 'USB powered / charged', sub: 'Use any USB port or USB plug' },
};
const FIT_ROOM = ['home', 'kitchen', 'travel', 'sports'];

// "Before you buy" — the facts that most often cause a wrong purchase, per category
function keyFacts(p) {
  const rows = [];
  if (p.category === 'fashion' && p.fit) {
    const ok = /true to size/i.test(p.fit);
    rows.push({ ok, text: `Fit: ${p.fit}`, sub: `${p.aspects.size}% of buyers say it fits as expected` });
  }
  if (p.care) rows.push({ ok: true, text: p.care, sub: p.material });
  if (p.category === 'food') {
    const none = /none/i.test(p.allergens);
    rows.push({ ok: none, text: none ? 'No major allergens' : `Contains: ${p.allergens}`, sub: 'Check the label if you have allergies' });
    rows.push({ ok: true, text: `Best before: ${p.bestBefore}`, sub: `${p.netWeight} · ${p.storage}` });
  }
  if (p.category === 'beauty' && p.skinType) {
    rows.push({ ok: true, text: p.skinType, sub: `${p.volume}${p.crueltyFree ? ' · Cruelty-free' : ''}` });
  }
  if (PLUG[p.plug]) rows.push(PLUG[p.plug]);
  if (p.plug === 'UK' || p.plug === 'EU' || (p.plug === 'USB' && p.safety.length)) {
    const ukca = p.safety.includes('UKCA');
    rows.push({ ok: ukca, text: ukca ? 'UKCA marked' : 'CE marked only', sub: ukca ? 'Meets UK product safety marking' : 'EU marking — not UKCA marked' });
  } else if (p.safety.length) {
    rows.push({ ok: true, text: p.safety.join(' · '), sub: 'Certified' });
  }
  if (p.sizeNote) rows.push({ ok: false, text: 'Check the size', sub: p.sizeNote });
  if (p.official) rows.push({ ok: true, text: `Sold by ${p.brand} official store`, sub: 'Genuine product, manufacturer warranty' });
  rows.push({
    ok: p.returns.free,
    text: p.returns.free ? `Free returns within ${p.returns.days} days` : `Returns cost extra · ${p.returns.days} days`,
    sub: p.returns.method,
  });
  return rows.map((r) => `<li class="${r.ok ? 'ok' : 'warn'}"><span class="fact-dot">${r.ok ? '✓' : '!'}</span><div><strong>${esc(r.text)}</strong><span>${esc(r.sub)}</span></div></li>`).join('');
}

function specRows(p, cat) {
  const rows = [
    ['Category', `${cat.name}${p.sub ? ' › ' + p.sub : ''}`],
    p.brand && ['Brand', p.brand],
    p.sizes && ['Sizes', p.sizes.join(', ')],
    p.dims && ['Dimensions', `${dimsText(p.dims)} (${dimsText(p.dims, 'in')})`],
    p.netWeight && ['Net weight', p.netWeight],
    p.volume && ['Volume', p.volume],
    p.weight !== '—' && ['Weight', p.weight],
    p.material !== '—' && [p.category === 'food' ? 'Details' : p.category === 'beauty' ? 'Key ingredients' : 'Material', p.material],
    p.allergens && ['Allergens', p.allergens],
    p.power && ['Power', `${p.voltage} · ${p.power}`],
    p.plug !== 'None' && ['Plug', PLUG[p.plug].text],
    p.safety.length && ['Certification', p.safety.join(', ')],
    p.colors.length && ['Colours', p.colors.join(', ')],
    ['Ships from', p.warehouse === 'UK' ? 'UK warehouse' : 'China'],
  ].filter(Boolean);
  return rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
}

// 1–3 buyer photos per photo review (stable per review)
const photoCount = (r) => 1 + (r.id.charCodeAt(r.id.length - 1) % 3);

function reviewItem(r, p) {
  const photos = r.photo ? buyerPhotos(p, r, photoCount(r)) : [];
  return `<article class="review">
    <div class="review-top">${stars(r.stars, 12)}<span class="muted">${r.daysAgo}d ago</span></div>
    <p>${esc(r.text)}</p>
    ${photos.length ? `<div class="review-photos">${photos.map((src, k) => `<button class="review-photo" data-review="${r.id}" data-k="${k}"><img src="${src}" alt="Photo from ${esc(r.name)}" loading="lazy"></button>`).join('')}</div>` : ''}
    <div class="review-foot">
      <span>${esc(r.name)} · ${esc(r.town)}${r.verified ? ' · <span class="verified">Verified purchase</span>' : ''}</span>
      <button class="link-btn helpful" data-id="${r.id}">Helpful (${r.helpful})</button>
    </div>
    <div class="chips small">${r.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
  </article>`;
}

export function renderProduct(el, id) {
  const p = getProduct(id);
  if (!p) { el.innerHTML = '<div class="empty card"><h3>Product not found</h3><a href="#/">Back to Today</a></div>'; return; }
  const cat = getCategory(p.category);
  store.set('viewed', [p.id, ...store.get('viewed', []).filter((x) => x !== p.id)].slice(0, 8));

  const reviews = getReviews(p).map(r=>p.familywiseImage?{...r,photo:false}:r);
  const images = productImages(p);
  const photoReviews = reviews.filter((r) => r.photo);
  const allPhotos = photoReviews.flatMap((r) => buyerPhotos(p, r, photoCount(r)).map((src) => ({ src, r })));
  const breakdown = starBreakdown(p);
  const labels = aspectLabels(p);
  // Other listings of the same product come first, then the same sub-category
  const root = p.base || p.id;
  const sameBase = PRODUCTS.filter((x) => x.id !== p.id && (x.base || x.id) === root);
  const sameSub = [...sameBase, ...PRODUCTS.filter((x) => x.id !== p.id && (x.base || x.id) !== root && x.sub === p.sub && x.category === p.category)];
  const similar = [...sameSub, ...PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category && !sameSub.includes(x))];
  const shared = (x) => x.tags.filter((t) => p.tags.includes(t)).length;
  const rivals = sameBase.length
    ? sameBase.slice().sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 2)
    : sameSub.length ? sameSub.slice(0, 2)
    : similar.slice().sort((a, b) => shared(b) - shared(a) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 2);
  const tagSet = [...new Set(reviews.flatMap((r) => r.tags))];
  let win = deliveryWindow(p);
  const defaultNeedBy = new Date(); defaultNeedBy.setDate(defaultNeedBy.getDate() + 7);
  const showFit = p.dims && FIT_ROOM.includes(p.category);
  let unit = 'cm';

  el.innerHTML = `
  <nav class="crumbs"><a href="#/">Today</a> › <a href="#/search?cat=${cat.id}">${cat.name}</a> › <span>${esc(p.name)}</span></nav>

  <section class="pd-top">
    <div class="gallery">
      <div class="g-track" id="g-track">${images.map((src, i) => `<button class="g-slide" data-i="${i}" aria-label="Image ${i + 1} of ${images.length}"><img src="${src}" alt="${esc(p.name)} — image ${i + 1}"></button>`).join('')}</div>
      <span class="g-count" id="g-count">1 / ${images.length}</span>
      <button class="g-nav g-prev" id="g-prev" aria-label="Previous image">‹</button><button class="g-nav g-next" id="g-next" aria-label="Next image">›</button>
      <div class="g-thumbs">${images.map((src, i) => `<button class="g-thumb ${i === 0 ? 'on' : ''}" data-i="${i}"><img src="${src}" alt=""></button>`).join('')}</div>
    </div>
    <div class="pd-info">
      <p class="eyebrow">${esc(p.seller)}${p.official ? ' <span class="official">Official</span>' : ''}</p>
      <h1>${esc(p.name)}</h1>
      <button class="pd-rating link-btn" id="to-reviews">${stars(p.rating, 14)} <strong>${p.rating}</strong> <span class="muted">${fmtCount(p.reviews)} ratings · ${fmtCount(p.sold)} sold</span></button>
      <div class="pd-price"><span class="now">${money(p.price)}</span><s>${money(p.was)}</s><span class="off">−${pctOff(p)}%</span></div>
      <p class="muted">Price includes VAT. Delivery quoted by selected warehouse.</p>
      ${p.colors.length > 1 ? `<p class="opt-label">Colour</p><div class="swatches" data-group="colour">${p.colors.map((c, i) => `<button class="swatch ${i === 0 ? 'on' : ''}">${esc(c)}</button>`).join('')}</div>` : ''}
      ${p.sizes ? `<p class="opt-label">Size <span class="muted">· ${esc(p.fit)}</span></p><div class="swatches" data-group="size">${p.sizes.map((s) => `<button class="swatch">${esc(s)}</button>`).join('')}</div>` : ''}
      <p class="pd-desc">${esc(p.desc)}</p><button id="choose-warehouse" class="delivery-choice">${warehouseSummary(p)} <span>Change ↗</span></button>
      <div class="pd-actions">
        <button class="pill pill-blue" id="buy-now">Buy now</button>
        <button class="pill pill-grey" id="add-basket">Add to basket</button>
        <button class="pill pill-grey" id="add-pk">+ PK</button>
      </div>
    </div>
  </section>

  <div id="product-cost"></div><details class="product-details"><summary>Before you buy <span>Delivery date, fit & key facts</span></summary><section class="pd-panels">
    <div class="card panel">
      <h3>Before you buy</h3>
      <ul class="facts">${keyFacts(p)}</ul>
    </div>

    <div class="card panel">
      <h3>Delivery</h3>
      <p class="big">${deliveryText(p)}</p>
      <p class="muted" id="delivery-origin">${shipping(p,warehouseFor(p),destination()).warehouse.name} · simulated delivery window</p>
      <label class="field">I need it by
        <input type="date" id="need-by" value="${defaultNeedBy.toISOString().slice(0, 10)}">
      </label>
      <div id="need-result" class="result"></div>
    </div>

    ${showFit ? `<div class="card panel">
      <h3>Will it fit?</h3>
      <div class="dims-row"><span class="big" id="dims">${dimsText(p.dims)}</span>
        <div class="seg small"><button data-unit="cm" class="on">cm</button><button data-unit="in">in</button></div></div>
      <p class="muted">W × D × H. Enter your space to check:</p>
      <div class="fit-inputs">
        <input type="number" min="0" placeholder="W" id="fw"><input type="number" min="0" placeholder="D" id="fd"><input type="number" min="0" placeholder="H" id="fh"><span class="muted" id="fit-unit">cm</span>
      </div>
      <div id="fit-result" class="result"></div>
    </div>` : ''}
  </section>

  </details><details class="card specs"><summary>Specifications</summary>

    <dl>${specRows(p, cat)}</dl>
  </details>

  ${rivals.length ? `<section class="card pk-teaser">
    <div><h3>Not sure? PK it.</h3><p class="muted">Compare side by side with similar items.</p></div>
    <div class="pk-options">${rivals.map((r) => `
      <a class="pk-option" href="#/compare?ids=${p.id},${r.id}">
        ${productArt(p, 'mini')}<span class="vs">VS</span>${productArt(r, 'mini')}
        <span class="pk-name">${esc(r.name)}<br><span class="muted">${money(r.price)} · ${r.rating}★</span></span>
      </a>`).join('')}</div>
  </section>` : ''}

  <details class="reviews-wrap" id="reviews"><summary>Ratings & reviews <span>${p.rating} ★ · ${fmtCount(p.reviews)} sample ratings</span></summary>
    <div class="review-summary card">
      <div class="score"><span class="big-num">${p.rating}</span><span class="muted">out of 5</span></div>
      <div class="bars">${breakdown.map((v, i) => `<div class="bar-row"><span>${5 - i}★</span><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}
        <p class="muted">${fmtCount(p.reviews)} ratings</p></div>
      <div class="aspects">
        ${['size', 'photo', 'quality'].map((k) => `
          <div class="aspect"><div class="ring" style="--v:${p.aspects[k]}"><span>${p.aspects[k]}%</span></div><span>${labels[k]}</span></div>`).join('')}
      </div>
    </div>
    ${allPhotos.length ? `<div class="buyer-show">
      <div class="bs-head"><h3>Customer photos</h3><span class="muted">${allPhotos.length} photos from ${photoReviews.length} reviews</span></div>
      <div class="bs-row">${allPhotos.map((x, i) => `<button class="bs-photo" data-i="${i}"><img src="${x.src}" alt="Customer photo" loading="lazy"></button>`).join('')}</div>
    </div>` : ''}
    <div class="chips" id="review-filters">
      <button class="chip on" data-f="all">All</button>
      <button class="chip" data-f="photo">With photos</button>
      <button class="chip" data-f="5">5 stars</button>
      <button class="chip" data-f="critical">Critical (1–3★)</button>
      ${tagSet.map((t) => `<button class="chip" data-f="tag:${esc(t)}">${esc(t)}</button>`).join('')}
    </div>
    <div class="review-list" id="review-list"></div>
  </details>

  <section class="shelf">
    <div class="shelf-head"><h2>You might also like</h2></div>
    <div class="shelf-row">${similar.slice(0, 10).map((x) => productCard(x)).join('')}</div>
  </section>
  `;

  // --- gallery ---
  const track = $('#g-track', el);
  const thumbs = $$('.g-thumb', el);
  const cur = () => Math.round(track.scrollLeft / track.clientWidth);
  const goTo = (i) => track.scrollTo({ left: ((i + images.length) % images.length) * track.clientWidth, behavior: 'smooth' });
  track.addEventListener('scroll', () => {
    const i = cur();
    $('#g-count', el).textContent = `${i + 1} / ${images.length}`;
    thumbs.forEach((t, k) => t.classList.toggle('on', k === i));
  }, { passive: true });
  thumbs.forEach((t) => (t.onclick = () => goTo(+t.dataset.i)));
  $('#g-prev', el).onclick = () => goTo(cur() - 1);
  $('#g-next', el).onclick = () => goTo(cur() + 1);
  $$('.g-slide', el).forEach((b) => (b.onclick = () => openLightbox(images, +b.dataset.i, p.name)));
  $$('.bs-photo', el).forEach((b) => (b.onclick = () => openLightbox(allPhotos.map((x) => x.src), +b.dataset.i, 'Customer photos')));

  // --- interactions ---
  $('#to-reviews',el).onclick=()=>{const r=$('#reviews',el);r.open=true;r.scrollIntoView({behavior:'smooth'});};
  const selection=()=>({size:$('[data-group="size"] .on',el)?.textContent||'',colour:$('[data-group="colour"] .on',el)?.textContent||''});
  $('#add-basket',el).onclick=()=>addToBasket(p.id,selection());
  $('#add-pk', el).onclick = () => addToPK(p.id);
  $('#buy-now',el).onclick=()=>{if(addToBasket(p.id,selection()))location.hash='#/checkout';};
  mountCost($('#product-cost',el),[p]);
  $('#choose-warehouse',el).onclick=()=>openWarehouses(p,()=>{win=deliveryWindow(p);$('#choose-warehouse',el).innerHTML=warehouseSummary(p)+' <span>Change ↗</span>';$('.panel .big',el).textContent=deliveryText(p);$('#delivery-origin',el).textContent=shipping(p,warehouseFor(p),destination()).warehouse.name+' · simulated delivery window';checkNeed();mountCost($('#product-cost',el),[p]);});
  $$('.swatches', el).forEach((group) => $$('.swatch', group).forEach((b) => (b.onclick = () => {
    $$('.swatch', group).forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
  })));

  const needInput = $('#need-by', el);
  const ukAlternative = () => {
    const alt = similar.find((x) => x.warehouse === 'UK');
    return alt ? `<a class="alt" href="#/product/${alt.id}">Faster option: ${esc(alt.name)} · ${money(alt.price)} · 2–4 days →</a>` : '';
  };
  const checkNeed = () => {
    const need = new Date(needInput.value + 'T23:59');
    const box = $('#need-result', el);
    if (isNaN(need)) { box.innerHTML = ''; return; }
    if (win.latest <= need) box.innerHTML = `<span class="ok">✓ Arrives in time — latest ${fmtDate(win.latest)}</span>`;
    else if (win.earliest <= need) box.innerHTML = `<span class="warn">! Might arrive late — could be as late as ${fmtDate(win.latest)}</span>${ukAlternative()}`;
    else box.innerHTML = `<span class="bad">✕ Won’t arrive in time — earliest ${fmtDate(win.earliest)}</span>${ukAlternative()}`;
  };
  needInput.addEventListener('input', checkNeed);
  checkNeed();

  if (showFit) {
    const conv = (v) => (unit === 'in' ? v * 2.54 : v);
    const checkFit = () => {
      const space = ['#fw', '#fd', '#fh'].map((s) => parseFloat($(s, el).value));
      const box = $('#fit-result', el);
      if (space.every(isNaN)) { box.innerHTML = ''; return; }
      const names = ['width', 'depth', 'height'];
      const tooBig = p.dims.map((d, i) => (!isNaN(space[i]) && d > conv(space[i]) ? names[i] : null)).filter(Boolean);
      box.innerHTML = tooBig.length
        ? `<span class="bad">✕ Too big for your space (${tooBig.join(', ')})</span>`
        : '<span class="ok">✓ Fits your space</span>';
    };
    ['#fw', '#fd', '#fh'].forEach((s) => $(s, el).addEventListener('input', checkFit));
    $$('[data-unit]', el).forEach((a) => (a.onclick = () => {
      unit = a.dataset.unit;
      $$('[data-unit]', el).forEach((x) => x.classList.toggle('on', x === a));
      $('#dims', el).textContent = dimsText(p.dims, unit);
      $('#fit-unit', el).textContent = unit;
      checkFit();
    }));
  }

  const list = $('#review-list', el);
  const renderReviews = (f) => {
    const filtered = reviews.filter((r) =>
      f === 'all' ? true : f === 'photo' ? r.photo : f === '5' ? r.stars === 5 : f === 'critical' ? r.stars <= 3 : r.tags.includes(f.slice(4)));
    list.innerHTML = filtered.length ? filtered.map((r) => reviewItem(r, p)).join('') : '<p class="muted">No reviews match this filter.</p>';
    $$('.review-photo', list).forEach((b) => (b.onclick = () => {
      const r = reviews.find((x) => x.id === b.dataset.review);
      openLightbox(buyerPhotos(p, r, photoCount(r)), +b.dataset.k, `${r.name} · ${r.town}`);
    }));
    $$('.helpful', list).forEach((b) => (b.onclick = () => { b.disabled = true; b.textContent = 'Thanks!'; }));
  };
  $$('#review-filters .chip', el).forEach((c) => (c.onclick = () => {
    $$('#review-filters .chip', el).forEach((x) => x.classList.remove('on'));
    c.classList.add('on');
    renderReviews(c.dataset.f);
  }));
  renderReviews('all');
}
