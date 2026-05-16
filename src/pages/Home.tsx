import Hero from "@/components/Hero";
import About from "@/components/About";
import Included from "@/components/Included";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-mist-black selection:bg-lime-accent selection:text-mist-black">
      <Hero />
      <About />
      <Included />
      <Contact />
    </main>
  );
}
