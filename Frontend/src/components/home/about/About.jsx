import AboutContent from "./AboutContent";
import AboutImage from "./AboutImage";
import AboutStats from "./AboutStats";

const About = () => {
  return (
    <section
      id="about"
      className="bg-slate-950 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <AboutImage />
          <AboutContent />
        </div>

        <div className="mt-20">
          <AboutStats />
        </div>
      </div>
    </section>
  );
};

export default About;