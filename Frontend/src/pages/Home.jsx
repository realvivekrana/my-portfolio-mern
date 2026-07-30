import Hero from "../components/home/hero/Hero";
import About from "../components/home/about/About";
import Skills from "../components/home/skills/Skills";
import Projects from "../components/home/projects/Projects";
import GitHubSection from "../components/home/github/GitHubSection";
import Experience from "../components/home/experience/Experience";
import Education from "../components/home/education/Education";
import Contact from "../components/home/contact/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />

      {/* New Section */}
      <GitHubSection />

      <Experience />
      <Education />
      <Contact />
    </>
  );
};

export default Home;