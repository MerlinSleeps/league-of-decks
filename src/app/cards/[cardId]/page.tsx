import { adminDb } from '@/lib/firebaseAdmin';
import type { Card } from '@/types/card';

import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


interface CardDetailPageProps {
  params: {
    cardId: string;
  };
}

async function getCard(id: string): Promise<Card | null> {
  console.log('Attempting to fetch card with ID:', id);
  if (!id || typeof id !== 'string') {
    console.warn('getCard received an invalid ID. Aborting fetch.');
    return null;
  }
    
  try {
    const docRef = adminDb.collection('cards').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    return docSnap.data() as Card;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { cardId } = params;
  const card = await getCard(cardId);

  if (!card) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Card not found</h1>
        <p>We couldn't find a card with the ID: {cardId}</p>
      </main>
    );
  }

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
          </CardContent>
        </ShadCard>
      </div>
    </main>
  );
}