"use client";

import { useState, useMemo } from 'react';
import type { Card } from '@/types/card';
import { useDeckBuilder } from '@/context/DeckBuilderContext';
import { CardImage } from '@/components/ui/CardImage';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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

function DraggableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `grid-${card.id}`,
    data: {
      source: 'grid',
      card: card,
    },
  });

  // We don't apply transform to the original card in the grid.
  // It stays in place (remnant) while the DragOverlay follows the mouse.
  const style = undefined;

  const { addCard } = useDeckBuilder();

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <ShadCard className="flex flex-col justify-between overflow-hidden h-full">
        <CardHeader>
          <CardTitle className="text-lg">{card.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...listeners}
            {...attributes}
            className="aspect-[3/4] w-full relative mb-2 rounded-md overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-purple-500 transition-all"
          >
            <CardImage
              key={card.art?.thumbnailURL}
              src={card.art?.thumbnailURL}
              alt={""}
            />
          </div>
          <p className="text-sm text-gray-400 mb-2">{card.description}</p>
          <Button
            className="w-full mt-auto"
            variant="outline"
            onClick={() => addCard(card)}
          >
            Add to Deck
          </Button>
        </CardContent>
      </ShadCard>
    </div>
  );
}

export default function BuilderCardGrid({ allCards }: CardGridProps) {
  const [searchText, setSearchText] = useState('');
  const { setNodeRef } = useDroppable({
    id: 'card-grid',
  });

  const filteredCards = useMemo(() => {
    if (!searchText) return allCards;
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allCards, searchText]);

  return (
    <div ref={setNodeRef} className="min-h-[500px]">
      <Input
        placeholder="Search by card name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-sm mb-6 bg-gray-800 border-gray-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}