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
};
