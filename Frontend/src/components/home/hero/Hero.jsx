import Container from "../../ui/Container";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import HeroBackground from "./HeroBackground";

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-slate-950"
    >
      <HeroBackground />

      <div className="relative z-10 w-full">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <HeroContent />
            <HeroImage />
          </div>
        </Container>
      </div>
    </section>
  );
}

export default Hero;