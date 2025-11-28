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
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { CARD_TYPE } from '@/constants/card-type';
import { CardToolBar, FilterType, SortOption, SortDirection } from '@/components/ui/CardToolBar';
import { Domain } from '@/constants/domains';

interface CardGridProps {
  allCards: Card[];
}

function DraggableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `grid-${card.id}`,
    data: {
      source: 'grid',
      card: card,
    },
  });

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
    <div ref={setNodeRef} className="h-full group relative">
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
                e.stopPropagation();
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
  // Search & Basic Filter State
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('MainDeck');

  // Advanced Filter State
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [factionFilter, setFactionFilter] = useState<Domain[]>([]);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [cardTypeFilter, setCardTypeFilter] = useState<string | null>(null);

  const { setNodeRef } = useDroppable({
    id: 'card-grid',
  });

  const filteredCards = useMemo(() => {
    let cards = allCards;

    // 1. Apply Category Filter (Main Toggles)
    if (activeFilter === 'Legend') {
      cards = cards.filter(c => c.type.includes(CARD_TYPE.Legend));
    } else if (activeFilter === 'Battlefield') {
      cards = cards.filter(c => c.type.includes(CARD_TYPE.Battlefield));
    } else if (activeFilter === 'Rune') {
      cards = cards.filter(c => c.type.includes(CARD_TYPE.Rune));
    } else {
      // Main Deck: Units, Spells, Gear (NOT Legend, NOT Battlefield, NOT Rune)
      cards = cards.filter(c =>
        !c.type.includes(CARD_TYPE.Legend) &&
        !c.type.includes(CARD_TYPE.Battlefield) &&
        !c.type.includes(CARD_TYPE.Rune)
      );
    }

    // 2. Apply Search Filter
    if (searchText) {
      cards = cards.filter((card) =>
        card.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 3. Apply Advanced Filters
    if (factionFilter.length > 0) {
      cards = cards.filter(c => {
        if (!c.faction) return false;
        const cardFactions = c.faction.split(' ');
        return factionFilter.some(f => cardFactions.includes(f));
      });
    }

    if (rarityFilter) {
      cards = cards.filter(c => c.rarity === rarityFilter);
    } else {
      // Default: Exclude Showcase unless explicitly selected
      cards = cards.filter(c => c.rarity !== 'Showcase');
    }

    if (cardTypeFilter && activeFilter === 'MainDeck') {
      cards = cards.filter(c => c.type.includes(cardTypeFilter));
    }

    // 4. Apply Sorting
    cards = [...cards].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'cost':
          comparison = (a.stats.cost || 0) - (b.stats.cost || 0);
          break;
        case 'might':
          comparison = (a.stats.might || 0) - (b.stats.might || 0);
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return cards;
  }, [allCards, searchText, activeFilter, sortOption, sortDirection, factionFilter, rarityFilter, cardTypeFilter]);

  return (
    <div ref={setNodeRef} className="min-h-[500px]">
      <CardToolBar
        searchValue={searchText}
        onSearchChange={setSearchText}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        factionFilter={factionFilter}
        onFactionChange={setFactionFilter}
        rarityFilter={rarityFilter}
        onRarityChange={setRarityFilter}
        cardTypeFilter={cardTypeFilter}
        onCardTypeChange={setCardTypeFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}