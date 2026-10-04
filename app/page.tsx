import { Intro } from "@/components/intro";
import { Masthead } from "@/components/masthead";
import { Hero } from "@/components/hero";
import { Work, Background, Toolbox, Contact } from "@/components/sections";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="page">
      <Intro />
      <Masthead />
      <main>
        <Hero />
        <hr className="rule-thick" aria-hidden="true" />
        <Work />
        <Background />
        <Toolbox />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
