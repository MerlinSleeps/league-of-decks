import Image from "next/image";
import { Hero } from "@/components/site/Hero";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col">

      {/* === MOXFIELD-STYLE BACKGROUND === */}
      {/* fixed inset-0 makes it cover the whole screen and stay there while scrolling */}
      <div className="fixed inset-0 z-[-1] w-full h-full">
        <Image
          src="/assets/hero-backdrop2.jpg"
          alt="Runic Library Backdrop"
          fill
          // CHANGE HERE: object-top aligns the image to the top edge
          className="object-cover object-top"
          priority
        />

        {/* === THE GRADIENT OVERLAY === */}
        {/* Top: Transparent to show art */}
        {/* Bottom: Fades to solid gray-950 so footer blends in perfectly */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-950/60 to-gray-950" />

        {/* Optional: Vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* === CONTENT === */}
      {/* Relative z-10 ensures this sits ON TOP of the background */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Hero />

        {/* Example Content Section to show how scrolling works over the bg */}
        <section className="container mx-auto py-20 text-center">
          <div className="p-10 rounded-2xl bg-gray-950/40 border border-gray-800/50 backdrop-blur-sm max-w-4xl mx-auto">
            <h2 className="text-2xl font-arcane text-amber-100 mb-4">Latest Sets</h2>
            <p className="text-gray-400">
              Explore cards from the new <strong>Spiritforged</strong> expansion.
            </p>
          </div>
        </section>
      </div>

    </main>
  );
}