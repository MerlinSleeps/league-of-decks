import { getFirestore } from '@/lib/firebaseAdmin';
import { auth as adminAuth } from 'firebase-admin';
import { DeckEntry } from '@/types/card';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authorization = (await headers()).get('Authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { name, deck } = (await request.json()) as {
      name: string;
      deck: DeckEntry[];
    };

    if (!name || !deck || deck.length === 0) {
      return NextResponse.json({ error: 'Invalid deck data' }, { status: 400 });
    }

    const newDeckRef = await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('decks')
      .add({
        name: name,
        cards: deck,
        createdAt: new Date(),
      });

    return NextResponse.json({
      message: 'Deck saved successfully!',
      deckId: newDeckRef.id,
    });

  } catch (error) {
    console.error('Error saving deck:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}