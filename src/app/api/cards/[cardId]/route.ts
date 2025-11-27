import { NextRequest, NextResponse } from 'next/server';
import { getCardById } from '@/lib/cards';

interface Context {
    params: Promise<{
        cardId: string;
    }>;
}

export async function GET(request: NextRequest, context: Context) {
    try {
        const { cardId } = await context.params;

        const card = await getCardById(cardId);

        if (!card) {
            return NextResponse.json(
                { error: `Card with ID ${cardId} not found.` },
                { status: 404 }
            );
        }

        return NextResponse.json(card);

    } catch (error) {
        console.error('Error fetching card:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}