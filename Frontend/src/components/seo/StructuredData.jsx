import { useEffect, useState } from 'react';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Structured Data (JSON-LD)
|--------------------------------------------------------------------------
|
| Google ko portfolio ke baare me "samajhne" ke liye structured data
| deta hai, taaki search results me rich preview (naam, role, profile
| photo, social links) dikh sake — plain blue link ke bajaye.
|
| Do schemas inject karte hain:
|
|   1. Person    -> Vivek ek developer hai, unke social/profile links
|   2. WebSite   -> yeh portfolio site hai, canonical URL ke saath
|
| Live hero data (jo Admin Dashboard se update hoti hai) use karte
| hain taaki schema hamesha current info reflect kare.
|
| <script type="application/ld+json"> ko document.head me manually
| inject karte hain (yeh component kuch bhi visually render nahi
| karta — return null).
|
| NOTE: SITE_URL yahan aur index.html ke canonical/og:url dono me
| SAME hona chahiye. Agar aapka live domain badal jaye, dono jagah
| update karna.
|--------------------------------------------------------------------------
*/

const SITE_URL = 'https://my-portfolio-mern-mauve.vercel.app';

const DEFAULT_HERO = {
  name: 'Vivek Kumar Rana',
  role: 'MERN Stack Developer',
  tagline:
    'MERN Stack Developer building scalable, responsive and user-focused web applications using React, Node.js, Express.js and MongoDB.',
  githubUrl: 'https://github.com/realvivekrana',
  linkedinUrl: 'https://www.linkedin.com/in/mrvivekrana/',
};

function StructuredData() {
  const [hero, setHero] = useState(DEFAULT_HERO);

  /*
  |--------------------------------------------------------------------------
  | LOAD LIVE HERO DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    const loadHero = async () => {
      try {
        const response = await API.get('/portfolio');

        const portfolio = response.data?.data || {};
        const heroData = portfolio?.hero || {};

        if (!isMounted) {
          return;
        }

        setHero({
          name: heroData.name || DEFAULT_HERO.name,
          role: heroData.role || DEFAULT_HERO.role,
          tagline: heroData.tagline || DEFAULT_HERO.tagline,
          githubUrl:
            portfolio?.socialLinks?.github ||
            heroData.githubUrl ||
            DEFAULT_HERO.githubUrl,
          linkedinUrl:
            portfolio?.socialLinks?.linkedin ||
            heroData.linkedinUrl ||
            DEFAULT_HERO.linkedinUrl,
        });
      } catch (error) {
        console.warn(
          'StructuredData: using default hero data:',
          error
        );
      }
    };

    loadHero();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | INJECT JSON-LD INTO <head>
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const sameAs = [hero.githubUrl, hero.linkedinUrl].filter(
      Boolean
    );

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: hero.name,
      jobTitle: hero.role,
      description: hero.tagline,
      url: SITE_URL,
      image: `${SITE_URL}/og-default.png`,
      sameAs,
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance / Open to Work',
      },
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${hero.name} | Portfolio`,
      url: SITE_URL,
      description: hero.tagline,
      author: {
        '@type': 'Person',
        name: hero.name,
      },
    };

    const scriptIds = [
      'structured-data-person',
      'structured-data-website',
    ];

    const schemas = [personSchema, websiteSchema];

    const createdScripts = scriptIds.map((id, index) => {
      let script = document.getElementById(id);

      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(schemas[index]);

      return script;
    });

    return () => {
      createdScripts.forEach((script) => {
        script?.remove();
      });
    };
  }, [hero]);

  return null;
}

export default StructuredData;