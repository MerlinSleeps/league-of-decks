"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Card } from '@/types/card';
import { CardImage } from '@/components/ui/CardImage';

import {
  Card as ShadCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CardGridProps {
  allCards: Card[];
}

export default function CardGrid({ allCards }: CardGridProps) {
  const [searchText, setSearchText] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchText) {
      return allCards;
    }

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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredCards.map((card) => (
          <Link href={`/cards/${card.id}`} key={card.id}>
            <ShadCard className="flex flex-col justify-between overflow-hidden h-full hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{card.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-[3/4] w-full relative mb-2 rounded-md overflow-hidden">
                  <CardImage
                    key={card.art?.thumbnailURL}
                    src={card.art?.thumbnailURL}
                    alt={card.name}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <p className="text-lg font-bold">Power: {card.stats.power}</p>
                  <p className="text-lg font-bold">Energy: {card.stats.energy}</p>
                  <p className="text-lg font-bold">Might: {card.stats.might}</p>
                </div>
              </CardFooter>
            </ShadCard>
          </Link>
        ))}
      </div>
    </div>
  );
}