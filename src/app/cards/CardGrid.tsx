// src/app/cards/CardGrid.tsx

"use client"; // 👈 This makes it a Client Component

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Card } from '@/types/card'; // Make sure this path is correct

// Import shadcn components
import {
  Card as ShadCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // 👈 We'll need the Input

// This component takes the list of all cards as a prop
interface CardGridProps {
  allCards: Card[];
}

export default function CardGrid({ allCards }: CardGridProps) {
  // 1. Create state for the search text
  const [searchText, setSearchText] = useState('');

  // 2. Create the filtered list
  const filteredCards = useMemo(() => {
    // If no search, return all cards
    if (!searchText) {
      return allCards;
    }

    // Otherwise, filter by name
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allCards, searchText]); // Re-run this logic only if cards or search text change

  return (
    <div>
      {/* 3. Add the search bar */}
      <Input
        placeholder="Search by card name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-sm mb-6 bg-gray-800 border-gray-700"
      />

      {/* 4. Render the filtered list */}
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