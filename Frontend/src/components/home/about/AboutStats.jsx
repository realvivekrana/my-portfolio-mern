import StatCard from "./StatCard";

const stats = [
  {
    number: "4+",
    title: "MERN Projects",
  },
  {
    number: "1+",
    title: "Years Experience",
  },
  {
    number: "10+",
    title: "Technologies",
  },
  {
    number: "100%",
    title: "Dedication",
  },
];

const AboutStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <StatCard
          key={index}
          number={item.number}
          title={item.title}
        />
      ))}
    </div>
  );
};

export default AboutStats;