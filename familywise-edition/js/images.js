// Generates merchant images (5 per product) and buyer-show photos as SVG data URIs.
// Everything is drawn in code — no real photos, logos or brands.
// To use real photos instead, give a product `images: ['img/f1-1.jpg', …]` in data/products.js.
import { CATEGORIES } from '../data/products.js';
import { BLUEPRINTS } from '../data/variants.js';
import { draw, makeCtx, hex, shade } from './art.js';
import { PHOTO_MANIFEST } from '../../img/manifest.js';

// Photos registered in the main site's img/manifest.js (shared by a base product and its similar listings).
// Manifest paths are relative to the site root, so prefix them for pages served from familywise-edition/.
const ROOT = '../';
const rooted = (list) => list?.map((src) => ROOT + src);
const photosFor = (p) => PHOTO_MANIFEST[p.base || p.id];
function realProductImages(p) {
  const m = photosFor(p);
  if (!m?.product?.length) return null;
  const colorShot = m.colors?.[p.colors?.[0]];
  return rooted(colorShot ? [colorShot, ...m.product.filter((x) => x !== colorShot)] : m.product);
}
const hashNum = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const FONT = `-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif`;
const X = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cat = (p) => CATEGORIES.find((c) => c.id === p.category);
const money = (n) => '£' + n.toFixed(2);
const pct = (p) => Math.round((1 - p.price / p.was) * 100);

function rng(seed) {
  let s = [...seed].reduce((a, c) => a * 31 + c.charCodeAt(0), 5) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
function wrap(text, max) {
  const words = String(text).split(' ');
  const lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max && cur) lines.push(w); else lines[lines.length - 1] = (cur + ' ' + w).trim();
  }
  return lines;
}
const text = (x, y, s, size, opts = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${opts.w || 600}" fill="${opts.fill || '#1d1d1f'}" text-anchor="${opts.anchor || 'start'}" ${opts.ls ? `letter-spacing="${opts.ls}"` : ''} ${opts.op ? `opacity="${opts.op}"` : ''}>${X(s)}</text>`;
const lines = (x, y, arr, size, gap, opts) => arr.map((l, i) => text(x, y + i * gap, l, size, opts)).join('');
const uri = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
const svgDoc = (w, h, defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs.join('')}</defs>${body}</svg>`;

// Packaged goods have no "colour" option, so vary the packaging per listing
const PACK = { coffeebag: ['#2f2a26', '#7a3b1f', '#1f3b5a', '#b8542d', '#3d5a3a'], chocbox: ['#7a1f2b', '#3b2418', '#1d3557', '#a06b2d'], tin: ['#3d6b3a', '#1d1d1f', '#c9a14a', '#5b7f4a'],
  pouch: ['#c8873a', '#6b8e3d', '#8a4b2a', '#d6a54a'], noodles: ['#e0533b', '#d9342b', '#f2a53a', '#3a3a3a'], serum: ['#d9a066', '#b7c9e8', '#e8b7c8', '#f2e0a0'], tube: ['#f08c3a', '#3bb3d8', '#e85d75', '#5ab37a'],
  containers: ['#3b6fd8', '#4f9a5b', '#2b2b2f', '#e0533b'] };
export function productColor(p, colorName) {
  const shape = shapeOf(p);
  if (colorName && !['RGB', 'Clear'].includes(colorName)) return hex(colorName);
  if (PACK[shape]) {
    const list = PACK[shape];
    const k = p.variant ? Number(p.id.split('v')[1]) % list.length : 0;
    return list[k];
  }
  if (p.colors[0] && !['RGB', 'Clear'].includes(p.colors[0])) return hex(p.colors[0]);
  return cat(p).colors[1];
}
export const shapeOf = (p) => p.shape || BLUEPRINTS[p.base || p.id]?.shape || 'cubes';

function product(p, ctx, x, y, scale, color, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale}) translate(-200 -205)">${draw(shapeOf(p), ctx, color)}</g>`;
}
const shadow = (ctx, x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.12}" fill="${ctx.radial([[0, '#000', 0.28], [1, '#000', 0]])}"/>`;

// One short hook line for a product (used as image headline)
function hook(p) {
  const first = p.desc.split(/\.\s|,\s|\s—\s|\.$/)[0].trim();
  return first.length <= 34 ? first : (BLUEPRINTS[p.base || p.id]?.core || p.name);
}
// The fact that matters most for this category (shown on images)
function keyPoint(p) {
  if (p.fit) return ['Fit', p.fit];
  if (p.allergens) return ['Allergens', p.allergens];
  if (p.skinType) return ['Skin type', p.skinType];
  if (p.plug === 'UK') return ['UK 3-pin plug', 'No adapter needed'];
  if (p.plug === 'EU') return ['EU 2-pin plug', 'UK adapter needed'];
  if (p.plug === 'USB') return ['USB powered', p.power || 'Charge anywhere'];
  if (p.dims) return ['Size', p.dims.join(' × ') + ' cm'];
  return ['Material', p.material];
}

// ---------- 1. Main image (Taobao-style: hero product + price strip) ----------
function mainImage(p, color) {
  const ctx = makeCtx('m');
  const c = cat(p), r = rng(p.id + 'm');
  const bg = ctx.radial([[0, '#ffffff'], [0.65, shade(c.colors[0], 0.78)], [1, shade(c.colors[1], 0.55)]], 0.5, 0.42, 0.75);
  const accent = c.colors[1];
  const head = wrap(hook(p), 18).slice(0, 2);
  const badge = p.official ? `<rect x="40" y="40" width="${44 + (p.brand.length + 11) * 12.2}" height="40" rx="20" fill="#1d1d1f"/>${text(62, 67, p.brand.toUpperCase() + ' · OFFICIAL', 15, { fill: '#fff', ls: 1.5, w: 700 })}`
    : `${text(44, 66, p.seller.toUpperCase(), 15, { fill: shade(accent, -0.3), ls: 2, w: 700 })}`;
  const stock = p.warehouse === 'UK'
    ? `<rect x="560" y="40" width="200" height="40" rx="20" fill="#1a8f3c"/>${text(660, 66, 'UK STOCK · 2–4 DAYS', 14, { fill: '#fff', anchor: 'middle', w: 700 })}`
    : `<circle cx="712" cy="88" r="48" fill="#e0353d"/>${text(712, 86, `−${pct(p)}%`, 26, { fill: '#fff', anchor: 'middle', w: 800 })}${text(712, 108, 'TODAY', 12, { fill: '#fff', anchor: 'middle', w: 700, ls: 1 })}`;
  const body = `<rect width="800" height="800" fill="${bg}"/>
    <circle cx="${560 + r() * 120}" cy="${200 + r() * 80}" r="${120 + r() * 60}" fill="${accent}" opacity=".08"/>
    ${badge}${stock}
    ${lines(44, 150, head, 52, 60, { w: 800, fill: '#1d1d1f' })}
    ${shadow(ctx, 400, 616, 230)}
    ${product(p, ctx, 400, 420, 1.45, color)}
    <rect x="0" y="664" width="800" height="136" fill="${ctx.grad([[0, '#1d1d1f'], [1, shade(accent, -0.55)]], 1, 0)}"/>
    ${text(44, 706, 'DEAL PRICE', 16, { fill: '#ffd28a', w: 700, ls: 2 })}
    ${text(40, 772, money(p.price), 64, { fill: '#fff', w: 800 })}
    ${text(756, 724, 'was ' + money(p.was), 22, { fill: '#aaa', anchor: 'end', w: 500 })}
    <path d="M${756 - (8 + money(p.was).length * 12.5)} 717h${8 + money(p.was).length * 12.5}" stroke="#aaa" stroke-width="2"/>
    <rect x="606" y="740" width="150" height="40" rx="20" fill="#ff9f0a"/>${text(681, 767, `SAVE ${pct(p)}%`, 18, { fill: '#1d1d1f', anchor: 'middle', w: 800 })}`;
  return svgDoc(800, 800, ctx.defs, body);
}

// ---------- 2. Selling points ----------
function pointsImage(p, color) {
  const ctx = makeCtx('p');
  const c = cat(p);
  const kp = keyPoint(p);
  const pts = [
    ['★', `${p.rating} out of 5`, `${p.reviews.toLocaleString('en-GB')} verified reviews`],
    [p.returns.free ? '↺' : '£', p.returns.free ? `Free ${p.returns.days}-day returns` : `${p.returns.days}-day returns`, p.returns.method.slice(0, 34)],
    ['✓', kp[0], String(kp[1]).slice(0, 34)],
    [p.warehouse === 'UK' ? '⚡' : '✈', p.warehouse === 'UK' ? 'Ships from UK' : 'Ships from maker', p.warehouse === 'UK' ? 'Tracked delivery in 2–4 days' : 'Tracked delivery in 7–14 days'],
  ];
  const body = `<rect width="800" height="800" fill="#f5f5f7"/>
    ${text(400, 96, 'Why shoppers love it', 46, { anchor: 'middle', w: 800 })}
    ${text(400, 138, `${(p.official ? p.brand : p.seller)} · ${(BLUEPRINTS[p.base || p.id]?.core || '')}`, 22, { anchor: 'middle', fill: '#6e6e73', w: 500 })}
    <circle cx="210" cy="430" r="190" fill="${ctx.grad([[0, shade(c.colors[0], 0.55)], [1, shade(c.colors[1], 0.35)]])}"/>
    ${product(p, ctx, 210, 440, 0.95, color)}
    ${pts.map(([ic, t, s], i) => `<g transform="translate(430 ${250 + i * 120})">
      <circle cx="30" cy="0" r="30" fill="${c.colors[1]}"/>${text(30, 10, ic, 28, { anchor: 'middle', fill: '#fff', w: 700 })}
      ${text(76, -4, t.length > 22 ? t.slice(0, 22) + '…' : t, 26, { w: 700 })}${text(76, 26, s, 17, { fill: '#6e6e73', w: 500 })}</g>`).join('')}
    <rect x="40" y="690" width="720" height="70" rx="35" fill="#fff"/>
    ${text(400, 735, p.official ? 'Genuine product · Official store warranty' : 'Buyer protection on every order', 22, { anchor: 'middle', w: 600, fill: '#1d1d1f' })}`;
  return svgDoc(800, 800, ctx.defs, body);
}

// ---------- 3. Size / details ----------
function specImage(p, color) {
  const ctx = makeCtx('s');
  const c = cat(p);
  let title = 'Details', rows = [], visual = '';
  if (p.sizes) {
    title = 'Size guide';
    const isShoe = p.sizes[0].startsWith('UK');
    rows = [isShoe ? ['UK', 'EU', 'Foot (cm)'] : ['Size', 'Chest (cm)', 'Length (cm)']]
      .concat(p.sizes.slice(0, 6).map((s, i) => (isShoe ? [s.replace('UK ', ''), String(38 + i), (23.5 + i * 0.85).toFixed(1)] : [s, String(84 + i * 8), String(64 + i * 2)])));
    visual = product(p, ctx, 400, 300, 0.85, color);
  } else if (p.dims && !p.netWeight) {
    title = 'Size & dimensions';
    visual = `${product(p, ctx, 400, 300, 0.9, color)}
      <path d="M232 470h336" stroke="#0071e3" stroke-width="3" marker-start="url(#s-arw)" marker-end="url(#s-arw)"/>${text(400, 500, `${p.dims[0]} cm wide`, 22, { anchor: 'middle', fill: '#0071e3', w: 700 })}
      <path d="M612 140v320" stroke="#0071e3" stroke-width="3" marker-start="url(#s-arw)" marker-end="url(#s-arw)"/>${text(630, 306, `${p.dims[2]} cm`, 22, { fill: '#0071e3', w: 700 })}`;
    ctx.defs.push('<marker id="s-arw" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#0071e3"/></marker>');
    rows = [['Dimensions', p.dims.join(' × ') + ' cm'], ['Weight', p.weight], ['Material', p.material]];
    if (p.power) rows.push(['Power', `${p.voltage} · ${p.power}`]);
  } else {
    title = p.category === 'food' ? 'Ingredients & storage' : p.category === 'beauty' ? 'Key ingredients' : 'Product details';
    visual = product(p, ctx, 400, 300, 0.9, color);
    rows = [
      p.netWeight && ['Net weight', p.netWeight], p.volume && ['Volume', p.volume], p.bestBefore && ['Best before', p.bestBefore],
      p.allergens && ['Allergens', p.allergens], p.storage && ['Storage', p.storage], p.skinType && ['Skin type', p.skinType],
      ['Details', p.material], p.power && ['Power', `${p.voltage} · ${p.power}`],
    ].filter(Boolean).slice(0, 5);
  }
  const top = p.sizes ? 470 : 540;
  const isGrid = p.sizes;
  const table = isGrid
    ? rows.map((r, i) => `<rect x="80" y="${top + i * 40 - 28}" width="640" height="40" fill="${i === 0 ? c.colors[1] : i % 2 ? '#fff' : '#f5f5f7'}"/>${r.map((v, j) => text(80 + 107 + j * 213, top + i * 40 - 2, v, 19, { anchor: 'middle', w: i === 0 ? 700 : 500, fill: i === 0 ? '#fff' : '#1d1d1f' })).join('')}`).join('')
    : rows.map(([k, v], i) => `<rect x="80" y="${top + i * 46 - 30}" width="640" height="46" fill="${i % 2 ? '#fff' : '#f5f5f7'}"/>${text(104, top + i * 46, k, 19, { fill: '#6e6e73', w: 500 })}${text(300, top + i * 46, String(v).slice(0, 40), 19, { w: 600 })}`).join('');
  const body = `<rect width="800" height="800" fill="#ffffff"/>
    ${text(400, 80, title, 44, { anchor: 'middle', w: 800 })}
    ${visual}${table}
    ${p.fit ? text(400, 770, `Fit: ${p.fit}`, 20, { anchor: 'middle', w: 700, fill: /true/i.test(p.fit) ? '#1a8f3c' : '#c25e00' }) : ''}`;
  return svgDoc(800, 800, ctx.defs, body);
}

// ---------- 4. Lifestyle scene ----------
const SCENES = {
  fashion: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#efe9e1'], [1, '#e3dbd0']])}"/><rect x="0" y="560" width="800" height="240" fill="#d8cfc3"/><rect x="250" y="520" width="300" height="60" rx="8" fill="#f6f2ec"/><path d="M640 560c0-120 30-200 70-260M660 560c10-100 60-160 100-200" stroke="#7d9a6a" stroke-width="8" fill="none"/><ellipse cx="700" cy="300" rx="40" ry="18" fill="#93b07d" transform="rotate(-30 700 300)"/>`,
  food: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#f6efe4'], [1, '#efe2cf']])}"/><rect x="0" y="540" width="800" height="260" fill="${ctx.grad([[0, '#a5774f'], [1, '#7c5636']])}"/><path d="M0 560h800" stroke="#8a6040" stroke-width="4"/><rect x="600" y="440" width="90" height="110" rx="12" fill="#fff"/><path d="M690 470c30 0 30 50 0 50" stroke="#fff" stroke-width="10" fill="none"/><ellipse cx="645" cy="444" rx="45" ry="10" fill="#6b3f22"/><path d="M630 420c-10-20 10-30 0-50M660 420c-10-20 10-30 0-50" stroke="#ccc" stroke-width="4" fill="none" opacity=".7"/>`,
  home: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#e9eef0'], [1, '#dde5e8']])}"/><rect x="520" y="80" width="200" height="260" rx="6" fill="#cfe3ee" stroke="#fff" stroke-width="12"/><path d="M620 80v260M520 210h200" stroke="#fff" stroke-width="8"/><rect x="0" y="560" width="800" height="240" fill="${ctx.grad([[0, '#c9b49a'], [1, '#b39c80']])}"/><rect x="60" y="460" width="190" height="110" rx="10" fill="#f2efe9"/>`,
  kitchen: (ctx) => `<rect width="800" height="800" fill="#f1f3f4"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 100} 0v540" stroke="#dfe3e6" stroke-width="3"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${i * 100}h800" stroke="#dfe3e6" stroke-width="3"/>`).join('')}<rect x="0" y="540" width="800" height="260" fill="${ctx.grad([[0, '#f7f7f5'], [1, '#e2e2de']])}"/><path d="M0 540h800" stroke="#c8c8c4" stroke-width="6"/><circle cx="680" cy="470" r="60" fill="#7da35a"/><rect x="660" y="500" width="40" height="50" fill="#a57c52"/>`,
  electronics: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#2a2d34'], [1, '#16181d']])}"/><rect x="0" y="560" width="800" height="240" fill="#3a3027"/><rect x="520" y="200" width="240" height="160" rx="10" fill="#111" stroke="#444" stroke-width="6"/><rect x="532" y="212" width="216" height="136" fill="${ctx.grad([[0, '#4f7cff'], [1, '#8b5cf6']], 1, 1)}" opacity=".8"/><rect x="620" y="360" width="40" height="200" fill="#2a2a2e"/>`,
  beauty: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#f8eef0'], [1, '#f0dfe3']])}"/><rect x="0" y="560" width="800" height="240" fill="${ctx.grad([[0, '#fafafa'], [1, '#e9e6e6']])}"/>${[100, 260, 480, 650].map((x) => `<path d="M${x} 560q40 120 -20 240" stroke="#d7d0d0" stroke-width="3" fill="none"/>`).join('')}<circle cx="660" cy="240" r="120" fill="#fff" opacity=".7"/><ellipse cx="140" cy="540" rx="60" ry="16" fill="#f3c6cf"/>`,
  sports: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#e5ece6'], [1, '#d3ded5']])}"/><rect x="0" y="560" width="800" height="240" fill="#9fb3a3"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 100} 560l-80 240" stroke="#8ea392" stroke-width="3"/>`).join('')}<rect x="560" y="120" width="180" height="300" rx="10" fill="#fff" opacity=".6"/>`,
  travel: (ctx) => `<rect width="800" height="800" fill="${ctx.grad([[0, '#bfdcf5'], [1, '#eaf3fb']])}"/><path d="M80 200q120-60 240-20" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M560 140l80 20-80 20 20-20z" fill="#fff"/><rect x="0" y="560" width="800" height="240" fill="#c5c9cf"/><rect x="0" y="80" width="800" height="12" fill="#9aa3ad"/>`,
};
function sceneImage(p, color) {
  const ctx = makeCtx('c');
  const head = wrap(p.desc.split(/\.\s|\.$/)[0], 26).slice(0, 2);
  const dark = p.category === 'electronics';
  const body = `${(SCENES[p.category] || SCENES.home)(ctx)}
    ${shadow(ctx, 360, 600, 200)}
    ${product(p, ctx, 360, 420, 1.15, color)}
    <rect x="40" y="40" width="${Math.max(...head.map((l) => l.length)) * 17 + 60}" height="${head.length * 44 + 40}" rx="22" fill="${dark ? '#000' : '#fff'}" opacity=".78"/>
    ${lines(70, 92, head, 32, 44, { w: 700, fill: dark ? '#fff' : '#1d1d1f' })}
    ${text(760, 760, 'Styled at home', 18, { anchor: 'end', fill: dark ? '#bbb' : '#6e6e73', w: 500 })}`;
  return svgDoc(800, 800, ctx.defs, body);
}

// ---------- 5. Colours / what's in the box ----------
function optionsImage(p) {
  const ctx = makeCtx('o');
  const c = cat(p);
  if (p.colors.length >= 2) {
    const cols = p.colors.slice(0, 4);
    const pos = cols.length === 2 ? [[220, 400], [580, 400]] : cols.length === 3 ? [[200, 330], [600, 330], [400, 590]] : [[220, 300], [580, 300], [220, 580], [580, 580]];
    const sc = cols.length === 2 ? 0.95 : 0.66;
    return svgDoc(800, 800, ctx.defs, `<rect width="800" height="800" fill="#ffffff"/>
      ${text(400, 86, `Available in ${p.colors.length} colours`, 44, { anchor: 'middle', w: 800 })}
      ${cols.map((name, i) => `<rect x="${pos[i][0] - 170}" y="${pos[i][1] - 150}" width="340" height="${cols.length === 2 ? 420 : 250}" rx="28" fill="#f5f5f7"/>
        ${product(p, ctx, pos[i][0], pos[i][1] - (cols.length === 2 ? -20 : 10), sc, productColor(p, name))}
        <circle cx="${pos[i][0] - 60}" cy="${pos[i][1] + (cols.length === 2 ? 236 : 76)}" r="12" fill="${hex(name)}" stroke="#ccc"/>
        ${text(pos[i][0] - 38, pos[i][1] + (cols.length === 2 ? 243 : 83), name, 20, { w: 600 })}`).join('')}`);
  }
  const color = productColor(p);
  const items = [
    `1 × ${(BLUEPRINTS[p.base || p.id]?.core || 'item')}`,
    p.plug === 'UK' ? 'Fused UK 3-pin plug' : p.plug === 'EU' ? 'EU plug (adapter not included)' : p.netWeight ? `Net weight ${p.netWeight}` : p.volume ? `${p.volume} bottle` : 'Protective packaging',
    p.official ? 'Official warranty card' : 'Quick-start / care card',
    p.returns.free ? 'Free returns label' : 'Gift-ready box',
  ];
  return svgDoc(800, 800, ctx.defs, `<rect width="800" height="800" fill="${ctx.grad([[0, '#ffffff'], [1, shade(c.colors[0], 0.8)]])}"/>
    ${text(400, 86, 'What’s in the box', 44, { anchor: 'middle', w: 800 })}
    <rect x="70" y="140" width="660" height="360" rx="30" fill="#fff" stroke="#e5e5ea"/>
    ${shadow(ctx, 400, 470, 170)}${product(p, ctx, 400, 320, 0.95, color)}
    ${items.map((t, i) => `<g transform="translate(${i % 2 ? 420 : 90} ${560 + Math.floor(i / 2) * 80})"><circle cx="20" cy="0" r="20" fill="${c.colors[1]}"/>${text(20, 8, '✓', 22, { anchor: 'middle', fill: '#fff', w: 800 })}${text(54, 8, t.slice(0, 26), 21, { w: 600 })}</g>`).join('')}`);
}

// ---------- public API ----------
const CACHE = new Map();
export function productImages(p) {
  if (p.images?.length) return p.images;
  const real = realProductImages(p);
  if (real) return real;
  if (CACHE.has(p.id)) return CACHE.get(p.id);
  const color = productColor(p);
  const list = [mainImage(p, color), pointsImage(p, color), specImage(p, color), sceneImage(p, color), optionsImage(p)].map(uri);
  CACHE.set(p.id, list);
  return list;
}
// Only the main image — cheaper, used by product cards
const MAIN = new Map();
export function mainImageUri(p) {
  if (p.images?.length) return p.images[0];
  const real = realProductImages(p);
  if (real) return real[0];
  if (CACHE.has(p.id)) return CACHE.get(p.id)[0];
  if (!MAIN.has(p.id)) MAIN.set(p.id, uri(mainImage(p, productColor(p))));
  return MAIN.get(p.id);
}
// Clean product shot without text (for small tiles and carousel)
const CUT = new Map();
export function cutoutUri(p) {
  const real = realProductImages(p);
  if (real) return real[0];
  if(p.familywiseImage)return p.images[0];
  if (!CUT.has(p.id)) {
    const ctx = makeCtx('k');
    const c = cat(p);
    CUT.set(p.id, uri(svgDoc(400, 400, ctx.defs, `<rect width="400" height="400" fill="${ctx.radial([[0, '#ffffff'], [1, shade(c.colors[0], 0.6)]], 0.5, 0.45, 0.7)}"/>${shadow(ctx, 200, 345, 120)}${product(p, ctx, 200, 205, 0.82, productColor(p))}`)));
  }
  return CUT.get(p.id);
}

// ---------- buyer-show photos ----------
const SURFACES = [
  (ctx, r) => `<rect width="600" height="600" fill="${ctx.grad([[0, '#f4f1ec'], [1, '#e4ded4']], 1, 1)}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-50 + i * 130} 0q${60 + r() * 60} 300 ${-40 + r() * 80} 600" stroke="#d6cfc4" stroke-width="${10 + r() * 14}" fill="none" opacity=".55"/>`).join('')}`, // bed sheet
  (ctx) => `<rect width="600" height="600" fill="${ctx.grad([[0, '#a0714a'], [1, '#7d5434']])}"/>${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 45 + 10}q300 ${i % 2 ? 12 : -12} 600 0" stroke="#6b4529" stroke-width="2" fill="none" opacity=".5"/>`).join('')}`, // wood table
  (ctx) => `<rect width="600" height="600" fill="${ctx.grad([[0, '#f5f5f5'], [1, '#e2e2e2']], 1, 1)}"/><path d="M0 120q200 60 340 10t260 90M40 600q120-200 360-260" stroke="#c9c9c9" stroke-width="3" fill="none"/><path d="M200 0q60 200-40 400" stroke="#d6d6d6" stroke-width="2" fill="none"/>`, // marble
  (ctx) => `<rect width="600" height="600" fill="#8f9399"/>${Array.from({ length: 400 }, (_, i) => `<rect x="${(i * 37) % 600}" y="${(i * 91) % 600}" width="3" height="3" fill="${i % 2 ? '#7e8288' : '#a2a6ac'}"/>`).join('')}`, // carpet
  (ctx) => `<rect width="600" height="600" fill="${ctx.grad([[0, '#3a3c42'], [1, '#26272b']])}"/><rect x="380" y="-20" width="260" height="170" rx="12" fill="#1d1d20" transform="rotate(12 500 60)"/>`, // desk
  (ctx) => `<rect width="600" height="600" fill="#e7e2da"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${i * 150} 0v600M0 ${i * 150}h600" stroke="#d2ccc2" stroke-width="4"/>`).join('')}`, // floor tiles
];
const SURFACE_BY_CAT = { fashion: [0, 3, 5], food: [1, 2, 4], home: [0, 3, 5], kitchen: [1, 2], electronics: [4, 1, 0], beauty: [2, 0], sports: [3, 5], travel: [5, 3, 0] };
export function buyerPhotos(p, review, count) {
  const m = photosFor(p);
  if (m?.reviews?.[review.id]?.length) return rooted(m.reviews[review.id]);
  if (m?.buyer?.length) {
    const start = hashNum(p.id + review.id) % m.buyer.length;
    return Array.from({ length: Math.min(count, m.buyer.length) }, (_, k) => ROOT + m.buyer[(start + k) % m.buyer.length]);
  }
  return Array.from({ length: count }, (_, k) => {
    const key = `${p.id}|${review.id}|${k}`;
    if (CACHE.has(key)) return CACHE.get(key);
    const r = rng(key);
    const ctx = makeCtx('b');
    const opts = SURFACE_BY_CAT[p.category] || [0, 1, 2];
    const surface = SURFACES[opts[Math.floor(r() * opts.length)]];
    const warm = r() < 0.6;
    const colorName = p.colors.length ? p.colors[Math.floor(r() * p.colors.length)] : null;
    ctx.defs.push(`<filter id="b-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${Math.floor(r() * 99)}"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.14 0"/></filter>`);
    ctx.defs.push(`<filter id="b-soft"><feGaussianBlur stdDeviation="0.6"/></filter>`);
    const sx = 300 + (r() - 0.5) * 80, sy = 310 + (r() - 0.5) * 60, sc = 0.95 + r() * 0.35, rot = (r() - 0.5) * 30;
    const svg = svgDoc(600, 600, ctx.defs, `<g filter="url(#b-soft)">${surface(ctx, r)}
      <ellipse cx="${sx + 14}" cy="${sy + 128 * sc}" rx="${150 * sc}" ry="${26 * sc}" fill="${ctx.radial([[0, '#000', 0.32], [0.6, '#000', 0.12], [1, '#000', 0]])}"/>
      ${product(p, ctx, sx, sy, sc, productColor(p, colorName), rot)}</g>
      <rect width="600" height="600" fill="${ctx.radial([[0, warm ? '#ffcf8a' : '#cfe3ff', 0.18], [1, warm ? '#ffcf8a' : '#cfe3ff', 0]], 0.3 + r() * 0.4, 0.2, 0.8)}"/>
      <rect width="600" height="600" fill="${ctx.radial([[0.55, '#000', 0], [1, '#000', 0.38]], 0.5, 0.5, 0.75)}"/>
      <rect width="600" height="600" filter="url(#b-grain)"/>`);
    const out = uri(svg);
    CACHE.set(key, out);
    return out;
  });
}
