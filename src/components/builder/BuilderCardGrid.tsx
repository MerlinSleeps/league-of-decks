"use client";

import { useState, useMemo } from 'react';
import type { Card } from '@/types/card';
import { useDeckBuilder } from '@/context/DeckBuilderContext';

import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CardGridProps {
  allCards: Card[];
}

export default function BuilderCardGrid({ allCards }: CardGridProps) {
  const { addCard } = useDeckBuilder();
  const [searchText, setSearchText] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchText) return allCards;
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allCards, searchText]);

  return (
    <div>
      <Input
        placeholder="Search by card name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-sm mb-6 bg-gray-800 border-gray-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCards.map((card) => (
          <ShadCard
            key={card.id}
            className="flex flex-col justify-between overflow-hidden"
          >
            <CardHeader>
              <CardTitle className="text-lg">{card.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full rounded-md mb-2 aspect-[3/4] object-cover"
              />
              <Button
                className="w-full"
                variant="outline"
                onClick={() => addCard(card)}
              >
                Add to Deck
              </Button>
            </CardContent>
          </ShadCard>
        ))}
      </div>
    </div>
  );
}