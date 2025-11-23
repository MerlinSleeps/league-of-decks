import { getFirestore } from '@/lib/firebaseAdmin';
import type { Card } from '@/types/card';
import { DeckBuilderProvider } from '@/context/DeckBuilderContext';

import DeckList from '@/components/builder/DeckList';
import BuilderCardGrid from '@/components/builder/BuilderCardGrid';

async function getCards(): Promise<Card[]> {
  const firestore = getFirestore();
  const cardsCollectionRef = firestore.collection('cards');
  const queryRef = cardsCollectionRef.orderBy('name', 'asc');
  const querySnapshot = await queryRef.get();
  const cards = querySnapshot.docs.map((doc) => doc.data() as Card);
  return cards;
}

export const revalidate = 3600;

export default async function BuildPage() {
  const allCards = await getCards();

  return (
    <DeckBuilderProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Deck Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BuilderCardGrid allCards={allCards} />
          </div>

          <div className="lg:col-span-1">
            <DeckList />
          </div>
        </div>
      </main>
    </DeckBuilderProvider>
  );
}