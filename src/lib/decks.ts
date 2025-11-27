// src/lib/decks.ts
import { db } from '@/db';
import { decks, deckCards, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { DeckEntry } from '@/types/card';

// Helper to ensure user exists in Neon before creating a deck
export async function ensureUserExists(userId: string, email: string) {
    await db
        .insert(users)
        .values({
            id: userId,
            email: email,
        })
        .onConflictDoNothing(); // If they exist, do nothing
}

export async function createDeck(
    userId: string,
    deckName: string,
    deckEntries: DeckEntry[]
) {
    // Use a transaction to ensure both the deck and its cards are saved, or neither
    return await db.transaction(async (tx) => {
        // 1. Create the Deck
        const [newDeck] = await tx
            .insert(decks)
            .values({
                userId: userId,
                name: deckName,
                visibility: 'private',
            })
            .returning({ id: decks.id });

        if (!newDeck) throw new Error('Failed to create deck');

        // 2. Prepare card data
        // We map your frontend DeckEntry[] to the SQL table structure
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
    // Simple query to get decks owned by the user
    return await db
        .select()
        .from(decks)
        .where(eq(decks.userId, userId))
        .orderBy(desc(decks.createdAt));
}