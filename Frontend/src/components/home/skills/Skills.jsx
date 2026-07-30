import SkillsGrid from "./SkillsGrid";

const Skills = () => {
  return (
    <section
      id="skills"
      className="bg-slate-900 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold">Skills</h2>
        </div>

        <SkillsGrid />
      </div>
    </section>
  );
};

export default Skills;