"use client";

import { useState, useMemo } from 'react';
import type { Card } from '@/types/card';
import { useDeckBuilder } from '@/context/DeckBuilderContext';
import { CardImage } from '@/components/ui/CardImage';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  Card as ShadCard,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

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

  const style = undefined;

  const {
    addCard,
    mainDeck,
    runeDeck,
    battlefieldDeck,
    removeFromMainDeck,
    removeFromRuneDeck,
    removeFromBattlefieldDeck
  } = useDeckBuilder();

  const count = useMemo(() => {
    const inMain = mainDeck.find(e => e.card.id === card.id);
    if (inMain) return inMain.count;
    const inRune = runeDeck.find(e => e.card.id === card.id);
    if (inRune) return inRune.count;
    const inBattlefield = battlefieldDeck.find(e => e.card.id === card.id);
    if (inBattlefield) return inBattlefield.count;
    return 0;
  }, [mainDeck, runeDeck, battlefieldDeck, card.id]);

  const handleRemove = () => {
    if (mainDeck.some(e => e.card.id === card.id)) removeFromMainDeck(card.id);
    else if (runeDeck.some(e => e.card.id === card.id)) removeFromRuneDeck(card.id);
    else if (battlefieldDeck.some(e => e.card.id === card.id)) removeFromBattlefieldDeck(card.id);
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full group relative">
      <ShadCard className="flex flex-col justify-between overflow-hidden h-full border-0 bg-transparent">
        <CardContent className="p-0 relative">
          <div
            {...listeners}
            {...attributes}
            className="aspect-[3/4] w-full relative rounded-md overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-purple-500 transition-all"
          >
            <CardImage
              key={card.art?.thumbnailURL}
              src={card.art?.thumbnailURL}
              alt={""}
            />
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag start if clicking button
                handleRemove();
              }}
              disabled={count === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="text-white font-bold min-w-[1.5rem] text-center">{count}</span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                addCard(card);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
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