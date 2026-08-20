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

function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-gray-900 transition-colors duration-500 dark:bg-gray-950 dark:text-white">

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

      <main className="relative z-10 w-full overflow-x-hidden">

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

    </div>
  );
}

export default Home;