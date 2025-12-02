"use client";

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Card } from '@/types/card';
import { CardImage } from '@/components/ui/CardImage';
import { CARD_TYPE } from '@/constants/card-type';
import { Card as ShadCard, CardContent } from '@/components/ui/card';
import { CardToolBar, FilterType, SortOption, SortDirection } from '@/components/ui/CardToolBar';
import { Domain } from '@/constants/domains';

interface CardGridProps {
  initialCards: Card[];
}

export default function CardGrid({ initialCards }: CardGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize state from URL params
  const [searchText, setSearchText] = useState(searchParams.get('name') || '');
  const [activeFilter, setActiveFilter] = useState<FilterType>((searchParams.get('category') as FilterType) || 'All');
  const [sortOption, setSortOption] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name');
  const [sortDirection, setSortDirection] = useState<SortDirection>((searchParams.get('order') as SortDirection) || 'asc');

  const initialFactions = searchParams.getAll('factions') as Domain[];
  const [factionFilter, setFactionFilter] = useState<Domain[]>(initialFactions);

  const [rarityFilter, setRarityFilter] = useState<string | null>(searchParams.get('rarity'));
  const [cardTypeFilter, setCardTypeFilter] = useState<string | null>(searchParams.getAll('types')[0] || null);

  // Effect: Sync State -> URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchText) params.set('name', searchText);
    if (activeFilter) params.set('category', activeFilter);
    if (sortOption) params.set('sort', sortOption);
    if (sortDirection) params.set('order', sortDirection);

    factionFilter.forEach(f => params.append('factions', f));

    if (rarityFilter) params.set('rarity', rarityFilter);
    if (cardTypeFilter) params.append('types', cardTypeFilter);

    // Push new URL. startTransition keeps the UI responsive while loading.
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [searchText, activeFilter, sortOption, sortDirection, factionFilter, rarityFilter, cardTypeFilter, router]);

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

      <div className={`grid ${gridColsClass} gap-4 ${isPending ? 'opacity-50' : ''}`}>
        {initialCards.map((card) => {
          const isBattlefield = card.type.includes(CARD_TYPE.Battlefield);
          const aspectRatioClass = isBattlefield ? 'aspect-[4/3]' : 'aspect-[3/4]';

          return (
            <Link href={`/cards/${card.id}`} key={card.id}>
              <ShadCard className="flex flex-col justify-between overflow-hidden h-full hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow border-0 bg-transparent">
                <CardContent className="p-0">
                  <div className={`${aspectRatioClass} w-full relative rounded-md overflow-hidden`}>
                    <CardImage
                      src={card.art?.thumbnailURL}
                      alt={card.name}
                    />
                  </div>
                </CardContent>
              </ShadCard>
            </Link>
          );
        })}

        {initialCards.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No cards found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}