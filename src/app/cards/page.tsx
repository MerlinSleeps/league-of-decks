import { getAllCards } from '@/lib/cards';
import CardGrid from './CardGrid';

export const revalidate = 3600;

export default async function CardsPage() {
  const allCards = await getAllCards();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Card Gallery</h1>
      <CardGrid allCards={allCards} />
    </main>
  );
}