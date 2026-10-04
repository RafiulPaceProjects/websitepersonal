import { Intro } from "@/components/intro";
import { HeroFilm } from "@/components/hero-film";

export default function Home() {
  return (
    <div className="page">
      <Intro />
      <main>
        <HeroFilm />
      </main>
    </div>
  );
}
