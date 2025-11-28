import { getAllCards, CardFilters } from '@/lib/cards';
import CardGrid from './CardGrid';

export const revalidate = 0; // Disable cache to see live changes

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CardsPage(props: PageProps) {
  // Await params for Next.js 15+
  const searchParams = await props.searchParams;

  // Helper to parse array params (e.g. ?factions=Fury&factions=Spirit)
  const parseArray = (param: string | string[] | undefined) => {
    if (!param) return undefined;
    return Array.isArray(param) ? param : [param];
  };

  const filters: CardFilters = {
    name: searchParams.name as string,
    category: (searchParams.category as any) || 'MainDeck',
    factions: parseArray(searchParams.factions),
    rarity: searchParams.rarity as string,
    types: parseArray(searchParams.types),
    sort: searchParams.sort as any,
    order: searchParams.order as any,
  };

  const allCards = await getAllCards(filters);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Card Gallery</h1>
      {/* We pass the cards AND the current filters so the UI can stay in sync */}
      <CardGrid
        initialCards={allCards}
      // We can pass the server-parsed filters back to the client to set initial state
      />
    </main>
  );
}