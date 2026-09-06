/*
|--------------------------------------------------------------------------
| Cloudinary Image Optimizer
|--------------------------------------------------------------------------
|
| Hamare saare portfolio images (profile photo, project screenshots,
| certificates) Cloudinary par host hain. Cloudinary URL me hi
| transformation params daal kar hum:
|
|   f_auto   -> browser ke hisaab se best format serve karta hai
|                (WebP / AVIF jahan support ho, warna original)
|   q_auto   -> automatic quality compression (visually lossless)
|   dpr_auto -> device pixel ratio ke hisaab se sahi resolution
|
| Isse bina kisi manual conversion / extra build step ke, images
| automatically modern format + optimal size me load hoti hain —
| jo Lighthouse Performance score ko seedha improve karta hai.
|
| Non-Cloudinary URLs (local dev uploads, imported assets, base64,
| ya empty strings) ko bina chhede as-is return kar dete hain.
|
|--------------------------------------------------------------------------
*/

const CLOUDINARY_UPLOAD_PATTERN =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)((?:v\d+\/)?.+)$/i;

/*
|--------------------------------------------------------------------------
| optimizeImageUrl(url, options)
|--------------------------------------------------------------------------
|
| options.width  -> optional max-width transformation (w_<n>)
| options.height -> optional max-height transformation (h_<n>)
|
|--------------------------------------------------------------------------
*/

export function optimizeImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  const match = CLOUDINARY_UPLOAD_PATTERN.exec(url);

  if (!match) {
    // Cloudinary URL nahi hai (local asset / base64 / relative path)
    return url;
  }

  const [, uploadBase, remainder] = match;

  const { width, height } = options;

  const transformParts = [
    'f_auto',
    'q_auto',
    'dpr_auto',
  ];

  if (width) {
    transformParts.push(`w_${width}`);
  }

  if (height) {
    transformParts.push(`h_${height}`);
  }

  if (width || height) {
    transformParts.push('c_limit');
  }

  // Agar remainder me pehle se koi transformation chain hai (bahut
  // kam hota hai humare setup me), usko duplicate karne ke bajaye
  // simply naye transformation ke saath prefix kar dete hain —
  // Cloudinary chained transformations ko sequentially apply karta hai.

  return `${uploadBase}${transformParts.join(',')}/${remainder}`;
}

export default optimizeImageUrl;