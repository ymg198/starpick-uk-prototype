// Vector product drawings used to build merchant images and buyer photos.
// Every drawing fits a 400 × 400 box, product roughly centred around (200, 205), resting on y ≈ 330.
// draw(shape, ctx, colour) → SVG markup; ctx.grad() registers gradients in the image's <defs>.

// ---------- colour helpers ----------
export const COLOR_HEX = {
  Black: '#2b2b2f', White: '#f4f4f2', Grey: '#9a9ca3', 'Grey marl': '#b6b8bb', Navy: '#26345a', Olive: '#6b7040',
  Oatmeal: '#d9ccb2', Oat: '#d8cbb3', Charcoal: '#47494f', Forest: '#2f5d46', Tan: '#b47a48', Volt: '#c6ee4a',
  Sage: '#a7bba0', Beige: '#d9c9ad', Cream: '#eee5d1', Brass: '#c9a14a', Silver: '#c9cdd3', 'Matte Black': '#2f3034',
  Graphite: '#4b4d54', 'Midnight Blue': '#22305a', Pink: '#f3a8be', 'Rose Gold': '#e3b3a1', Lilac: '#c4b2e2',
  Sky: '#8ccaee', Coral: '#f08d78', Blush: '#efc6c4', Clear: '#dbe7ee', RGB: '#7c6cf0', Granite: '#5a5c62',
  Oak: '#c49a6c', Burgundy: '#7a2638', Red: '#d8423c', Blue: '#3b6fd8', Green: '#4f9a5b', Brown: '#7a5233', Purple: '#8d6ad8', Yellow: '#f2c94c',
};
export const hex = (name, fallback = '#8e9eff') => COLOR_HEX[name] || (name && name.startsWith('#') ? name : fallback);

export function shade(h, amt) {
  const n = parseInt(h.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const isLight = (h) => { const n = parseInt(h.slice(1), 16); return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11) > 170; };

// ---------- drawing context ----------
export function makeCtx(prefix) {
  let n = 0;
  const defs = [];
  return {
    defs,
    // linear gradient, vertical by default
    grad(stops, x2 = 0, y2 = 1) {
      const id = `${prefix}g${n++}`;
      defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join('')}</linearGradient>`);
      return `url(#${id})`;
    },
    radial(stops, cx = 0.5, cy = 0.5, r = 0.5) {
      const id = `${prefix}g${n++}`;
      defs.push(`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join('')}</radialGradient>`);
      return `url(#${id})`;
    },
  };
}
// metal/plastic body: light edge → colour → darker edge (horizontal)
const body = (ctx, c) => ctx.grad([[0, shade(c, 0.25)], [0.45, c], [1, shade(c, -0.3)]], 1, 0);
const vbody = (ctx, c) => ctx.grad([[0, shade(c, 0.2)], [1, shade(c, -0.25)]]);
const line = (c) => (isLight(c) ? shade(c, -0.25) : shade(c, 0.2));

// ---------- drawings ----------
const D = {
  trainer(ctx, c) {
    const up = body(ctx, c), sole = ctx.grad([[0, '#ffffff'], [1, '#dcdcdc']]);
    return `<path d="M60 268c0-26 18-44 44-50l58-14 34-40c10-12 30-14 44-4l60 44c14 10 32 16 50 18l16 2c12 2 20 12 20 24v20H60z" fill="${up}"/>
      <path d="M52 286c0-10 8-18 18-18h292c10 0 18 8 18 18v6c0 14-12 26-26 26H78c-14 0-26-12-26-26z" fill="${sole}" stroke="#cfcfcf"/>
      <path d="M60 300h320" stroke="#bdbdbd" stroke-width="3"/>
      <path d="M196 170l70 50M186 186l70 48M176 200l66 46" stroke="${line(c)}" stroke-width="5" stroke-linecap="round"/>
      <path d="M232 160l26 18" stroke="${isLight(c) ? '#888' : '#fff'}" stroke-width="7" stroke-linecap="round" opacity=".7"/>
      <path d="M300 236c22 4 44 6 64 14" stroke="${shade(c, 0.35)}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M86 240c40-10 90-8 130 6" stroke="${shade(c, -0.35)}" stroke-width="4" fill="none" opacity=".5"/>`;
  },
  jacket(ctx, c) {
    const f = body(ctx, c), dk = shade(c, -0.28);
    let quilts = '';
    for (let y = 120; y < 320; y += 30) quilts += `<path d="M118 ${y}q82 10 164 0" stroke="${dk}" stroke-width="3" fill="none" opacity=".7"/>`;
    return `<path d="M150 70c10-16 90-16 100 0l20 22 46 26c18 10 28 30 30 50l8 140c0 10-8 16-18 16h-24l-6-150v158H118V174l-6 150H88c-10 0-18-6-18-16l8-140c2-20 12-40 30-50l46-26z" fill="${f}"/>
      ${quilts}
      <path d="M200 92v240" stroke="${dk}" stroke-width="4"/><path d="M200 92v240" stroke="${shade(c, 0.4)}" stroke-width="1.5" stroke-dasharray="3 4"/>
      <path d="M150 70c12 26 88 26 100 0" fill="${shade(c, -0.15)}"/>
      <rect x="196" y="96" width="8" height="18" rx="3" fill="#d9d9d9"/>`;
  },
  jumper(ctx, c) {
    const f = body(ctx, c), dk = shade(c, -0.22);
    let knit = '';
    for (let x = 130; x <= 270; x += 14) knit += `<path d="M${x} 110v200" stroke="${dk}" stroke-width="2" opacity=".35" stroke-dasharray="6 4"/>`;
    return `<path d="M160 76h80l34 14 50 30c14 8 22 24 24 40l14 132c1 10-6 18-16 18h-22l-14-136v152H126V174l-14 136H90c-10 0-17-8-16-18l14-132c2-16 10-32 24-40l50-30z" fill="${f}"/>
      ${knit}
      <path d="M160 76c8 22 72 22 80 0" fill="none" stroke="${dk}" stroke-width="10"/>
      <rect x="126" y="292" width="148" height="18" fill="${dk}" opacity=".6"/>
      <rect x="74" y="284" width="38" height="12" rx="3" fill="${dk}" opacity=".6"/><rect x="288" y="284" width="38" height="12" rx="3" fill="${dk}" opacity=".6"/>`;
  },
  tee(ctx, c) {
    const tee = (dx, dy, col) => `<g transform="translate(${dx} ${dy})"><path d="M150 90h100l60 34-24 46-30-14v134H144V156l-30 14-24-46z" fill="${body(ctx, col)}"/>
      <path d="M170 90c6 18 54 18 60 0" fill="none" stroke="${shade(col, -0.2)}" stroke-width="6"/></g>`;
    return tee(-40, 20, shade(c, -0.15)) + tee(40, 10, shade(c, 0.25)) + tee(0, 0, c);
  },
  tote(ctx, c) {
    const f = body(ctx, c), dk = shade(c, -0.3);
    return `<path d="M150 150c0-60 100-60 100 0" stroke="${dk}" stroke-width="12" fill="none"/>
      <path d="M110 150h180l26 170c1 8-5 14-13 14H97c-8 0-14-6-13-14z" fill="${f}"/>
      <path d="M118 162h164" stroke="${shade(c, 0.3)}" stroke-width="2" stroke-dasharray="5 5"/>
      <path d="M100 318h200" stroke="${shade(c, 0.25)}" stroke-width="2" stroke-dasharray="5 5"/>
      <rect x="182" y="180" width="36" height="22" rx="4" fill="${shade(c, -0.15)}"/><circle cx="200" cy="191" r="4" fill="#d8c08a"/>`;
  },
  leggings(ctx, c) {
    const f = body(ctx, c);
    return `<path d="M140 70h120l8 40-10 220h-46l-12-180-12 180h-46l-10-220z" fill="${f}"/>
      <rect x="140" y="70" width="120" height="22" fill="${shade(c, -0.2)}"/>
      <path d="M200 120v30" stroke="${shade(c, 0.2)}" stroke-width="3"/>`;
  },
  dress(ctx, c) {
    const f = body(ctx, c), dk = shade(c, -0.25);
    return `<path d="M170 64h60l14 18 22 10-8 46-20-6 4 28-16 18 62 152c4 8-2 16-10 16H122c-8 0-14-8-10-16l62-152-16-18 4-28-20 6-8-46 22-10z" fill="${f}"/>
      <path d="M170 64l30 70 30-70" fill="none" stroke="${dk}" stroke-width="4"/>
      <path d="M150 178h100" stroke="${dk}" stroke-width="7" stroke-linecap="round"/>
      <path d="M238 180c14 10 18 30 10 46" stroke="${dk}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M200 184l-46 146M214 196l18 134" stroke="${shade(c, 0.25)}" stroke-width="2" opacity=".7"/>`;
  },
  knitdress(ctx, c) {
    const f = body(ctx, c), dk = shade(c, -0.22);
    let rib = '';
    for (let x = 150; x <= 250; x += 10) rib += `<path d="M${x} 120L${x + (x - 200) * 0.25} 318" stroke="${dk}" stroke-width="2" opacity=".35"/>`;
    return `<path d="M176 60h48v22l30 12 46 30c10 8 14 20 14 32l4 110c0 8-6 14-14 14h-12l-12-122 4 172c0 8-6 12-14 12H130c-8 0-14-4-14-12l4-172-12 122H96c-8 0-14-6-14-14l4-110c0-12 4-24 14-32l46-30 30-12z" fill="${f}"/>
      ${rib}
      <rect x="176" y="56" width="48" height="28" rx="6" fill="${dk}" opacity=".65"/>
      <rect x="120" y="306" width="160" height="14" fill="${dk}" opacity=".5"/>`;
  },
  sidetable(ctx, c) {
    const top = ctx.grad([[0, shade(c, 0.2)], [1, shade(c, -0.1)]]), leg = '#2f3034';
    return `<path d="M150 170L118 330M250 170L282 330M200 176v154" stroke="${leg}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="200" cy="168" rx="118" ry="30" fill="${shade(c, -0.25)}"/>
      <ellipse cx="200" cy="158" rx="118" ry="30" fill="${top}"/>
      <path d="M120 156c30 10 70 14 110 10M140 146c30 8 70 10 110 6" stroke="${shade(c, -0.15)}" stroke-width="2" fill="none" opacity=".6"/>
      <ellipse cx="200" cy="300" rx="60" ry="8" fill="none" stroke="${leg}" stroke-width="6"/>`;
  },
  armchair(ctx, c) {
    const f = body(ctx, c), dk = shade(c, -0.25), lt = shade(c, 0.18);
    return `<path d="M118 316l-10 20M282 316l10 20M150 320l-4 14M250 320l4 14" stroke="#8a5a34" stroke-width="9" stroke-linecap="round"/>
      <path d="M126 90c0-20 16-30 36-30h76c20 0 36 10 36 30v130H126z" fill="${f}"/>
      <path d="M150 100v100M200 96v104M250 100v100" stroke="${dk}" stroke-width="3" opacity=".45"/>
      <rect x="96" y="160" width="52" height="150" rx="24" fill="${dk}"/>
      <rect x="252" y="160" width="52" height="150" rx="24" fill="${dk}"/>
      <path d="M130 228c0-14 10-22 24-22h92c14 0 24 8 24 22v26H130z" fill="${lt}"/>
      <rect x="120" y="250" width="160" height="70" rx="14" fill="${f}"/>`;
  },
  bookshelf(ctx, c) {
    const wood = ctx.grad([[0, shade(c, 0.15)], [1, shade(c, -0.15)]]), frame = '#2f3034';
    const books = ['#c8553d', '#26345a', '#e0b04a', '#4f9a5b', '#8d6ad8', '#f4f4f2'];
    let shelves = '';
    [[120, 92], [168, 108], [216, 124], [264, 140], [312, 156]].forEach(([y, w], i) => {
      shelves += `<rect x="${200 - w}" y="${y}" width="${w * 2}" height="10" rx="2" fill="${wood}"/>`;
      if (i < 4) for (let k = 0; k < 3 + (i % 2); k++) shelves += `<rect x="${200 - w + 14 + k * 18}" y="${y - 34 + (k % 2) * 6}" width="14" height="${34 - (k % 2) * 6}" rx="2" fill="${books[(i * 3 + k) % books.length]}"/>`;
      if (i === 1 || i === 3) shelves += `<path d="M${200 + w - 40} ${y}h26l-4-22h-18z" fill="#b5764a"/><circle cx="${200 + w - 27}" cy="${y - 30}" r="14" fill="#4f9a5b"/>`;
    });
    return `<path d="M150 70L100 330M250 70L300 330" stroke="${frame}" stroke-width="8" stroke-linecap="round"/>${shelves}`;
  },
  coffeebag(ctx, c) {
    const f = vbody(ctx, c);
    return `<path d="M128 80h144l10 240c0 8-6 14-14 14H132c-8 0-14-6-14-14z" fill="${f}"/>
      <path d="M128 80l-6-10h156l-6 10z" fill="${shade(c, -0.3)}"/>
      <rect x="138" y="170" width="124" height="110" rx="8" fill="#f6efe2"/>
      <ellipse cx="200" cy="208" rx="18" ry="26" fill="#6b3f22" transform="rotate(-20 200 208)"/><path d="M194 186c12 14 0 30 12 44" stroke="#f6efe2" stroke-width="3" fill="none"/>
      <rect x="160" y="246" width="80" height="6" rx="3" fill="#8a6a4b"/><rect x="172" y="258" width="56" height="5" rx="2.5" fill="#c7b296"/>
      <circle cx="200" cy="120" r="10" fill="${shade(c, -0.25)}"/><circle cx="200" cy="120" r="4" fill="${shade(c, 0.3)}"/>`;
  },
  chocbox(ctx, c) {
    let pr = '';
    const cols = ['#5a3220', '#7a4a2e', '#e9d8bd', '#3f2316', '#a0643d', '#d7b48a'];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) pr += `<circle cx="${132 + k * 46}" cy="${170 + r * 46}" r="18" fill="${cols[(r * 4 + k) % 6]}"/><circle cx="${126 + k * 46}" cy="${164 + r * 46}" r="5" fill="#fff" opacity=".25"/>`;
    return `<rect x="96" y="132" width="208" height="166" rx="10" fill="${shade(c, -0.25)}"/>
      <rect x="104" y="140" width="192" height="150" rx="6" fill="#2d1a12"/>${pr}
      <path d="M96 132l20-58h168l20 58z" fill="${body(ctx, c)}"/><path d="M200 74v58" stroke="#e6c46a" stroke-width="8"/><path d="M116 104h168" stroke="#e6c46a" stroke-width="6"/>`;
  },
  tin(ctx, c) {
    return `<rect x="140" y="110" width="120" height="210" rx="12" fill="${body(ctx, c)}"/>
      <rect x="134" y="96" width="132" height="34" rx="10" fill="${body(ctx, shade(c, -0.2))}"/>
      <rect x="150" y="170" width="100" height="100" rx="8" fill="#f3f0e4"/>
      <path d="M200 190c22 10 26 40 0 60-26-20-22-50 0-60z" fill="#6aa14a"/><path d="M200 196v48" stroke="#f3f0e4" stroke-width="2"/>`;
  },
  pouch(ctx, c) {
    let nuts = '';
    const cols = ['#c58b4f', '#a86a3a', '#e0b27a', '#7c4a2a', '#b23b3b'];
    for (let i = 0; i < 26; i++) nuts += `<ellipse cx="${160 + (i * 37) % 82}" cy="${196 + ((i * 53) % 70)}" rx="9" ry="6" fill="${cols[i % 5]}" transform="rotate(${(i * 47) % 180} ${160 + (i * 37) % 82} ${196 + ((i * 53) % 70)})"/>`;
    return `<path d="M124 96h152l14 222c0 8-6 14-14 14H124c-8 0-14-6-14-14z" fill="${vbody(ctx, c)}"/>
      <rect x="124" y="88" width="152" height="18" rx="4" fill="${shade(c, -0.25)}"/>
      <rect x="148" y="184" width="104" height="96" rx="40" fill="#f7efe1"/>${nuts}
      <rect x="150" y="128" width="100" height="10" rx="5" fill="#fff" opacity=".8"/><rect x="164" y="146" width="72" height="7" rx="3.5" fill="#fff" opacity=".5"/>`;
  },
  noodles(ctx, c) {
    const cup = (x, y, col) => `<g transform="translate(${x} ${y})"><path d="M-46 0h92l-12 92H-34z" fill="${vbody(ctx, col)}"/><ellipse cx="0" cy="0" rx="46" ry="10" fill="${shade(col, 0.4)}"/>
      <path d="M-24 40c8-8 16 8 24 0s16 8 24 0" stroke="#fff" stroke-width="4" fill="none"/><circle cx="0" cy="64" r="10" fill="#fff" opacity=".85"/></g>`;
    return cup(140, 210, '#e2533b') + cup(260, 210, '#f2a53a') + cup(200, 120, c);
  },
  tablelamp(ctx, c) {
    return `<ellipse cx="200" cy="150" rx="150" ry="120" fill="${ctx.radial([[0, '#fff3c4', 0.85], [1, '#fff3c4', 0]])}"/>
      <path d="M140 92h120l34 96H106z" fill="${vbody(ctx, c)}"/>
      <path d="M140 92h120" stroke="${shade(c, -0.2)}" stroke-width="4"/>
      <rect x="194" y="188" width="12" height="110" fill="#b7aa95"/>
      <ellipse cx="200" cy="304" rx="56" ry="14" fill="${shade(c, -0.3)}"/><rect x="144" y="296" width="112" height="10" fill="${shade(c, -0.3)}"/>`;
  },
  desklamp(ctx, c) {
    const f = body(ctx, c);
    return `<ellipse cx="140" cy="312" rx="60" ry="14" fill="${shade(c, -0.25)}"/><rect x="80" y="300" width="120" height="12" fill="${f}"/>
      <path d="M140 300l50-120" stroke="${c}" stroke-width="12" stroke-linecap="round"/><circle cx="190" cy="180" r="10" fill="${shade(c, -0.25)}"/>
      <path d="M190 180l90-60" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
      <path d="M262 108l70 18-20 54-60-34z" fill="${f}"/><ellipse cx="300" cy="170" rx="44" ry="20" fill="#fff6cf" opacity=".9" transform="rotate(30 300 170)"/>`;
  },
  ledstrip(ctx, c) {
    let leds = '';
    const cols = ['#ff5a7a', '#ffb347', '#ffe066', '#5ad17a', '#4fb3ff', '#9b7bff'];
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 4, r = 60 + i * 3.4;
      const x = 200 + Math.cos(a) * r * 0.9, y = 210 + Math.sin(a) * r * 0.55;
      leds += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${cols[i % 6]}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="${cols[i % 6]}" opacity=".25"/>`;
    }
    return `<path d="M${200 + 54} 210 ${Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 4, r = 60 + i * 1.7; return `L${(200 + Math.cos(a) * r * 0.9).toFixed(1)} ${(210 + Math.sin(a) * r * 0.55).toFixed(1)}`; }).join(' ')}" stroke="#e8e8ee" stroke-width="10" fill="none" stroke-linecap="round"/>${leds}
      <rect x="290" y="280" width="50" height="30" rx="6" fill="#2b2b2f"/><circle cx="315" cy="295" r="6" fill="${c}"/>`;
  },
  storagebag(ctx, c) {
    return `<path d="M70 200l130-60 130 60-130 70z" fill="${shade(c, 0.15)}"/>
      <path d="M70 200v40l130 70v-40z" fill="${shade(c, -0.15)}"/><path d="M330 200v40l-130 70v-40z" fill="${shade(c, -0.3)}"/>
      <path d="M120 200l80-36 80 36-80 42z" fill="#e9f1f6" opacity=".85"/>
      <path d="M78 204l122 62 122-62" stroke="${shade(c, -0.4)}" stroke-width="3" fill="none" stroke-dasharray="6 4"/>
      <rect x="250" y="250" width="40" height="10" rx="5" fill="${shade(c, -0.45)}" transform="rotate(-28 270 255)"/>`;
  },
  storagebox(ctx, c) {
    return `<path d="M80 170h240v120c0 8-6 14-14 14H94c-8 0-14-6-14-14z" fill="#dbe7ee" opacity=".75"/>
      <path d="M80 170h240" stroke="#9fb3c2" stroke-width="3"/>
      <rect x="70" y="150" width="260" height="26" rx="8" fill="${body(ctx, '#7f95a6')}"/>
      <rect x="110" y="200" width="80" height="60" rx="6" fill="#f2c6b0" opacity=".7"/><rect x="200" y="216" width="90" height="44" rx="6" fill="#a9c7e8" opacity=".7"/>
      <circle cx="110" cy="312" r="12" fill="#3a3a3e"/><circle cx="290" cy="312" r="12" fill="#3a3a3e"/>`;
  },
  cubes(ctx, c) {
    const cube = (x, y, col) => `<g transform="translate(${x} ${y})"><rect width="96" height="96" rx="6" fill="${vbody(ctx, col)}"/><rect x="30" y="14" width="36" height="12" rx="6" fill="${shade(col, -0.35)}"/></g>`;
    return cube(100, 228, c) + cube(204, 228, shade(c, -0.1)) + cube(152, 128, shade(c, 0.12));
  },
  duvet(ctx, c) {
    const f = vbody(ctx, c);
    let q = '';
    for (let i = 0; i < 4; i++) q += `<path d="M${110 + i * 50} 196v90" stroke="${shade(c, -0.15)}" stroke-width="2" stroke-dasharray="4 4"/>`;
    return `<rect x="80" y="236" width="240" height="70" rx="26" fill="${shade(c, -0.08)}"/>
      <rect x="86" y="186" width="230" height="70" rx="26" fill="${f}"/>
      <rect x="96" y="140" width="210" height="64" rx="26" fill="${vbody(ctx, shade(c, 0.08))}"/>${q}
      <rect x="140" y="160" width="120" height="26" rx="6" fill="#ffffff" stroke="#c9d6e6"/><rect x="152" y="168" width="70" height="8" rx="4" fill="#6a85b5"/>`;
  },
  bedding(ctx, c) {
    return `<rect x="70" y="230" width="260" height="80" rx="10" fill="${vbody(ctx, c)}"/>
      <rect x="84" y="176" width="232" height="66" rx="10" fill="${vbody(ctx, shade(c, 0.12))}"/>
      <path d="M84 210h232" stroke="${shade(c, -0.15)}" stroke-width="2"/>
      <rect x="110" y="120" width="180" height="64" rx="24" fill="${vbody(ctx, shade(c, 0.22))}"/>
      <path d="M70 270h260" stroke="${shade(c, -0.2)}" stroke-width="2" stroke-dasharray="5 4"/>`;
  },
  towels(ctx, c) {
    const t = (y, col, w) => `<rect x="${200 - w / 2}" y="${y}" width="${w}" height="44" rx="12" fill="${vbody(ctx, col)}"/><path d="M${200 - w / 2 + 10} ${y + 32}h${w - 20}" stroke="${shade(col, -0.2)}" stroke-width="3"/>`;
    return t(276, shade(c, -0.12), 250) + t(234, c, 236) + t(192, shade(c, 0.1), 222) + t(150, shade(c, -0.05), 160) + t(108, shade(c, 0.15), 140);
  },
  bathmat(ctx, c) {
    let tex = '';
    for (let i = 0; i < 9; i++) tex += `<path d="M${96 + i * 24} 208l-30 76" stroke="${shade(c, -0.12)}" stroke-width="3" opacity=".5"/>`;
    return `<path d="M100 180h220l-40 120H60z" rx="20" fill="${vbody(ctx, c)}"/>${tex}<path d="M60 300h220l40-120v14l-40 120H60z" fill="${shade(c, -0.3)}"/>`;
  },
  kettle(ctx, c) {
    const f = body(ctx, c);
    return `<path d="M120 130h150l14 170c1 10-6 18-16 18H122c-10 0-17-8-16-18z" fill="${f}"/>
      <path d="M270 150c40 0 50 30 40 80l-20 40" stroke="${shade(c, -0.35)}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M120 150l-50 30" stroke="${f}" stroke-width="20" stroke-linecap="round"/>
      <rect x="130" y="116" width="130" height="20" rx="8" fill="${shade(c, -0.3)}"/><rect x="180" y="104" width="40" height="14" rx="6" fill="#2a2a2e"/>
      <rect x="112" y="314" width="166" height="16" rx="6" fill="#2a2a2e"/><rect x="140" y="180" width="10" height="90" rx="5" fill="#9ad0ff" opacity=".7"/>`;
  },
  glasskettle(ctx, c) {
    return `<path d="M120 120h150l14 180c1 10-6 18-16 18H122c-10 0-17-8-16-18z" fill="#e6f2f8" opacity=".75" stroke="#b9cfdb" stroke-width="3"/>
      <path d="M112 200h168l8 100c1 10-6 18-16 18H122c-10 0-17-8-16-18z" fill="#4aa8ff" opacity=".55"/>
      <path d="M270 150c40 0 50 30 40 80l-20 40" stroke="#2f3034" stroke-width="16" fill="none" stroke-linecap="round"/>
      <rect x="126" y="104" width="138" height="22" rx="8" fill="#2f3034"/><rect x="112" y="314" width="166" height="16" rx="6" fill="#2f3034"/>
      <circle cx="160" cy="260" r="6" fill="#fff" opacity=".7"/><circle cx="210" cy="240" r="4" fill="#fff" opacity=".7"/>`;
  },
  pans(ctx, c) {
    const pan = (x, y, r, col) => `<g transform="translate(${x} ${y})"><ellipse rx="${r}" ry="${r * 0.42}" fill="${shade(col, -0.35)}"/><ellipse rx="${r - 8}" ry="${(r - 8) * 0.4}" fill="${vbody(ctx, shade(col, 0.1))}"/><path d="M${r - 4} -4l${r * 0.9} -14" stroke="#2a2a2e" stroke-width="14" stroke-linecap="round"/></g>`;
    return pan(170, 290, 110, c) + pan(160, 230, 90, c) + pan(150, 175, 70, c);
  },
  containers(ctx, c) {
    const box = (x, y, w, h, lid) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#e8f1f6" opacity=".85" stroke="#b8cad6"/><rect x="${x - 4}" y="${y - 12}" width="${w + 8}" height="16" rx="6" fill="${lid}"/></g>`;
    return box(90, 250, 220, 70, c) + box(110, 180, 180, 60, shade(c, 0.2)) + box(130, 124, 140, 46, shade(c, -0.15));
  },
  headphones(ctx, c) {
    const f = body(ctx, c);
    return `<path d="M110 220c0-110 180-110 180 0" stroke="${shade(c, -0.15)}" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M118 210c0-96 164-96 164 0" stroke="${shade(c, 0.3)}" stroke-width="6" fill="none"/>
      <rect x="78" y="200" width="70" height="110" rx="32" fill="${f}"/><rect x="252" y="200" width="70" height="110" rx="32" fill="${f}"/>
      <rect x="136" y="214" width="20" height="82" rx="10" fill="${shade(c, -0.45)}"/><rect x="244" y="214" width="20" height="82" rx="10" fill="${shade(c, -0.45)}"/>`;
  },
  earbuds(ctx, c) {
    return `<rect x="120" y="200" width="160" height="110" rx="48" fill="${body(ctx, c)}"/><path d="M120 244h160" stroke="${shade(c, -0.2)}" stroke-width="3"/>
      <circle cx="200" cy="276" r="4" fill="#5ad17a"/>
      <g transform="rotate(-20 150 130)"><ellipse cx="150" cy="130" rx="28" ry="24" fill="${body(ctx, c)}"/><rect x="142" y="140" width="16" height="56" rx="8" fill="${c}"/></g>
      <g transform="rotate(20 252 130)"><ellipse cx="252" cy="130" rx="28" ry="24" fill="${body(ctx, c)}"/><rect x="244" y="140" width="16" height="56" rx="8" fill="${c}"/></g>`;
  },
  watch(ctx, c) {
    return `<rect x="160" y="50" width="80" height="300" rx="30" fill="${vbody(ctx, c)}"/>
      <rect x="130" y="130" width="140" height="150" rx="38" fill="${body(ctx, '#3a3b40')}"/>
      <rect x="142" y="142" width="116" height="126" rx="28" fill="#0d0d10"/>
      <text x="200" y="200" text-anchor="middle" font-size="30" font-weight="700" fill="#fff" font-family="-apple-system,Helvetica,Arial">72</text>
      <text x="200" y="222" text-anchor="middle" font-size="12" fill="#ff5a7a" font-family="-apple-system,Helvetica,Arial">♥ BPM</text>
      <path d="M160 246h20l8-12 10 22 8-10h34" stroke="#5ad17a" stroke-width="3" fill="none"/><rect x="272" y="190" width="8" height="30" rx="4" fill="#55565c"/>`;
  },
  powerbank(ctx, c) {
    return `<rect x="110" y="110" width="180" height="210" rx="26" fill="${body(ctx, c)}"/>
      <rect x="150" y="150" width="100" height="10" rx="5" fill="${shade(c, isLight(c) ? -0.2 : 0.2)}"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${170 + i * 20}" cy="290" r="5" fill="${i < 3 ? '#4fd17a' : '#555'}"/>`).join('')}
      <path d="M290 230c40 0 40 60 0 70" stroke="#2b2b2f" stroke-width="8" fill="none"/>`;
  },
  extension(ctx, c) {
    const sock = (x) => `<g transform="translate(${x} 0)"><rect x="-26" y="172" width="52" height="62" rx="8" fill="${shade(c, -0.08)}"/><rect x="-4" y="184" width="8" height="16" fill="#2b2b2f"/><rect x="-18" y="208" width="12" height="7" fill="#2b2b2f"/><rect x="6" y="208" width="12" height="7" fill="#2b2b2f"/></g>`;
    return `<rect x="40" y="160" width="320" height="86" rx="18" fill="${body(ctx, c)}" stroke="#d0d0d0"/>
      ${[86, 150, 214, 278].map(sock).join('')}
      <rect x="320" y="184" width="10" height="5" fill="#555"/><rect x="320" y="200" width="10" height="5" fill="#555"/><rect x="322" y="216" width="8" height="10" rx="3" fill="#555"/>
      <path d="M40 210c-30 0-30 80 20 90h140" stroke="${shade(c, -0.15)}" stroke-width="8" fill="none"/>`;
  },
  charger(ctx, c) {
    return `<rect x="130" y="130" width="140" height="150" rx="24" fill="${body(ctx, c)}"/>
      <rect x="166" y="96" width="14" height="40" fill="#9da1a8"/><rect x="220" y="96" width="14" height="40" fill="#9da1a8"/><rect x="193" y="84" width="14" height="46" fill="#9da1a8"/>
      <rect x="160" y="236" width="80" height="12" rx="6" fill="${shade(c, -0.4)}"/><rect x="172" y="256" width="56" height="12" rx="4" fill="${shade(c, -0.4)}"/>
      <text x="200" y="200" text-anchor="middle" font-size="22" font-weight="700" fill="${isLight(c) ? '#888' : '#ddd'}" font-family="-apple-system,Helvetica,Arial">65W</text>`;
  },
  adapter(ctx, c) {
    return `<rect x="130" y="140" width="140" height="140" rx="20" fill="${body(ctx, c)}"/>
      <rect x="160" y="112" width="12" height="32" fill="#9da1a8"/><rect x="228" y="112" width="12" height="32" fill="#9da1a8"/><rect x="194" y="100" width="12" height="44" fill="#9da1a8"/>
      <rect x="160" y="280" width="10" height="40" fill="#9da1a8"/><rect x="230" y="280" width="10" height="40" fill="#9da1a8"/>
      <rect x="150" y="200" width="30" height="10" rx="3" fill="#555"/><rect x="190" y="200" width="30" height="10" rx="3" fill="#555"/><rect x="230" y="198" width="22" height="14" rx="6" fill="#555"/>`;
  },
  serum(ctx, c) {
    return `<rect x="150" y="150" width="100" height="170" rx="22" fill="${ctx.grad([[0, shade(c, 0.3), 0.95], [1, shade(c, -0.2), 0.95]], 1, 0)}"/>
      <rect x="160" y="168" width="20" height="130" rx="10" fill="#fff" opacity=".35"/>
      <rect x="170" y="220" width="60" height="60" rx="6" fill="#fff" opacity=".9"/><rect x="180" y="234" width="40" height="6" rx="3" fill="#333"/><rect x="186" y="248" width="28" height="4" rx="2" fill="#999"/>
      <rect x="176" y="118" width="48" height="36" rx="6" fill="#d9c08a"/><path d="M182 118c0-40 36-40 36 0z" fill="#2b2b2f"/>`;
  },
  tube(ctx, c) {
    return `<path d="M150 90h100l10 200c0 20-20 34-60 34s-60-14-60-34z" fill="${ctx.grad([[0, '#ffffff'], [1, shade(c, 0.4)]], 1, 0)}" stroke="#ddd"/>
      <rect x="168" y="70" width="64" height="26" rx="6" fill="${c}"/>
      <rect x="166" y="160" width="68" height="80" rx="8" fill="${c}"/><text x="200" y="214" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="-apple-system,Helvetica,Arial">50</text>
      <text x="200" y="232" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="-apple-system,Helvetica,Arial">SPF</text>`;
  },
  styler(ctx, c) {
    let br = '';
    for (let i = 0; i < 8; i++) br += `<path d="M${168} ${90 + i * 14}h-14M${232} ${90 + i * 14}h14" stroke="#555" stroke-width="3"/>`;
    return `<rect x="168" y="80" width="64" height="120" rx="30" fill="${body(ctx, '#3a3b40')}"/>${br}
      <rect x="174" y="196" width="52" height="140" rx="22" fill="${body(ctx, c)}"/><circle cx="200" cy="240" r="8" fill="${shade(c, -0.35)}"/><rect x="194" y="262" width="12" height="30" rx="6" fill="${shade(c, -0.35)}"/>`;
  },
  yogamat(ctx, c) {
    return `<path d="M60 300l160-80h140l-160 80z" fill="${vbody(ctx, c)}"/>
      <ellipse cx="110" cy="240" rx="56" ry="56" fill="${body(ctx, c)}"/><ellipse cx="110" cy="240" rx="40" ry="40" fill="${shade(c, -0.2)}"/><ellipse cx="110" cy="240" rx="22" ry="22" fill="${shade(c, -0.35)}"/>
      <path d="M110 184h110l140 36" stroke="none" fill="none"/><path d="M110 184l110 36" stroke="${shade(c, 0.2)}" stroke-width="2"/>
      <path d="M150 290l140-70" stroke="${shade(c, -0.15)}" stroke-width="2" stroke-dasharray="6 6"/>`;
  },
  dumbbells(ctx, c) {
    const db = (y) => `<g transform="translate(0 ${y})"><rect x="140" y="-8" width="120" height="16" rx="6" fill="#9da1a8"/>
      ${[100, 120, 260, 280].map((x, i) => `<rect x="${x}" y="${i % 3 ? -40 : -30}" width="20" height="${i % 3 ? 80 : 60}" rx="6" fill="${body(ctx, c)}"/>`).join('')}</g>`;
    return db(160) + db(270);
  },
  bottle(ctx, c) {
    return `<rect x="150" y="110" width="100" height="220" rx="30" fill="${body(ctx, c)}"/>
      <rect x="164" y="74" width="72" height="44" rx="12" fill="${body(ctx, '#3a3b40')}"/><path d="M180 74c0-26 40-26 40 0" stroke="#3a3b40" stroke-width="8" fill="none"/>
      <rect x="164" y="130" width="14" height="170" rx="7" fill="#fff" opacity=".25"/>`;
  },
  suitcase(ctx, c) {
    let ribs = '';
    for (let i = 0; i < 4; i++) ribs += `<path d="M${150 + i * 34} 120v190" stroke="${shade(c, -0.2)}" stroke-width="4"/>`;
    return `<path d="M170 110v-50h60v50" stroke="#3a3b40" stroke-width="10" fill="none"/>
      <rect x="120" y="106" width="160" height="214" rx="24" fill="${body(ctx, c)}"/>${ribs}
      <circle cx="140" cy="330" r="10" fill="#2b2b2f"/><circle cx="260" cy="330" r="10" fill="#2b2b2f"/>`;
  },
  phonemount(ctx, c) {
    return `<rect x="150" y="70" width="110" height="210" rx="18" fill="#1d1d20"/><rect x="158" y="82" width="94" height="186" rx="12" fill="${ctx.grad([[0, '#6ec6ff'], [1, '#7c6cf0']])}"/>
      <circle cx="205" cy="200" r="34" fill="${body(ctx, c)}"/><rect x="196" y="230" width="18" height="60" fill="${shade(c, -0.2)}"/><rect x="170" y="290" width="70" height="14" rx="5" fill="#2b2b2f"/>
      <path d="M180 304v26M200 304v26M220 304v26" stroke="#555" stroke-width="4"/>`;
  },
  packingcubes(ctx, c) {
    const pc = (x, y, w, h, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${vbody(ctx, col)}"/><path d="M${x + 10} ${y + 10}h${w - 20}" stroke="${shade(col, -0.35)}" stroke-width="3"/><rect x="${x + 14}" y="${y + 20}" width="${w - 28}" height="${h - 34}" rx="6" fill="#fff" opacity=".18"/>`;
    return pc(70, 220, 260, 90, c) + pc(100, 150, 200, 76, shade(c, 0.15)) + pc(130, 90, 140, 64, shade(c, -0.1));
  },
};

export const SHAPES = Object.keys(D);
export function draw(shape, ctx, color) {
  return (D[shape] || D.cubes)(ctx, color);
}
