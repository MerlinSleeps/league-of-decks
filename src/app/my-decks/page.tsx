// src/app/my-decks/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase'; // 👈 Client-side Firestore!
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import Link from 'next/link';

// Import shadcn Card components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeckEntry } from '@/context/DeckBuilderContext';

// Define the shape of a saved deck
interface SavedDeck {
  id: string;
  name: string;
  createdAt: Timestamp;
  cards: DeckEntry[];
}

export default function MyDecksPage() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<SavedDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function fetches the decks
    async function fetchDecks() {
      if (!user) {
        setIsLoading(false);
        return; // No user, so no decks to fetch
      }

      try {
        // Get a reference to the user's 'decks' subcollection
        const decksColRef = collection(db, 'users', user.uid, 'decks');

        // Create a query to order them by creation date
        const q = query(decksColRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);

        const userDecks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SavedDeck[];

        setDecks(userDecks);
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDecks();
  }, [user]); // 👈 Re-run this effect when the user object changes

  if (isLoading) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Decks</h1>
        <p>Loading your decks...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Decks</h1>
        <p>Please log in to see your saved decks.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Decks</h1>

      {decks.length === 0 ? (
        <p>You haven't saved any decks yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {decks.map((deck) => (
            // 👈 2. ADD THE LINK
            <Link href={`/my-decks/${deck.id}`} key={deck.id}>
              <Card className="hover:shadow-lg hover:shadow-cyan-500/30 h-full">
                <CardHeader>
                  <CardTitle>{deck.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    {deck.cards.reduce((sum, c) => sum + c.count, 0)} cards
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(deck.createdAt.toMillis()).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}