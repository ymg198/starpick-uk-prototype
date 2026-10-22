// Keyword index: an inverted index over product names, tags, categories and sellers,
// with UK/US synonyms, prefix matching and 1-letter typo tolerance.
import { PRODUCTS, CATEGORIES } from '../data/products.js';

// Words people type → words in our catalogue
const SYNONYMS = {
  comforter: 'duvet', quilt: 'duvet', blanket: 'duvet',
  'power strip': 'extension', 'multi plug': 'extension', adapter: 'adapter',
  light: 'lamp', lights: 'lamp', lighting: 'lamp', bulb: 'lamp',
  organizer: 'organiser', organisers: 'organiser', cookware: 'pan', pans: 'pan',
  towel: 'towels', kettles: 'kettle', lamps: 'lamp', boxes: 'box',
  xmas: 'christmas', fairy: 'strip',
  // furniture
  chairs: 'chair', sofa: 'armchair', bookcase: 'bookshelf', bookcases: 'bookshelf', shelves: 'shelving', tables: 'table',
  // fashion (US → UK)
  dresses: 'dress', frock: 'dress', gown: 'dress',
  sneakers: 'trainers', sneaker: 'trainers', shoes: 'trainers', sweater: 'jumper', pullover: 'jumper',
  puffer: 'down', parka: 'jacket', coats: 'coat', jackets: 'jacket', tshirt: 'tee', tees: 'tee', purse: 'bag', handbag: 'bag',
  // food
  choc: 'chocolate', chocolates: 'chocolate', candy: 'sweets', ramen: 'noodles', snack: 'snacks', beans: 'beans',
  // electronics
  earphones: 'earbuds', airpods: 'earbuds', headset: 'headphones', charger: 'charger', powerbank: 'power',
  // beauty / travel
  sunblock: 'sunscreen', suncream: 'sunscreen', luggage: 'suitcase', carryon: 'cabin',
};

const STOP = new Set(['the', 'a', 'an', 'for', 'with', 'and', 'of', 'to', 'in', '&', '-', '—']);
export const tokenize = (s) => s.toLowerCase().replace(/[^a-z0-9.\s-]/g, ' ').split(/[\s-]+/).filter((w) => w && !STOP.has(w));

// Build index: term -> Map(productId -> weight)
const INDEX = new Map();
function add(term, id, w) {
  if (!INDEX.has(term)) INDEX.set(term, new Map());
  const m = INDEX.get(term);
  m.set(id, (m.get(id) || 0) + w);
}
for (const p of PRODUCTS) {
  const cat = CATEGORIES.find((c) => c.id === p.category);
  tokenize(p.name).forEach((t) => add(t, p.id, 3));
  p.tags.forEach((tag) => tokenize(tag).forEach((t) => add(t, p.id, 2)));
  tokenize(cat.name).forEach((t) => add(t, p.id, 1.5));
  tokenize(p.material).forEach((t) => add(t, p.id, 0.5));
  tokenize(p.seller).forEach((t) => add(t, p.id, 0.5));
  if (p.brand) tokenize(p.brand).forEach((t) => add(t, p.id, 2));
  if (p.sub) tokenize(p.sub).forEach((t) => add(t, p.id, 1.5));
}
const TERMS = [...INDEX.keys()];

function editDistance1(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

// Returns [{product, score, matched:[terms]}], plus `corrected` if a typo fix was used
export function search(query) {
  let q = query.toLowerCase().trim();
  for (const [k, v] of Object.entries(SYNONYMS)) if (k.includes(' ') && q.includes(k)) q = q.replace(k, v);
  const words = tokenize(q).map((w) => SYNONYMS[w] || w);
  const scores = new Map();
  const corrections = [];
  for (const w of words) {
    let hits = TERMS.filter((t) => t === w);
    let weight = 1;
    if (!hits.length) { hits = TERMS.filter((t) => t.startsWith(w) && w.length >= 2); weight = 0.8; }
    if (!hits.length && w.length >= 4) {
      hits = TERMS.filter((t) => editDistance1(w, t));
      weight = 0.6;
      if (hits.length) corrections.push([w, hits[0]]);
    }
    for (const t of hits) for (const [id, s] of INDEX.get(t)) scores.set(id, (scores.get(id) || 0) + s * weight);
  }
  const results = [...scores.entries()]
    .map(([id, score]) => ({ product: PRODUCTS.find((p) => p.id === id), score }))
    .sort((a, b) => b.score - a.score || b.product.sold - a.product.sold);
  let corrected = null;
  if (corrections.length) corrected = corrections.reduce((s, [from, to]) => s.replace(from, to), query.toLowerCase());
  return { results, corrected };
}

// Autocomplete: tag phrases + product names that contain the typed prefix
const PHRASES = [...new Set(PRODUCTS.flatMap((p) => [...p.tags, p.name.toLowerCase(), ...(p.brand ? [p.brand.toLowerCase()] : [])]))];
export function suggest(prefix, limit = 7) {
  const q = prefix.toLowerCase().trim();
  if (!q) return [];
  const starts = PHRASES.filter((s) => s.startsWith(q));
  const contains = PHRASES.filter((s) => !s.startsWith(q) && s.includes(q));
  return [...starts.sort((a, b) => a.length - b.length), ...contains].slice(0, limit);
}
