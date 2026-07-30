import educationData from "./educationData";
import EducationCard from "./EducationCard";

const Education = () => {
  return (
    <section
      id="education"
      className="bg-slate-900 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            Education
          </span>

          <h2 className="mt-5 text-5xl font-bold">
            My Education
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            My academic journey and qualifications.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {educationData.map((education) => (
            <EducationCard
              key={education.id}
              education={education}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;