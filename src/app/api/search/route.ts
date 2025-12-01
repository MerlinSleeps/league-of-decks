import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cards } from '@/db/schema';
import { ilike } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const results = await db
            .select({
                id: cards.id,
                name: cards.name,
                image: cards.data,
            })
            .from(cards)
            .where(ilike(cards.name, `%${query}%`))
            .limit(5);

        // Extract image URL from data jsonb
        const formattedResults = results.map(card => {
            const cardData = card.image as { image?: string };
            return {
                id: card.id,
                name: card.name,
                image: cardData?.image || ''
            };
        });

        return NextResponse.json(formattedResults);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
