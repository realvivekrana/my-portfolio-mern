import HeroButtons from "./HeroButtons";

function HeroContent() {
  return (
    <div>

      <p className="mb-4 text-lg font-medium text-cyan-400">
        👋 Hello, I'm
      </p>

      <h1 className="text-5xl font-extrabold leading-tight text-white md:text-7xl">
        Vivek Rana
      </h1>

      <h2 className="mt-4 text-2xl font-semibold text-slate-300">
        MERN Stack Developer
      </h2>

      <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
        Passionate about building fast, scalable and modern web applications
        using React, Node.js, Express.js and MongoDB.
      </p>

      <HeroButtons />

    </div>
  );
}

export default HeroContent;