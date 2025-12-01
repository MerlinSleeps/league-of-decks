import { db } from '@/db';
import { cards } from '@/db/schema';
import { eq, and, gte, lte, ilike, or, SQL, sql } from 'drizzle-orm';
import type { Card } from '@/types/card';
import { CARD_TYPE } from '@/constants/card-type';
import { CardFilters } from '@/lib/filter-utils';

export async function getAllCards(filters: CardFilters = {}): Promise<Card[]> {
    const conditions: SQL[] = [];

    // 1. Text Search (Case insensitive)
    if (filters.name) {
        conditions.push(ilike(cards.name, `%${filters.name}%`));
    }

    // 2. Factions (OR logic: Card matches ANY of the selected factions)
    if (filters.factions && filters.factions.length > 0) {
        const factionConditions = filters.factions.map(f =>
            ilike(cards.faction, `%${f}%`)
        );
        conditions.push(or(...factionConditions)!);
    }

    // 3. Rarity
    if (filters.rarity) {
        conditions.push(eq(cards.rarity, filters.rarity));
    } else {
        // By default, hide Showcase cards unless specifically asked for
        conditions.push(sql`${cards.rarity} != 'Showcase'`);
    }

    // 4. Category Filter (The Main Toggles)
    if (filters.category) {
        switch (filters.category) {
            case 'Legend':
                conditions.push(ilike(cards.type, `%${CARD_TYPE.Legend}%`));
                break;
            case 'Battlefield':
                conditions.push(ilike(cards.type, `%${CARD_TYPE.Battlefield}%`));
                break;
            case 'Rune':
                conditions.push(ilike(cards.type, `%${CARD_TYPE.Rune}%`));
                break;
            case 'MainDeck':
                // Main Deck = NOT Legend AND NOT Battlefield AND NOT Rune
                conditions.push(and(
                    sql`${cards.type} NOT ILIKE ${`%${CARD_TYPE.Legend}%`}`,
                    sql`${cards.type} NOT ILIKE ${`%${CARD_TYPE.Battlefield}%`}`,
                    sql`${cards.type} NOT ILIKE ${`%${CARD_TYPE.Rune}%`}`
                )!);
                break;
        }
    }

    // 5. Tags
    if (filters.tags) {
        conditions.push(sql`${cards.data}->'tags' @> ${JSON.stringify(filters.tags)}`);
    }

    // 6. Sorting
    let orderByClause: any = cards.name; // Default
    if (filters.sort === 'cost') orderByClause = cards.cost;
    if (filters.sort === 'might') orderByClause = cards.might;

    const query = db
        .select()
        .from(cards)
        .where(and(...conditions))
        .$dynamic();

    // Apply Sort Direction
    if (filters.order === 'desc') {
        // @ts-ignore - Drizzle dynamic sort handling
        await query.orderBy(sql`${orderByClause} DESC`);
    } else {
        // @ts-ignore
        await query.orderBy(orderByClause);
    }

    const result = await query;
    return result.map((row) => row.data as unknown as Card);
}

export async function getCardById(cardId: string): Promise<Card | null> {
    const result = await db
        .select()
        .from(cards)
        .where(eq(cards.id, cardId))
        .limit(1);

    if (result.length === 0) return null;
    return result[0].data as unknown as Card;
}