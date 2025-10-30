"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Card } from '@/types/card';

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
              <CardContent>
                <div className="aspect-[3/4] w-full bg-gray-700 rounded-md mb-2">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <p className="text-sm text-gray-400">{card.text}</p>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">Cost: {card.cost}</p>
              </CardFooter>
            </ShadCard>
          </Link>
        ))}
      </div>
    </div>
  );
}