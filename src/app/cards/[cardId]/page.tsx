import Image from 'next/image';
import { getCardById } from '@/lib/cards';
import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CardDetailPageProps {
  params: Promise<{
    cardId: string;
  }>;
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { cardId } = await params;
  const card = await getCardById(cardId);

  if (!card) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Card not found</h1>
        <p>We couldn&apos;t find a card with the ID: {cardId}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <ShadCard>
          <CardHeader>
            <CardTitle className="text-2xl">{card.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[560px] mb-4">
              <Image
                src={card.art.fullURL || card.art.thumbnailURL}
                alt={card.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-lg mb-2">{card.description}</p>
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">Power</p>
                <p className="text-xl font-bold">{card.stats.power}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Energy</p>
                <p className="text-xl font-bold">{card.stats.energy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Might</p>
                <p className="text-xl font-bold">{card.stats.might}</p>
              </div>
            </div>
          </CardContent>
        </ShadCard>
      </div>
    </main>
  );
}