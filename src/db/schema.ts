import { pgTable, text, integer, timestamp, jsonb, uuid, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    username: text('username'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cards = pgTable('cards', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    cost: integer('cost').notNull(),
    power: integer('power').notNull(),
    might: integer('might').notNull(),
    faction: text('faction').notNull(),
    type: text('type').notNull(),
    rarity: text('rarity').notNull(),
    data: jsonb('data').notNull(),
});

export const visibilityEnum = pgEnum('visibility', ['public', 'private']);

export const decks = pgTable('decks', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    visibility: visibilityEnum('visibility').default('private').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deckCards = pgTable('deck_cards', {
    deckId: uuid('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
    cardId: text('card_id').notNull().references(() => cards.id),
    count: integer('count').notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.deckId, t.cardId] }),
}));

export const deckRelations = relations(decks, ({ one, many }) => ({
    owner: one(users, {
        fields: [decks.userId],
        references: [users.id],
    }),
    cards: many(deckCards),
}));

export const deckCardsRelations = relations(deckCards, ({ one }) => ({
    deck: one(decks, {
        fields: [deckCards.deckId],
        references: [decks.id],
    }),
    card: one(cards, {
        fields: [deckCards.cardId],
        references: [cards.id],
    }),
}));