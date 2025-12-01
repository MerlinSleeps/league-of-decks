import { NextRequest, NextResponse } from 'next/server';
import { getAllCards } from '@/lib/cards';
import { parseCardFilters } from '@/lib/filter-utils';

export async function GET(request: NextRequest) {
    const filters = parseCardFilters(request.nextUrl.searchParams);

    try {
        const data = await getAllCards(filters);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}