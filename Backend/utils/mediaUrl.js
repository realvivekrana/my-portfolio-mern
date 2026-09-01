/*
|--------------------------------------------------------------------------
| Sanitize Media URL
|--------------------------------------------------------------------------
|
| Local development se save hui localhost / relative upload URLs
| production clients ke liye invalid hain.
|
|--------------------------------------------------------------------------
*/

const sanitizeMediaUrl = (url) => {
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

  if (trimmed.startsWith('/uploads/')) {
    const backendBase = (
      process.env.BACKEND_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      ''
    )
      .trim()
      .replace(/\/$/, '');

    if (backendBase) {
      return `${backendBase}${trimmed}`;
    }

    return '';
  }

  return trimmed;
};

/*
|--------------------------------------------------------------------------
| Sanitize Portfolio Media Fields
|--------------------------------------------------------------------------
*/

const sanitizePortfolioMedia = (portfolio) => {
  if (!portfolio) {
    return portfolio;
  }

  const data =
    typeof portfolio.toObject === 'function'
      ? portfolio.toObject()
      : { ...portfolio };

  if (data.hero?.profileImage) {
    data.hero.profileImage = sanitizeMediaUrl(
      data.hero.profileImage
    );
  }

  if (data.seo?.ogImage) {
    data.seo.ogImage = sanitizeMediaUrl(
      data.seo.ogImage
    );
  }

  return data;
};

module.exports = {
  sanitizeMediaUrl,
  sanitizePortfolioMedia,
};
