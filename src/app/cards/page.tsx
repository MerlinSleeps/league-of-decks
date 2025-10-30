// src/app/cards/page.tsx

import { adminDb } from '@/lib/firebaseAdmin';
import type { Card } from '@/types/card';

// 1. Import our new client component
import CardGrid from './CardGrid';

// This is our server-side data fetching function (no changes)
async function getCards(): Promise<Card[]> {
  const cardsCollectionRef = adminDb.collection('cards');
  const queryRef = cardsCollectionRef.orderBy('name', 'asc');
  const querySnapshot = await queryRef.get();
  const cards = querySnapshot.docs.map((doc) => doc.data() as Card);
  return cards;
}

export const revalidate = 3600;

/**
 * This is our main Server Component page.
 * It fetches the data and passes it down to the Client Component.
 */
export default async function CardsPage() {
  // 2. Fetch the data (on the server)
  const allCards = await getCards();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Card Gallery</h1>

      {/* 3. Render the Client Component and pass it the data */}
      <CardGrid allCards={allCards} />
    </main>
  );
}