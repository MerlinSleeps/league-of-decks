import { getFirestore } from '@/lib/firebaseAdmin';
import type { Card } from '@/types/card';


import CardGrid from './CardGrid';


async function getCards(): Promise<Card[]> {
  const firestore = getFirestore();
  const cardsCollectionRef = firestore.collection('cards');
  const queryRef = cardsCollectionRef.orderBy('name', 'asc');
  const querySnapshot = await queryRef.get();
  const cards = querySnapshot.docs.map((doc) => doc.data() as Card);
  return cards;
}

export const revalidate = 3600;


export default async function CardsPage() {
  const allCards = await getCards();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Card Gallery</h1>

      <CardGrid allCards={allCards} />
    </main>
  );
}