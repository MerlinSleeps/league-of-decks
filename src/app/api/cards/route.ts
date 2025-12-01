import { NextRequest, NextResponse } from 'next/server';
import { getAllCards } from '@/lib/cards';

function parseSearchQuery(input: string) {
    const tagMatches = input.match(/"([^"]+)"/g);

    const tags = tagMatches
        ? tagMatches.map(t => t.replace(/"/g, '').trim())
        : [];
    const name = input.replace(/"([^"]+)"/g, '').replace(/\s+/g, ' ').trim();

    return { name, tags };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const rawNameInput = searchParams.get('name') || '';

    const { name, tags } = parseSearchQuery(rawNameInput);

    const filters = {
        name: name || undefined,
        tags: tags.length > 0 ? tags : undefined,
        category: (searchParams.get('category') as any) || undefined,
        factions: searchParams.getAll('factions'),
        rarity: searchParams.get('rarity') || undefined,
        types: searchParams.getAll('types'),
        sort: (searchParams.get('sort') as any) || undefined,
        order: (searchParams.get('order') as any) || undefined,
    };

    try {
        const data = await getAllCards(filters);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}