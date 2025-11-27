import { db } from '@/db';
import { decks, deckCards, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { DeckEntry } from '@/types/card';

export async function ensureUserExists(userId: string, email: string) {
    await db
        .insert(users)
        .values({
            id: userId,
            email: email,
        })
        .onConflictDoNothing();
}

export async function createDeck(
    userId: string,
    deckName: string,
    deckEntries: DeckEntry[]
) {
    return await db.transaction(async (tx) => {
        const [newDeck] = await tx
            .insert(decks)
            .values({
                userId: userId,
                name: deckName,
                visibility: 'private',
            })
            .returning({ id: decks.id });

        if (!newDeck) throw new Error('Failed to create deck');

        const cardsToInsert = deckEntries.map((entry) => ({
            deckId: newDeck.id,
            cardId: entry.card.id,
            count: entry.count,
        }));

        if (cardsToInsert.length > 0) {
            await tx.insert(deckCards).values(cardsToInsert);
        }

        return newDeck.id;
    });
}

export async function getUserDecks(userId: string) {
    return await db
        .select()
        .from(decks)
        .where(eq(decks.userId, userId))
        .orderBy(desc(decks.createdAt));
}