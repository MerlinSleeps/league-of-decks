import { NextResponse } from 'next/server';
import { getAllCards } from '@/lib/cards';

export async function GET() {
  try {
    const allCards = await getAllCards();
    return NextResponse.json(allCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}