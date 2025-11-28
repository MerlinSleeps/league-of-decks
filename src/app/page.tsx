import { Hero } from "@/components/site/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center-top justify-center">
      <Hero />

      <section className="container py-12 text-center border-t border-gray-900">
        <p className="text-gray-500 text-sm">
          Join the community and start crafting your theory today.
        </p>
      </section>
    </main>
  );
}