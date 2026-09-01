/*
|--------------------------------------------------------------------------
| API Origin (without /api suffix)
|--------------------------------------------------------------------------
*/

const API_ORIGIN = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
)
  .trim()
  .replace(/\/api\/?$/, '');

/*
|--------------------------------------------------------------------------
| Resolve Media URL
|--------------------------------------------------------------------------
|
| Production mein kabhi-kabhi profile image localhost par save ho jati hai
| (local dev se upload). Aise URLs ko ignore karke fallback use hoga.
|
|--------------------------------------------------------------------------
*/

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    if (/localhost|127\.0\.0\.1/i.test(trimmed)) {
      return '';
    }

    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  return trimmed;
}

export default resolveMediaUrl;
