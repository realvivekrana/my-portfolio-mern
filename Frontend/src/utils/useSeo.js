import { useEffect } from 'react';

const SITE_URL = 'https://my-portfolio-mern-mauve.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

const setMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

/*
| Har page ka apna title / description / canonical / social card.
| Google ko har blog post aur case study alag page ke roop me dikhta hai.
| title/description khali ho (data abhi load ho raha) to kuch nahi badalta.
*/
export default function useSeo({ title, description, path, image }) {
  useEffect(() => {
    if (!title) return;

    const url = `${SITE_URL}${path || '/'}`;
    const fullTitle = `${title} | Vivek Rana`;
    const img = image && /^https?:\/\//.test(image) ? image : DEFAULT_IMAGE;
    const desc = (description || '').replace(/\s+/g, ' ').trim().slice(0, 160);

    document.title = fullTitle;

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path, image]);
}