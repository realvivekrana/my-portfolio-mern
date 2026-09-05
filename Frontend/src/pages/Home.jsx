import { useEffect, useState } from 'react';

import Navbar from '../components/layout/Navbar';

import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Education from '../components/sections/Education';
import Certifications from '../components/sections/Certifications';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

import Footer from '../components/layout/Footer';

import AnimatedBackground from '../components/ui/AnimatedBackground';
import Chatbot from '../components/ui/Chatbot';

import API from '../utils/axios';

function Home() {
  /*
  |--------------------------------------------------------------------------
  | PORTFOLIO VISIBILITY STATE
  |--------------------------------------------------------------------------
  */

  const [isPrivate, setIsPrivate] = useState(false);

  const [checkingVisibility, setCheckingVisibility] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | CHECK PORTFOLIO VISIBILITY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const checkPortfolioVisibility = async () => {
      try {
        setCheckingVisibility(true);

        const response = await API.get('/portfolio');

        const portfolio = response.data?.data;

        /*
        |--------------------------------------------------------------------------
        | PRIVATE PORTFOLIO
        |--------------------------------------------------------------------------
        |
        | ✅ FIX: the actual field saved by the admin Settings page
        | is `settings.portfolioVisibility` ('public' | 'private') —
        | see Backend/models/PortfolioContent.js. This used to check
        | a non-existent `portfolio.isPrivate` field, which was
        | always undefined, so toggling "Private" in Settings never
        | actually hid the live site.
        |
        |--------------------------------------------------------------------------
        */

        if (
          portfolio?.settings
            ?.portfolioVisibility === 'private'
        ) {
          setIsPrivate(true);
        } else {
          setIsPrivate(false);
        }
      } catch (error) {
        console.error(
          'Portfolio visibility check error:',
          error
        );

        /*
        |--------------------------------------------------------------------------
        | FAIL SAFE
        |--------------------------------------------------------------------------
        |
        | Agar API request fail ho jaye to portfolio ko
        | unnecessarily private nahi karenge.
        |
        |--------------------------------------------------------------------------
        */

        setIsPrivate(false);
      } finally {
        setCheckingVisibility(false);
      }
    };

    checkPortfolioVisibility();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CHECKING PORTFOLIO
  |--------------------------------------------------------------------------
  */

  if (checkingVisibility) {
    return (
      <div
        className="
          relative
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-white
          text-gray-900
          dark:bg-gray-950
          dark:text-white
        "
      >
        <AnimatedBackground />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            justify-center
            px-6
            text-center
          "
        >
          <div
            className="
              mb-6
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-indigo-600
              dark:border-gray-800
              dark:border-t-indigo-400
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-gray-600
              dark:text-gray-400
            "
          >
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PRIVATE PORTFOLIO
  |--------------------------------------------------------------------------
  */

  if (isPrivate) {
    return (
      <div
        className="
          relative
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-white
          px-6
          text-gray-900
          transition-colors
          duration-500
          dark:bg-gray-950
          dark:text-white
        "
      >
        {/* =====================================================
            GLOBAL LIVE ANIMATION
        ====================================================== */}

        <AnimatedBackground />

        {/* =====================================================
            PRIVATE PORTFOLIO MESSAGE
            (No Navbar / Footer / links — nothing else on this
            page should be clickable or functional while private)
        ====================================================== */}

        <div
          className="
            relative
            z-10
            w-full
            max-w-2xl
            rounded-3xl
            border
            border-gray-200
            bg-white/90
            p-8
            text-center
            shadow-xl
            backdrop-blur
            dark:border-gray-800
            dark:bg-gray-900/90
          "
        >
          {/* Lock Icon */}

          <div
            className="
              mx-auto
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-4xl
              dark:bg-gray-800
            "
          >
            🔒
          </div>

          {/* Heading */}

          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-gray-900
              dark:text-white
              sm:text-4xl
            "
          >
            Portfolio is Private
          </h1>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-4
              max-w-lg
              text-base
              leading-7
              text-gray-600
              dark:text-gray-400
            "
          >
            This portfolio is currently private
            and is not available for public viewing.
            Please check back later.
          </p>

          {/* Status */}

          <div
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-red-50
              px-4
              py-2
              text-sm
              font-semibold
              text-red-600
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />

            Currently Private
          </div>

          {/* =====================================================
              ADMIN LOGIN LINK
              (The only clickable element on this page — lets the
              owner get back into the dashboard to switch visibility
              back to Public. Kept small/subtle on purpose.)
          ====================================================== */}

          <div
            className="
              mt-8
              border-t
              border-gray-100
              pt-6
              dark:border-gray-800
            "
          >
            <a
              href="/admin/login"
              className="
                text-xs
                font-medium
                text-gray-400
                underline-offset-4
                transition-colors
                hover:text-indigo-600
                hover:underline
                dark:text-gray-600
                dark:hover:text-indigo-400
              "
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PUBLIC PORTFOLIO
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-white
        text-gray-900
        transition-colors
        duration-500
        dark:bg-gray-950
        dark:text-white
      "
    >
      {/* =====================================================
          GLOBAL LIVE ANIMATION
      ====================================================== */}

      <AnimatedBackground />

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          relative
          z-10
          w-full
          overflow-x-hidden
        "
      >
        {/* Hero */}

        <section className="w-full">
          <Hero />
        </section>

        {/* About */}

        <section className="w-full">
          <About />
        </section>

        {/* Skills */}

        <section className="w-full">
          <Skills />
        </section>

        {/* Experience */}

        <section className="w-full">
          <Experience />
        </section>

        {/* Education */}

        <section className="w-full">
          <Education />
        </section>

        {/* Certifications */}

        <section className="w-full">
          <Certifications />
        </section>

        {/* Projects */}

        <section className="w-full">
          <Projects />
        </section>

        {/* Contact */}

        <section className="w-full">
          <Contact />
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="relative z-10">
        <Footer />
      </div>

      {/* =====================================================
          AI CHATBOT WIDGET
      ====================================================== */}

      <Chatbot />
    </div>
  );
}

export default Home;