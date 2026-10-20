// Builds the review list for a product: hand-written reviews (data/products.js)
// plus generated ones whose tone follows the product's rating and aspect scores.
import { CUSTOM_REVIEWS } from '../data/products.js';

const NAMES = ['Sophie', 'James', 'Olivia', 'Harry', 'Emily', 'Jack', 'Amelia', 'Oliver', 'Chloe', 'George', 'Megan', 'Daniel', 'Ruby', 'Sam', 'Lucy', 'Ben', 'Zara', 'Ethan', 'Grace', 'Liam'];
const TOWNS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Sheffield', 'Bristol', 'Nottingham', 'Leicester', 'Edinburgh', 'Cardiff', 'Belfast', 'York', 'Oxford'];

const GOOD = [
  ['Exactly the size stated — fits perfectly.', 'Size accurate'],
  ['Looks just like the photos. Really pleased.', 'As pictured'],
  ['Great quality for the price, feels sturdy.', 'Good quality'],
  ['Arrived earlier than expected and well packed.', 'Fast delivery'],
  ['Bought two more for the guest room. Brilliant value.', 'Great value'],
  ['Easy to set up, no instructions needed.', 'Easy setup'],
];
const MIXED = [
  ['Decent for the money, colour slightly lighter than the photo.', 'Not as pictured'],
  ['Does the job, but packaging was a bit crushed.', 'Packaging'],
  ['Good but took a while to arrive.', 'Slow delivery'],
];
const BAD = [
  ['Smaller than I expected — check the measurements.', 'Size mismatch'],
  ['Quality is not great, stitching came loose after a week.', 'Quality issue'],
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
    const pool = stars >= 4 ? GOOD : stars === 3 ? MIXED : BAD;
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
