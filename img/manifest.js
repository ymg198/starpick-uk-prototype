// Real / AI-generated product photos.
// Products listed here use these photos instead of the code-drawn images; everything else keeps the drawings.
// Keys are BASE product ids (f1, d1, l2 …). Similar listings from other shops (f1v1, f1v2 …) share their base's photos.
//
// Format:
// f2: {
//   product: ['img/products/f2/1.jpg', 'img/products/f2/2.jpg', 'img/products/f2/3.jpg', 'img/products/f2/4.jpg', 'img/products/f2/5.jpg'],
//   colors:  { Navy: 'img/products/f2/color-navy.jpg', Olive: 'img/products/f2/color-olive.jpg' }, // optional: main photo per colour
//   buyer:   ['img/reviews/f2/1.jpg', 'img/reviews/f2/2.jpg', 'img/reviews/f2/3.jpg', 'img/reviews/f2/4.jpg'], // shared pool for photo reviews
//   reviews: { f2c0: ['img/reviews/f2/f2c0-1.jpg'] }, // optional: photos for one specific hand-written review
// },
//
// Shot order for `product`: 1 hero on white · 2 detail close-up · 3 size/scale · 4 in use / lifestyle · 5 colours or what's in the box
// All photos must be free of real brands, logos and readable text.

export const PHOTO_MANIFEST = {
  f1: { product: ['img/products/f1/1.jpg', 'img/products/f1/2.jpg', 'img/products/f1/3.jpg', 'img/products/f1/4.jpg', 'img/products/f1/5.jpg'], buyer: ['img/reviews/f1/1.jpg', 'img/reviews/f1/2.jpg', 'img/reviews/f1/3.jpg', 'img/reviews/f1/4.jpg'] },
  f2: { product: ['img/products/f2/1.jpg', 'img/products/f2/2.jpg', 'img/products/f2/3.jpg', 'img/products/f2/4.jpg', 'img/products/f2/5.jpg'], buyer: ['img/reviews/f2/1.jpg', 'img/reviews/f2/2.jpg', 'img/reviews/f2/3.jpg'], reviews: { f2c0: ['img/reviews/f2/f2c0-1.jpg'] } },
  f3: { product: ['img/products/f3/1.jpg', 'img/products/f3/2.jpg', 'img/products/f3/3.jpg', 'img/products/f3/4.jpg', 'img/products/f3/5.jpg'], buyer: ['img/reviews/f3/1.jpg', 'img/reviews/f3/2.jpg', 'img/reviews/f3/3.jpg', 'img/reviews/f3/4.jpg'] },
  f4: { product: ['img/products/f4/1.jpg', 'img/products/f4/2.jpg', 'img/products/f4/3.jpg', 'img/products/f4/4.jpg', 'img/products/f4/5.jpg'], buyer: ['img/reviews/f4/1.jpg', 'img/reviews/f4/2.jpg', 'img/reviews/f4/3.jpg', 'img/reviews/f4/4.jpg'] },
  f5: { product: ['img/products/f5/1.jpg', 'img/products/f5/2.jpg', 'img/products/f5/3.jpg', 'img/products/f5/4.jpg', 'img/products/f5/5.jpg'], buyer: ['img/reviews/f5/1.jpg', 'img/reviews/f5/2.jpg', 'img/reviews/f5/3.jpg', 'img/reviews/f5/4.jpg'] },
  f6: { product: ['img/products/f6/1.jpg', 'img/products/f6/2.jpg', 'img/products/f6/3.jpg', 'img/products/f6/4.jpg', 'img/products/f6/5.jpg'], buyer: ['img/reviews/f6/1.jpg', 'img/reviews/f6/2.jpg', 'img/reviews/f6/3.jpg', 'img/reviews/f6/4.jpg'] },
  d1: { product: ['img/products/d1/1.jpg', 'img/products/d1/2.jpg', 'img/products/d1/3.jpg', 'img/products/d1/4.jpg', 'img/products/d1/5.jpg'], buyer: ['img/reviews/d1/1.jpg', 'img/reviews/d1/2.jpg', 'img/reviews/d1/3.jpg', 'img/reviews/d1/4.jpg'] },
  d2: { product: ['img/products/d2/1.jpg', 'img/products/d2/2.jpg', 'img/products/d2/3.jpg', 'img/products/d2/4.jpg', 'img/products/d2/5.jpg'], buyer: ['img/reviews/d2/1.jpg', 'img/reviews/d2/2.jpg', 'img/reviews/d2/3.jpg', 'img/reviews/d2/4.jpg'] },
  d3: { product: ['img/products/d3/1.jpg', 'img/products/d3/2.jpg', 'img/products/d3/3.jpg', 'img/products/d3/4.jpg', 'img/products/d3/5.jpg'], buyer: ['img/reviews/d3/1.jpg', 'img/reviews/d3/2.jpg', 'img/reviews/d3/3.jpg', 'img/reviews/d3/4.jpg'] },
  d4: { product: ['img/products/d4/1.jpg', 'img/products/d4/2.jpg', 'img/products/d4/3.jpg', 'img/products/d4/4.jpg', 'img/products/d4/5.jpg'], buyer: ['img/reviews/d4/1.jpg', 'img/reviews/d4/2.jpg', 'img/reviews/d4/3.jpg', 'img/reviews/d4/4.jpg'] },
  d5: { product: ['img/products/d5/1.jpg', 'img/products/d5/2.jpg', 'img/products/d5/3.jpg', 'img/products/d5/4.jpg', 'img/products/d5/5.jpg'], buyer: ['img/reviews/d5/1.jpg', 'img/reviews/d5/2.jpg', 'img/reviews/d5/3.jpg', 'img/reviews/d5/4.jpg'] },
  l1: { product: ['img/products/l1/1.jpg', 'img/products/l1/2.jpg', 'img/products/l1/3.jpg', 'img/products/l1/4.jpg', 'img/products/l1/5.jpg'], buyer: ['img/reviews/l1/1.jpg', 'img/reviews/l1/2.jpg', 'img/reviews/l1/3.jpg', 'img/reviews/l1/4.jpg'] },
  l2: { product: ['img/products/l2/1.jpg', 'img/products/l2/2.jpg', 'img/products/l2/3.jpg', 'img/products/l2/4.jpg', 'img/products/l2/5.jpg'], buyer: ['img/reviews/l2/1.jpg', 'img/reviews/l2/2.jpg', 'img/reviews/l2/3.jpg'], reviews: { l2c0: ['img/reviews/l2/l2c0-1.jpg'] } },
  l3: { product: ['img/products/l3/1.jpg', 'img/products/l3/2.jpg', 'img/products/l3/3.jpg', 'img/products/l3/4.jpg', 'img/products/l3/5.jpg'], buyer: ['img/reviews/l3/1.jpg', 'img/reviews/l3/2.jpg', 'img/reviews/l3/3.jpg', 'img/reviews/l3/4.jpg'] },
  s1: { product: ['img/products/s1/1.jpg', 'img/products/s1/2.jpg', 'img/products/s1/3.jpg', 'img/products/s1/4.jpg', 'img/products/s1/5.jpg'], buyer: ['img/reviews/s1/1.jpg', 'img/reviews/s1/2.jpg', 'img/reviews/s1/3.jpg', 'img/reviews/s1/4.jpg'] },
  s2: { product: ['img/products/s2/1.jpg', 'img/products/s2/2.jpg', 'img/products/s2/3.jpg', 'img/products/s2/4.jpg', 'img/products/s2/5.jpg'], buyer: ['img/reviews/s2/1.jpg', 'img/reviews/s2/2.jpg', 'img/reviews/s2/3.jpg', 'img/reviews/s2/4.jpg'] },
  s3: { product: ['img/products/s3/1.jpg', 'img/products/s3/2.jpg', 'img/products/s3/3.jpg', 'img/products/s3/4.jpg', 'img/products/s3/5.jpg'], buyer: ['img/reviews/s3/1.jpg', 'img/reviews/s3/2.jpg', 'img/reviews/s3/3.jpg', 'img/reviews/s3/4.jpg'] },
  b1: { product: ['img/products/b1/1.jpg', 'img/products/b1/2.jpg', 'img/products/b1/3.jpg', 'img/products/b1/4.jpg', 'img/products/b1/5.jpg'], buyer: ['img/reviews/b1/1.jpg', 'img/reviews/b1/2.jpg', 'img/reviews/b1/3.jpg', 'img/reviews/b1/4.jpg'] },
  b2: { product: ['img/products/b2/1.jpg', 'img/products/b2/2.jpg', 'img/products/b2/3.jpg', 'img/products/b2/4.jpg', 'img/products/b2/5.jpg'], buyer: ['img/reviews/b2/1.jpg', 'img/reviews/b2/2.jpg', 'img/reviews/b2/3.jpg'], reviews: { b2c0: ['img/reviews/b2/b2c0-1.jpg'] } },
  h1: { product: ['img/products/h1/1.jpg', 'img/products/h1/2.jpg', 'img/products/h1/3.jpg', 'img/products/h1/4.jpg', 'img/products/h1/5.jpg'], buyer: ['img/reviews/h1/1.jpg', 'img/reviews/h1/2.jpg', 'img/reviews/h1/3.jpg', 'img/reviews/h1/4.jpg'] },
  h3: { product: ['img/products/h3/1.jpg', 'img/products/h3/2.jpg', 'img/products/h3/3.jpg', 'img/products/h3/4.jpg', 'img/products/h3/5.jpg'], buyer: ['img/reviews/h3/1.jpg', 'img/reviews/h3/2.jpg', 'img/reviews/h3/3.jpg', 'img/reviews/h3/4.jpg'] },
  k1: { product: ['img/products/k1/1.jpg', 'img/products/k1/2.jpg', 'img/products/k1/3.jpg', 'img/products/k1/4.jpg', 'img/products/k1/5.jpg'], buyer: ['img/reviews/k1/1.jpg', 'img/reviews/k1/2.jpg', 'img/reviews/k1/3.jpg', 'img/reviews/k1/4.jpg'] },
  k2: { product: ['img/products/k2/1.jpg', 'img/products/k2/2.jpg', 'img/products/k2/3.jpg', 'img/products/k2/4.jpg', 'img/products/k2/5.jpg'], buyer: ['img/reviews/k2/1.jpg', 'img/reviews/k2/2.jpg', 'img/reviews/k2/3.jpg'], reviews: { k2c0: ['img/reviews/k2/k2c0-1.jpg'] } },
  k3: { product: ['img/products/k3/1.jpg', 'img/products/k3/2.jpg', 'img/products/k3/3.jpg', 'img/products/k3/4.jpg', 'img/products/k3/5.jpg'], buyer: ['img/reviews/k3/1.jpg', 'img/reviews/k3/2.jpg', 'img/reviews/k3/3.jpg', 'img/reviews/k3/4.jpg'] },
  k4: { product: ['img/products/k4/1.jpg', 'img/products/k4/2.jpg', 'img/products/k4/3.jpg', 'img/products/k4/4.jpg', 'img/products/k4/5.jpg'], buyer: ['img/reviews/k4/1.jpg', 'img/reviews/k4/2.jpg', 'img/reviews/k4/3.jpg', 'img/reviews/k4/4.jpg'] },
  e4: { product: ['img/products/e4/1.jpg', 'img/products/e4/2.jpg', 'img/products/e4/3.jpg', 'img/products/e4/4.jpg', 'img/products/e4/5.jpg'], buyer: ['img/reviews/e4/1.jpg', 'img/reviews/e4/2.jpg', 'img/reviews/e4/3.jpg', 'img/reviews/e4/4.jpg'] },
  e5: { product: ['img/products/e5/1.jpg', 'img/products/e5/2.jpg', 'img/products/e5/3.jpg', 'img/products/e5/4.jpg', 'img/products/e5/5.jpg'], buyer: ['img/reviews/e5/1.jpg', 'img/reviews/e5/2.jpg', 'img/reviews/e5/3.jpg', 'img/reviews/e5/4.jpg'] },
  e6: { product: ['img/products/e6/1.jpg', 'img/products/e6/2.jpg', 'img/products/e6/3.jpg', 'img/products/e6/4.jpg', 'img/products/e6/5.jpg'], buyer: ['img/reviews/e6/1.jpg', 'img/reviews/e6/2.jpg', 'img/reviews/e6/3.jpg', 'img/reviews/e6/4.jpg'] },
  e7: { product: ['img/products/e7/1.jpg', 'img/products/e7/2.jpg', 'img/products/e7/3.jpg', 'img/products/e7/4.jpg', 'img/products/e7/5.jpg'], buyer: ['img/reviews/e7/1.jpg', 'img/reviews/e7/2.jpg', 'img/reviews/e7/3.jpg', 'img/reviews/e7/4.jpg'] },
  e1: { product: ['img/products/e1/1.jpg', 'img/products/e1/2.jpg', 'img/products/e1/3.jpg', 'img/products/e1/4.jpg', 'img/products/e1/5.jpg'], buyer: ['img/reviews/e1/1.jpg', 'img/reviews/e1/2.jpg', 'img/reviews/e1/3.jpg', 'img/reviews/e1/4.jpg'] },
  e3: { product: ['img/products/e3/1.jpg', 'img/products/e3/2.jpg', 'img/products/e3/3.jpg', 'img/products/e3/4.jpg', 'img/products/e3/5.jpg'], buyer: ['img/reviews/e3/1.jpg', 'img/reviews/e3/2.jpg', 'img/reviews/e3/3.jpg', 'img/reviews/e3/4.jpg'] },
  y1: { product: ['img/products/y1/1.jpg', 'img/products/y1/2.jpg', 'img/products/y1/3.jpg', 'img/products/y1/4.jpg', 'img/products/y1/5.jpg'], buyer: ['img/reviews/y1/1.jpg', 'img/reviews/y1/2.jpg', 'img/reviews/y1/3.jpg', 'img/reviews/y1/4.jpg'] },
  y2: { product: ['img/products/y2/1.jpg', 'img/products/y2/2.jpg', 'img/products/y2/3.jpg', 'img/products/y2/4.jpg', 'img/products/y2/5.jpg'], buyer: ['img/reviews/y2/1.jpg', 'img/reviews/y2/2.jpg', 'img/reviews/y2/3.jpg', 'img/reviews/y2/4.jpg'] },
  y3: { product: ['img/products/y3/1.jpg', 'img/products/y3/2.jpg', 'img/products/y3/3.jpg', 'img/products/y3/4.jpg', 'img/products/y3/5.jpg'], buyer: ['img/reviews/y3/1.jpg', 'img/reviews/y3/2.jpg', 'img/reviews/y3/3.jpg', 'img/reviews/y3/4.jpg'] },
  p1: { product: ['img/products/p1/1.jpg', 'img/products/p1/2.jpg', 'img/products/p1/3.jpg', 'img/products/p1/4.jpg', 'img/products/p1/5.jpg'], buyer: ['img/reviews/p1/1.jpg', 'img/reviews/p1/2.jpg', 'img/reviews/p1/3.jpg', 'img/reviews/p1/4.jpg'] },
  p2: { product: ['img/products/p2/1.jpg', 'img/products/p2/2.jpg', 'img/products/p2/3.jpg', 'img/products/p2/4.jpg', 'img/products/p2/5.jpg'], buyer: ['img/reviews/p2/1.jpg', 'img/reviews/p2/2.jpg', 'img/reviews/p2/3.jpg', 'img/reviews/p2/4.jpg'] },
  p3: { product: ['img/products/p3/1.jpg', 'img/products/p3/2.jpg', 'img/products/p3/3.jpg', 'img/products/p3/4.jpg', 'img/products/p3/5.jpg'], buyer: ['img/reviews/p3/1.jpg', 'img/reviews/p3/2.jpg', 'img/reviews/p3/3.jpg', 'img/reviews/p3/4.jpg'] },
  t1: { product: ['img/products/t1/1.jpg', 'img/products/t1/2.jpg', 'img/products/t1/3.jpg', 'img/products/t1/4.jpg', 'img/products/t1/5.jpg'], buyer: ['img/reviews/t1/1.jpg', 'img/reviews/t1/2.jpg', 'img/reviews/t1/3.jpg', 'img/reviews/t1/4.jpg'] },
  t2: { product: ['img/products/t2/1.jpg', 'img/products/t2/2.jpg', 'img/products/t2/3.jpg', 'img/products/t2/4.jpg', 'img/products/t2/5.jpg'], buyer: ['img/reviews/t2/1.jpg', 'img/reviews/t2/2.jpg', 'img/reviews/t2/3.jpg', 'img/reviews/t2/4.jpg'] },
  t3: { product: ['img/products/t3/1.jpg', 'img/products/t3/2.jpg', 'img/products/t3/3.jpg', 'img/products/t3/4.jpg', 'img/products/t3/5.jpg'], buyer: ['img/reviews/t3/1.jpg', 'img/reviews/t3/2.jpg', 'img/reviews/t3/3.jpg', 'img/reviews/t3/4.jpg'] },
  t4: { product: ['img/products/t4/1.jpg', 'img/products/t4/2.jpg', 'img/products/t4/3.jpg', 'img/products/t4/4.jpg', 'img/products/t4/5.jpg'], buyer: ['img/reviews/t4/1.jpg', 'img/reviews/t4/2.jpg', 'img/reviews/t4/3.jpg', 'img/reviews/t4/4.jpg'] },
};
