const GitHubStats = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <img
        src="https://github-readme-stats.vercel.app/api?username=realvivekrana&show_icons=true&theme=tokyonight&hide_border=true"
        alt="GitHub Stats"
        className="w-full rounded-2xl"
      />

      <img
        src="https://github-readme-stats.vercel.app/api/top-langs/?username=realvivekrana&layout=compact&theme=tokyonight&hide_border=true"
        alt="Top Languages"
        className="w-full rounded-2xl"
      />

      <img
        src="https://streak-stats.demolab.com?user=realvivekrana&theme=tokyonight&hide_border=true"
        alt="GitHub Streak"
        className="lg:col-span-2 w-full rounded-2xl"
      />
    </div>
  );
};

export default GitHubStats;