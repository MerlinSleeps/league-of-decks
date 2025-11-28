"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Card } from '@/types/card';
import { CardImage } from '@/components/ui/CardImage';
import { CARD_TYPE } from '@/constants/card-type';
import {
  Card as ShadCard,
  CardContent,
} from '@/components/ui/card';
import { CardToolBar, FilterType, SortOption, SortDirection } from '@/components/ui/CardToolBar';
import { Domain } from '@/constants/domains';

interface CardGridProps {
  allCards: Card[];
}

export default function CardGrid({ allCards }: CardGridProps) {
  // Search & Basic Filter State
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('MainDeck');

  // Advanced Filter State
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [factionFilter, setFactionFilter] = useState<Domain[]>([]);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [cardTypeFilter, setCardTypeFilter] = useState<string | null>(null);

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

  const gridColsClass = activeFilter === 'Battlefield'
    ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
    : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';

  return (
    <div>
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

      <div className={`grid ${gridColsClass} gap-4`}>
        {filteredCards.map((card) => {
          const isBattlefield = card.type.includes(CARD_TYPE.Battlefield);
          const aspectRatioClass = isBattlefield ? 'aspect-[4/3]' : 'aspect-[3/4]';

          return (
            <Link href={`/cards/${card.id}`} key={card.id}>
              <ShadCard className="flex flex-col justify-between overflow-hidden h-full hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow border-0 bg-transparent">
                <CardContent className="p-0">
                  <div className={`${aspectRatioClass} w-full relative rounded-md overflow-hidden`}>
                    <CardImage
                      key={card.art?.thumbnailURL}
                      src={card.art?.thumbnailURL}
                      alt={""}
                    />
                  </div>
                </CardContent>
              </ShadCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}