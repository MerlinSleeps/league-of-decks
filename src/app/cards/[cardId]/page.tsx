// src/app/cards/[cardId]/page.tsx

import { adminDb } from '@/lib/firebaseAdmin';
import type { Card } from '@/types/card'; // Make sure this path is correct

// Import our shadcn components
import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// This interface defines the 'params' prop that Next.js will pass to our page.
interface CardDetailPageProps {
  params: {
    cardId: string; // This 'cardId' MUST match the folder name '[cardId]'
  };
}

/**
 * This is our server-side data fetching function.
 * It uses the 'cardId' from the URL to fetch a single document.
 */
async function getCard(id: string): Promise<Card | null> {
  console.log('Attempting to fetch card with ID:', id);
  // GUARD CLAUSE: Check if the ID is valid before using it
  if (!id || typeof id !== 'string') {
    console.warn('getCard received an invalid ID. Aborting fetch.');
    return null;
  }
    
  try {
    const docRef = adminDb.collection('cards').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // We'll handle this 'not found' case
    }

    return docSnap.data() as Card;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}

// This is the main page component
export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { cardId } = params;
  const card = await getCard(cardId);

  // Handle the case where the card doesn't exist
  if (!card) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Card not found</h1>
        <p>We couldn't find a card with the ID: {cardId}</p>
      </main>
    );
  }

  // Render the single card details
  // (We'll make this look much better in a moment)
  return (
    <main className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <ShadCard>
          <CardHeader>
            <CardTitle className="text-2xl">{card.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full rounded-md mb-4"
            />
            <p className="text-lg mb-2">{card.text}</p>
            <p className="text-xl font-bold">Cost: {card.cost}</p>
            {/* We can add more details here later, like faction, might, etc. */}
          </CardContent>
        </ShadCard>
      </div>
    </main>
  );
}