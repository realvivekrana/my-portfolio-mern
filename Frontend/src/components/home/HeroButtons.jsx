import Button from "../ui/Button";

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-4">

      <Button>
        View Projects
      </Button>

      <Button className="bg-slate-700 hover:bg-slate-600">
        Download Resume
      </Button>

    </div>
  );
}

export default HeroButtons;