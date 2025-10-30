"use client";

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { DeckEntry } from '@/context/DeckBuilderContext';

// Define the shape of a saved deck
interface SavedDeck {
  id: string;
  name: string;
  createdAt: Timestamp;
  cards: DeckEntry[];
}

// This interface defines the 'params' prop
interface DeckDetailPageProps {
params: Promise<{ 
    deckId: string 
}>;
}

export default function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { deckId } = use(params);
  const { user } = useAuth();
  const [deck, setDeck] = useState<SavedDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeck() {
      if (!user) {
        setIsLoading(false);
        return; // No user, can't fetch deck
      }

      try {
        // Get a reference to the specific deck document
        const docRef = doc(db, 'users', user.uid, 'decks', deckId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDeck({ id: docSnap.id, ...docSnap.data() } as SavedDeck);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching deck:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeck();
  }, [user, deckId]);

  if (isLoading) {
    return <main className="container mx-auto p-4"><p>Loading deck...</p></main>;
  }

  if (!deck) {
    return <main className="container mx-auto p-4"><p>Deck not found.</p></main>;
  }

  // Calculate total cards
  const totalCards = deck.cards.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{deck.name}</h1>
      <p className="text-lg text-gray-400 mb-6">Total cards: {totalCards}</p>

      {/* We'll just list the cards for now */}
      <div className="max-w-md bg-gray-900 p-4 rounded-lg border border-gray-700">
        {[...deck.cards]
          .sort((a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name))
          .map(({ card, count }) => (
            <div
              key={card.id}
              className="flex justify-between items-center p-2 border-b border-gray-700"
            >
              <div>
                <span className="font-semibold">{card.name}</span>
                <p className="text-xs text-gray-400">Cost: {card.cost}</p>
              </div>
              <span className="font-bold">x{count}</span>
            </div>
          ))}
      </div>
    </main>
  );
}