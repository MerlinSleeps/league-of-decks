import { getAllCards, CardFilters } from '@/lib/cards';
import CardGrid from './CardGrid';

export const revalidate = 0; // Disable cache to see live changes

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseSearchQuery(input: string) {
  const tagMatches = input.match(/"([^"]+)"/g);

  const tags = tagMatches
    ? tagMatches.map(t => t.replace(/"/g, '').trim())
    : [];

  const name = input.replace(/"([^"]+)"/g, '').replace(/\s+/g, ' ').trim();

  return { name, tags };
}

export default async function CardsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const rawName = (searchParams.name as string) || '';

  const { name, tags } = parseSearchQuery(rawName);

  const parseArray = (param: string | string[] | undefined) => {
    if (!param) return undefined;
    return Array.isArray(param) ? param : [param];
  };

  const filters: CardFilters = {
    name: name,
    tags: tags,
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
      <CardGrid
        initialCards={allCards}
      />
    </main>
  );
}