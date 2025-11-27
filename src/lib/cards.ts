import { db } from '@/db';
import { cards } from '@/db/schema';
import { eq, and, gte, lte, like, SQL } from 'drizzle-orm';
import type { Card } from '@/types/card';

export interface CardFilters {
    name?: string;
    faction?: string;
    minCost?: number;
    maxCost?: number;
    rarity?: string;
}

export async function getAllCards(filters: CardFilters = {}): Promise<Card[]> {
    const conditions: SQL[] = [];

    if (filters.name) {
        conditions.push(like(cards.name, `%${filters.name}%`));
    }
    if (filters.faction) {
        conditions.push(eq(cards.faction, filters.faction));
    }
    if (filters.minCost !== undefined) {
        conditions.push(gte(cards.cost, filters.minCost));
    }
    if (filters.maxCost !== undefined) {
        conditions.push(lte(cards.cost, filters.maxCost));
    }
    if (filters.rarity) {
        conditions.push(eq(cards.rarity, filters.rarity));
    }

    const result = await db
        .select()
        .from(cards)
        .where(and(...conditions))
        .orderBy(cards.name);

    return result.map((row) => row.data as unknown as Card);
}