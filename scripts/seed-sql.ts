import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/db/schema';
import apiResponse from '../data/RIFTBOUND_DUMMY_DATA_NOV-2025.json';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    throw new Error('❌ No database connection string found! Check your .env.local file.');
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
});

const db = drizzle(pool, { schema });

async function seed() {
    console.log('🌱 Seeding Cards to SQL...');

    const allCards = apiResponse.sets.flatMap((set) => set.cards);

    console.log(`Found ${allCards.length} cards across ${apiResponse.sets.length} sets.`);

    let count = 0;
    for (const card of allCards) {
        await db.insert(schema.cards).values({
            id: card.id,
            name: card.name,
            cost: card.stats.cost,
            power: card.stats.power,
            might: card.stats.might,
            faction: card.faction,
            type: card.type,
            rarity: card.rarity,
            data: card,
        }).onConflictDoUpdate({
            target: schema.cards.id,
            set: {
                name: card.name,
                data: card
            }
        });
        count++;
    }

    console.log(`✅ Seeding Complete! Updated ${count} cards.`);
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});