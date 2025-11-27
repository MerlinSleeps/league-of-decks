import { db } from '@/db';
import { cards } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Card } from '@/types/card';

export async function getCardById(cardId: string): Promise<Card | null> {
    const result = await db
        .select()
        .from(cards)
        .where(eq(cards.id, cardId))
        .limit(1);

    if (result.length === 0) {
        return null;
    }

    return result[0].data as unknown as Card;
}

export async function getAllCards(): Promise<Card[]> {
    const result = await db.select().from(cards).orderBy(cards.name);
    return result.map((row) => row.data as unknown as Card);
}
