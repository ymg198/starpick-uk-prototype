// Blueprints for every base product: which drawing to use, plus words for generating
// similar listings from other (fictional) sellers — so each search keyword returns 10+ results.
// All brand and shop names here are invented.

export const BLUEPRINTS = {
  f1: { shape: 'trainer', core: 'Running Trainers', mods: ['Lightweight', 'Breathable Mesh', 'Cushioned', 'Women’s', 'Men’s', 'Wide-Fit', 'Trail', 'Everyday'], specs: ['2026 Edition', 'Reflective', 'Slip-Resistant', 'Memory Foam Insole'] },
  f2: { shape: 'jacket', core: 'Puffer Jacket', mods: ['Packable', 'Hooded', 'Longline', 'Lightweight', 'Water-Resistant', 'Cropped', 'Quilted'], specs: ['Recycled Fill', 'Women’s', 'Men’s', 'Winter 2026'] },
  f3: { shape: 'jumper', core: 'Knit Jumper', mods: ['Merino Blend', 'Chunky', 'Cable Knit', 'Crew Neck', 'Oversized', 'Lambswool', 'Fine-Gauge'], specs: ['Unisex', 'Women’s', 'Men’s', 'Soft Touch'] },
  f4: { shape: 'tee', core: 'Cotton T-Shirt', mods: ['Heavyweight', 'Organic', 'Oversized', 'Slim-Fit', 'Everyday', 'Pima'], specs: ['3-Pack', '5-Pack', '2-Pack', 'Crew Neck'] },
  f5: { shape: 'tote', core: 'Tote Bag', mods: ['Vegan Leather', 'Structured', 'Laptop', 'Canvas', 'Mini', 'Woven'], specs: ['with Zip Pocket', '14" Laptop', 'Work Bag', 'Gift Boxed'] },
  f6: { shape: 'leggings', core: 'Leggings', mods: ['Fleece-Lined', 'High-Waisted', 'Thermal', 'Seamless', 'Squat-Proof', 'Ribbed'], specs: ['2-Pack', 'with Pockets', 'Women’s', 'Petite'] },
  d1: { shape: 'coffeebag', core: 'Coffee Beans', mods: ['Single-Origin', 'Dark Roast', 'Espresso', 'Medium Roast', 'Organic', 'Swiss Water Decaf', 'Smooth Blend'], specs: ['1 kg', '500 g', '250 g', 'Freshly Roasted'] },
  d2: { shape: 'chocbox', core: 'Chocolate Selection Box', mods: ['Belgian', 'Luxury', 'Dark', 'Milk', 'Salted Caramel', 'Truffle'], specs: ['500 g', '250 g', 'Gift Box', '24 Pieces'] },
  d3: { shape: 'tin', core: 'Matcha Powder', mods: ['Ceremonial', 'Culinary', 'Organic', 'Premium', 'Barista'], specs: ['100 g', '50 g', '30 g Tin', 'Stone-Ground'] },
  d4: { shape: 'pouch', core: 'Mixed Nuts', mods: ['Unsalted', 'Roasted', 'Trail Mix', 'Fruit & Nut', 'Protein', 'Honey-Roasted'], specs: ['1 kg', '500 g', 'Resealable Pouch', 'Snack Packs'] },
  d5: { shape: 'noodles', core: 'Instant Noodles', mods: ['Spicy', 'Asian Variety', 'Miso', 'Kimchi', 'Tonkotsu-Style', 'Vegan'], specs: ['12-Pack', '6-Pack', '24-Pack', 'Cup Noodles'] },
  l1: { shape: 'tablelamp', core: 'Bedside Lamp', mods: ['Touch', 'Dimmable', 'Linen Shade', 'USB Charging', 'Mushroom', 'Ceramic'], specs: ['UK Plug', 'Set of 2', 'Warm White', 'Bulb Included'] },
  l2: { shape: 'desklamp', core: 'Desk Lamp', mods: ['LED', 'Swing-Arm', 'Architect', 'Clamp', 'Eye-Care', 'Folding'], specs: ['5 Colour Modes', 'USB Port', 'Dimmable', 'Study Lamp'] },
  l3: { shape: 'ledstrip', core: 'LED Strip Lights', mods: ['RGB', 'Smart', 'Music Sync', 'Warm White', 'Neon Flex', 'Fairy'], specs: ['5 m', '10 m', 'App Control', 'USB Powered'] },
  s1: { shape: 'storagebag', core: 'Under-Bed Storage Bags', mods: ['Large', 'Foldable', 'Zip-Top', 'Clear Window', 'Heavy-Duty', 'Vacuum'], specs: ['2-Pack', '3-Pack', '4-Pack', '100 L'] },
  s2: { shape: 'storagebox', core: 'Storage Box', mods: ['Under-Bed', 'Clear', 'Stackable', 'Rolling', 'Lidded', 'Slim'], specs: ['with Wheels', '45 L', '3-Pack', 'Clip Lid'] },
  s3: { shape: 'cubes', core: 'Storage Cubes', mods: ['Foldable Fabric', 'Felt', 'Linen-Look', 'Collapsible', 'Woven'], specs: ['6-Pack', '4-Pack', '30 cm', 'with Handles'] },
  b1: { shape: 'duvet', core: 'Duvet', mods: ['10.5 Tog', '13.5 Tog', '4.5 Tog Summer', 'All-Season', 'Hotel Quality', 'Hollowfibre'], specs: ['Double', 'King', 'Single', 'Super King'] },
  b2: { shape: 'bedding', core: 'Bedding Set', mods: ['Cotton', 'Brushed Cotton', 'Linen-Blend', 'Percale', 'Seersucker', 'Jersey'], specs: ['Double', 'King', 'Single', 'with Pillowcases'] },
  h1: { shape: 'towels', core: 'Towel Set', mods: ['Quick-Dry', 'Egyptian Cotton', 'Waffle', 'Bamboo', 'Hotel', 'Super-Soft'], specs: ['6 pcs', '4 pcs', '8 pcs', '600 gsm'] },
  h3: { shape: 'bathmat', core: 'Bath Mat', mods: ['Memory Foam', 'Non-Slip', 'Diatomite', 'Chenille', 'Quick-Dry', 'Shaggy'], specs: ['80 × 50 cm', '2-Piece Set', 'Machine Washable', 'Extra Large'] },
  k1: { shape: 'kettle', core: 'Electric Kettle', mods: ['Rapid Boil', 'Quiet Boil', 'Stainless Steel', 'Matte', 'Cordless', 'Retro'], specs: ['1.7 L', '1.5 L', '3 kW', 'UK Plug'] },
  k2: { shape: 'glasskettle', core: 'Glass Kettle', mods: ['LED', 'Borosilicate', 'Temperature Control', 'Tea Infuser', 'Cordless'], specs: ['1.8 L', '1.7 L', 'Keep Warm', 'Blue Light'] },
  k3: { shape: 'pans', core: 'Frying Pan Set', mods: ['Non-Stick', 'Ceramic', 'Stainless Steel', 'Granite', 'Induction', 'Hard-Anodised'], specs: ['3 pcs', '2 pcs', '20/24/28 cm', 'PFAS-Free'] },
  k4: { shape: 'containers', core: 'Food Containers', mods: ['Airtight', 'Glass', 'Stackable', 'Meal Prep', 'Pantry', 'Leak-Proof'], specs: ['10-Pack', '6-Pack', '24-Piece', 'with Labels'] },
  e4: { shape: 'headphones', core: 'Wireless Headphones', mods: ['Noise Cancelling', 'Over-Ear', 'Bluetooth 5.3', 'Studio', 'Foldable', 'Kids’'], specs: ['40 h Battery', 'with Mic', 'Hi-Res Audio', 'Travel Case'] },
  e5: { shape: 'earbuds', core: 'Wireless Earbuds', mods: ['True Wireless', 'Sport', 'Noise Cancelling', 'Open-Ear', 'Mini', 'Bluetooth 5.3'], specs: ['IPX5', '30 h Playtime', 'Touch Control', 'Wireless Charging'] },
  e6: { shape: 'watch', core: 'Smartwatch', mods: ['Fitness', 'AMOLED', 'GPS', 'Slim', 'Rugged', 'Women’s'], specs: ['Heart Rate', '10-Day Battery', 'Sleep Tracking', '1.9" Screen'] },
  e7: { shape: 'powerbank', core: 'Power Bank', mods: ['Slim', 'Magnetic', 'Fast-Charge', 'Mini', 'Solar', 'Laptop'], specs: ['10,000 mAh', '20,000 mAh', '5,000 mAh', '20 W PD'] },
  e1: { shape: 'extension', core: 'Extension Lead', mods: ['4-Way', '6-Way', 'Surge-Protected', 'Flat Plug', 'Desk', 'Smart'], specs: ['with USB', '2 m', '3 m', 'UK Plug'] },
  e3: { shape: 'charger', core: 'USB-C Charger', mods: ['65W GaN', '30W', '100W GaN', 'Dual-Port', 'Compact', 'Fast'], specs: ['UK Plug', 'Foldable Pins', 'for Laptop', '3-Port'] },
  y1: { shape: 'serum', core: 'Face Serum', mods: ['Hyaluronic', 'Vitamin C', 'Niacinamide', 'Retinol', 'Peptide', 'Brightening'], specs: ['30 ml', '50 ml', 'Fragrance-Free', 'Dropper Bottle'] },
  y2: { shape: 'tube', core: 'Sunscreen', mods: ['SPF 50', 'SPF 30', 'Tinted', 'Mineral', 'Daily', 'Sport'], specs: ['50 ml', '100 ml', 'Invisible Finish', 'Sensitive Skin'] },
  y3: { shape: 'styler', core: 'Hot Air Styler', mods: ['One-Step', 'Ionic', 'Volumising', 'Round Brush', 'Cordless', 'Compact'], specs: ['1000 W', 'UK Plug', '3 Heat Settings', 'Travel Size'] },
  p1: { shape: 'yogamat', core: 'Yoga Mat', mods: ['Non-Slip', 'Extra Thick', 'Natural Rubber', 'TPE', 'Foldable', 'Alignment'], specs: ['6 mm', '10 mm', '183 × 61 cm', 'with Strap'] },
  p2: { shape: 'dumbbells', core: 'Dumbbells', mods: ['Adjustable', 'Neoprene', 'Hex', 'Spin-Lock', 'Chrome', 'Vinyl'], specs: ['2 × 10 kg', '2 × 5 kg', '2 × 3 kg', 'Set with Rack'] },
  p3: { shape: 'bottle', core: 'Water Bottle', mods: ['Insulated', 'Stainless Steel', 'Leak-Proof', 'Sports', 'Kids’', 'Motivational'], specs: ['750 ml', '500 ml', '1 L', 'with Straw Lid'] },
  t1: { shape: 'suitcase', core: 'Cabin Suitcase', mods: ['Hard-Shell', 'Lightweight', 'Expandable', 'Spinner', 'Front-Pocket', 'Polycarbonate'], specs: ['55 cm', '55 × 40 × 20 cm', 'TSA Lock', 'Carry-On'] },
  t2: { shape: 'phonemount', core: 'Car Phone Holder', mods: ['Magnetic', 'Vent', 'Dashboard', 'Wireless Charging', 'Windscreen', 'Clamp'], specs: ['360° Rotation', 'One-Hand', 'Universal', 'Strong Grip'] },
  t3: { shape: 'adapter', core: 'Travel Adapter', mods: ['Universal', 'UK to EU', 'UK to US', 'Worldwide', 'Compact', 'Fast-Charge'], specs: ['with USB-C', '2-Pack', '150+ Countries', 'Fused'] },
  t4: { shape: 'packingcubes', core: 'Packing Cubes', mods: ['Compression', 'Lightweight', 'Mesh', 'Waterproof', 'Shoe', 'Travel'], specs: ['6-Pack', '4-Pack', '8-Piece Set', 'Ripstop'] },
};

// Invented brand names (marked as official stores) and ordinary shop names, per category
const BRANDS = {
  fashion: ['Velora', 'Kinsley & Fox', 'Oakmere', 'Harlowe', 'Atlas Run'],
  food: ['Brewlane', 'Copperleaf', 'Fernhill Pantry', 'Kumo Kitchen'],
  home: ['Nestwell', 'Lumen & Loom', 'Haven Row', 'Duskwood'],
  kitchen: ['Kettlewick', 'Stonebake', 'Panworth'],
  electronics: ['Pulsewave', 'Zentro', 'Arcbeam', 'Volterra'],
  beauty: ['Petal & Pearl', 'Dewlab', 'Siena Skin', 'Lumea'],
  sports: ['Peakform', 'Tempo Athletic', 'Gritline'],
  travel: ['Roamly', 'Jetlane', 'Transit & Co'],
};
const SHOPS = {
  fashion: ['Daily Wardrobe', 'Urban Thread', 'Style Hub UK', 'Cosy Closet', 'Northgate Apparel', 'Basics Depot'],
  food: ['Pantry Market', 'Snack Street', 'Good Grocer', 'Bean & Leaf Co', 'Sweet Corner'],
  home: ['HomeCube', 'TidyNest', 'Cosy Corner Home', 'Brightway', 'Simple Living'],
  kitchen: ['Kitchenly UK', 'Cook & Co Store', 'FreshKeep', 'Chef Supply'],
  electronics: ['Voltix', 'PlugSafe UK', 'Gadget Garage', 'TechNest', 'Spark Digital'],
  beauty: ['Glowlab', 'Beauty Edit', 'Skin Shelf', 'Pure Bloom'],
  sports: ['IronCore', 'Trailmate', 'Active Base', 'FitKit Store'],
  travel: ['Jetset Luggage', 'Travel Smart', 'Roadside Gear', 'Wander Store'],
};
const PALETTE = ['Black', 'White', 'Grey', 'Navy', 'Sage', 'Pink', 'Sky', 'Beige', 'Charcoal', 'Lilac', 'Coral', 'Forest', 'Cream', 'Silver'];

function rng(seed) {
  let s = [...seed].reduce((a, c) => a * 31 + c.charCodeAt(0), 11) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const round99 = (n) => Math.max(1.99, Math.round(n) - 0.01);

// Builds `count` extra listings for each base product.
export function generateVariants(bases, count = 9) {
  const out = [];
  for (const base of bases) {
    const bp = BLUEPRINTS[base.id];
    if (!bp) continue;
    base.shape = bp.shape;
    const r = rng(base.id + 'v');
    const usedNames = new Set([base.name]);
    for (let i = 0; i < count; i++) {
      const official = r() < 0.28;
      const brand = official ? pick(r, BRANDS[base.category]) : null;
      const mod = bp.mods[(i + Math.floor(r() * 3)) % bp.mods.length];
      const spec = r() < 0.75 ? bp.specs[Math.floor(r() * bp.specs.length)] : '';
      let name = `${brand ? brand + ' ' : ''}${mod} ${bp.core}${spec ? ' — ' + spec : ''}`;
      if (usedNames.has(name)) name += ` (${['New', 'Plus', 'Pro', 'Lite', 'Max'][i % 5]})`;
      usedNames.add(name);
      const priceF = official ? 1.05 + r() * 0.7 : 0.5 + r() * 0.75;
      const price = round99(base.price * priceF) + (base.price < 10 ? 0 : 0);
      const was = round99(price * (1.25 + r() * 0.6));
      const rating = Math.round((official ? 4.5 + r() * 0.4 : 3.9 + r() * 0.85) * 10) / 10;
      const reviews = Math.round(base.reviews * (0.05 + r() * 0.6));
      const sold = Math.round(reviews * (6 + r() * 6));
      const warehouse = official ? 'UK' : r() < 0.4 ? 'UK' : 'CN';
      const nColors = base.colors.length ? Math.max(1, Math.min(4, base.colors.length + Math.floor(r() * 3) - 1)) : 0;
      const colors = nColors ? [...new Set([base.colors[0], ...Array.from({ length: nColors }, () => pick(r, PALETTE))])].slice(0, nColors) : [];
      const a = (v) => Math.max(62, Math.min(98, Math.round(v + (r() - 0.5) * 16 + (official ? 4 : -2))));
      const variant = {
        ...base,
        id: `${base.id}v${i + 1}`,
        base: base.id,
        variant: true,
        name,
        brand: brand || undefined,
        official,
        featured: false,
        seller: brand ? `${brand} Official Store` : pick(r, SHOPS[base.category]),
        price, was, rating, reviews, sold,
        weekSold: Math.round(sold / (14 + r() * 10)),
        warehouse,
        colors,
        aspects: { size: a(base.aspects.size), photo: a(base.aspects.photo), quality: a(base.aspects.quality) },
        returns: warehouse === 'UK'
          ? { free: true, days: 30, method: 'Drop off at Evri or InPost locker' }
          : price < 10 ? { free: true, days: 15, method: 'Refund only — keep the item (under £10)' } : { free: false, days: 15, method: 'Return to seller warehouse, £3.99 label' },
        desc: base.desc,
        sizeNote: undefined,
      };
      // electricals from overseas sellers sometimes ship with an EU plug — part of the demo story
      if (base.plug === 'UK' && warehouse === 'CN' && r() < 0.45) {
        variant.plug = 'EU';
        variant.safety = ['CE'];
      }
      out.push(variant);
    }
  }
  return out;
}
