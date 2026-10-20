// Builds the review list for a product: hand-written reviews (data/products.js)
// plus generated ones whose tone follows the product's rating and aspect scores.
import { CUSTOM_REVIEWS } from '../data/products.js';

const NAMES = ['Sophie', 'James', 'Olivia', 'Harry', 'Emily', 'Jack', 'Amelia', 'Oliver', 'Chloe', 'George', 'Megan', 'Daniel', 'Ruby', 'Sam', 'Lucy', 'Ben', 'Zara', 'Ethan', 'Grace', 'Liam'];
const TOWNS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Sheffield', 'Bristol', 'Nottingham', 'Leicester', 'Edinburgh', 'Cardiff', 'Belfast', 'York', 'Oxford'];

const GOOD = [
  ['Exactly as described — really happy with it.', 'As described'],
  ['Looks just like the photos. Really pleased.', 'As pictured'],
  ['Great quality for the price, feels sturdy.', 'Good quality'],
  ['Arrived earlier than expected and well packed.', 'Fast delivery'],
  ['Brilliant value — bought another one as a gift.', 'Great value'],
  ['Easy to set up, no instructions needed.', 'Easy setup'],
];
// Extra praise that only makes sense in one category
const CAT_GOOD = {
  fashion: [['True to size and the fabric feels premium.', 'Size accurate'], ['Wore it all week — so comfortable.', 'Comfortable']],
  food: [['Tastes amazing, will definitely reorder.', 'Great taste'], ['Arrived fresh with a long best-before date.', 'Fresh']],
  beauty: [['My skin feels so much softer after a week.', 'Works well'], ['No irritation at all on sensitive skin.', 'Gentle']],
  electronics: [['Works perfectly straight out of the box.', 'Works well'], ['Feels premium for the price.', 'Great value']],
  sports: [['Used it at the gym every day, holding up well.', 'Durable']],
  travel: [['Took it on three trips already, no problems.', 'Durable']],
};
const MIXED = [
  ['Decent for the money, but not quite like the photos.', 'Not as pictured'],
  ['Does the job, but packaging was a bit crushed.', 'Packaging'],
  ['Good but took a while to arrive.', 'Slow delivery'],
];
const BAD = [
  ['Smaller than I expected — check the measurements.', 'Size mismatch'],
  ['Quality is not great for the price — expected better.', 'Quality issue'],
];

// small deterministic random so reviews stay the same on every load
function rng(seed) {
  let s = [...seed].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function getReviews(p) {
  const r = rng(p.id);
  const list = (CUSTOM_REVIEWS[p.id] || []).map((x, i) => ({ ...x, id: p.id + 'c' + i, daysAgo: 3 + i * 4, helpful: 20 + i * 7, verified: true }));
  for (let i = 0; i < 9; i++) {
    const roll = r() * 5;
    const stars = roll < p.rating - 0.6 ? 5 : roll < p.rating ? 4 : roll < p.rating + 0.4 ? 3 : 2;
    // 'Easy to set up' only makes sense for things you assemble or plug in
    const good = [...(CAT_GOOD[p.category] || []), ...(['fashion', 'food', 'beauty'].includes(p.category) ? GOOD.slice(0, 5) : GOOD)];
    const pool = stars >= 4 ? good : stars === 3 ? MIXED : BAD;
    const [text, tag] = pool[Math.floor(r() * pool.length)];
    list.push({
      id: p.id + 'g' + i,
      name: NAMES[Math.floor(r() * NAMES.length)] + ' ' + String.fromCharCode(65 + Math.floor(r() * 26)) + '.',
      town: TOWNS[Math.floor(r() * TOWNS.length)],
      stars, text, tags: [tag],
      photo: r() < 0.35,
      daysAgo: Math.floor(r() * 60) + 1,
      helpful: Math.floor(r() * 40),
      verified: r() < 0.9,
    });
  }
  return list.sort((a, b) => b.helpful - a.helpful);
}

export function starBreakdown(p) {
  // derive a plausible 5→1 distribution from the average rating
  const five = Math.min(0.9, Math.max(0.3, (p.rating - 3.2) / 1.8));
  const rest = 1 - five;
  return [five, rest * 0.55, rest * 0.22, rest * 0.12, rest * 0.11].map((x) => Math.round(x * 100));
}
