"use client";

import { useState } from 'react';
import { useDeckBuilder } from '@/context/DeckBuilderContext';
import { useAuth } from '@/context/AuthContext';
import { auth as clientAuth } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

export default function DeckList() {
  const { deck, removeCard } = useDeckBuilder();
  const { user } = useAuth();
  const [deckName, setDeckName] = useState('');
  const [sortBy, setSortBy] = useState<'cost' | 'name'>('cost');

  const totalCards = deck.reduce((sum, entry) => sum + entry.count, 0);

  const handleSaveDeck = async () => {
    if (!user) {
      alert('You must be logged in to save a deck.');
      return;
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: deckName, deck: deck }),
      });
      if (!response.ok) throw new Error('Failed to save deck');
      alert('Deck saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving deck.');
    }
  };

  return (
    <aside className="sticky top-24 bg-gray-900 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Current Deck</h2>
        <span className="text-xl font-bold">{totalCards}</span>
      </div>
      <Separator className="bg-gray-700 mb-4" />

      <div className="flex gap-2 mb-4">
        <Button
          variant={sortBy === 'cost' ? 'secondary' : 'ghost'}
          onClick={() => setSortBy('cost')}
          size="sm"
        >
          Sort by Cost
        </Button>
        <Button
          variant={sortBy === 'name' ? 'secondary' : 'ghost'}
          onClick={() => setSortBy('name')}
          size= "sm"
        >
          Sort by Name
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2">
        {deck.length === 0 && (
          <p className="text-gray-400">Add cards from the gallery...</p>
        )}

        {[...deck]
          .sort((a, b) => {
            if (sortBy === 'cost') {
              return (
                a.card.cost - b.card.cost ||
                a.card.name.localeCompare(b.card.name)
              );
            }
            if (sortBy === 'name') {
              return a.card.name.localeCompare(b.card.name);
            }
            return 0;
          })
          .map(({ card, count }) => (
            <div
              key={card.id}
              className="flex justify-between items-center bg-gray-800 p-2 rounded"
            >
              <div className="flex-grow">
                <span className="font-semibold">{card.name}</span>
                <p className="text-xs text-gray-400">Cost: {card.cost}</p>
              </div>
              <span className="font-bold mx-4">x{count}</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 hover:bg-red-900/50"
                onClick={() => removeCard(card.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full mt-6" disabled={deck.length === 0 || !user}>
            {user ? 'Save Deck' : 'Log in to save'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Your Deck</AlertDialogTitle>
            <AlertDialogDescription>
              Give your new deck a name.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="My Awesome Deck"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveDeck}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}