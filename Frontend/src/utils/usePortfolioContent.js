import { useEffect, useState } from 'react';

import API from './axios';

/*
|--------------------------------------------------------------------------
| usePortfolioContent
|--------------------------------------------------------------------------
| Public sections ke liye shared hook. API.get('/portfolio') utils/axios.js
| me dedupe + 60s cache hota hai, isliye alag-alag components ke baar-baar
| call karne par bhi network request ek hi jaati hai.
|
| const { portfolio, tx, content } = usePortfolioContent('about');
|
| tx('heading', t('about.heading'))
|   -> admin ne text save kiya ho to wahi, warna default (translated) text.
|--------------------------------------------------------------------------
*/

export function usePortfolioContent(page) {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    let isMounted = true;

    API.get('/portfolio')
      .then((response) => {
        if (!isMounted) return;
        setPortfolio(response?.data?.data || response?.data || {});
      })
      .catch(() => {
        if (isMounted) setPortfolio({});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const content = (page && portfolio?.pageContent?.[page]) || {};

  const tx = (key, fallback) => {
    const value = content[key];
    return typeof value === 'string' && value.trim() ? value : fallback;
  };

  return { portfolio, loaded: portfolio !== null, content, tx };
}

/*
| Section on/off — flag missing ho to section dikhega (default true).
*/
export const isSectionOn = (portfolio, key) =>
  portfolio?.siteContent?.sections?.[key] !== false;

export default usePortfolioContent;