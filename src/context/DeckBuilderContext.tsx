// src/context/DeckBuilderContext.tsx

"use client";

import type { Card } from '@/types/card';
import React, { createContext, useContext, useState } from 'react';

// This will be the shape of a card *inside* our deck list
export interface DeckEntry {
  card: Card;
  count: number;
}

// This is the shape of our context
interface DeckBuilderContextType {
  deck: DeckEntry[];
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  // We'll add saveDeck() here later
}

// Create the context
const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(
  undefined
);

// Create the Provider component
export const DeckBuilderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [deck, setDeck] = useState<DeckEntry[]>([]);

  // Logic to add a card to the deck
  const addCard = (cardToAdd: Card) => {
    setDeck((currentDeck) => {
      const existingEntry = currentDeck.find(
        (entry) => entry.card.id === cardToAdd.id
      );

      if (existingEntry) {
        // Card already in deck, increment count
        return currentDeck.map((entry) =>
          entry.card.id === cardToAdd.id
            ? { ...entry, count: entry.count + 1 }
            : entry
        );
      } else {
        // Card not in deck, add it with count 1
        return [...currentDeck, { card: cardToAdd, count: 1 }];
      }
    });
  };

  // Logic to remove a card from the deck
  const removeCard = (cardId: string) => {
    setDeck((currentDeck) => {
      const existingEntry = currentDeck.find(
        (entry) => entry.card.id === cardId
      );

      if (existingEntry && existingEntry.count > 1) {
        // Card has count > 1, decrement count
        return currentDeck.map((entry) =>
          entry.card.id === cardId
            ? { ...entry, count: entry.count - 1 }
            : entry
        );
      } else {
        // Card has count 1 or doesn't exist, remove it
        return currentDeck.filter((entry) => entry.card.id !== cardId);
      }
    });
  };

  return (
    <DeckBuilderContext.Provider value={{ deck, addCard, removeCard }}>
      {children}
    </DeckBuilderContext.Provider>
  );
};

// Custom hook to easily use the context
export const useDeckBuilder = () => {
  const context = useContext(DeckBuilderContext);
  if (context === undefined) {
    throw new Error('useDeckBuilder must be used within a DeckBuilderProvider');
  }
  return context;
};