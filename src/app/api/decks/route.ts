// src/app/api/decks/route.ts

import { adminDb } from '@/lib/firebaseAdmin';
import { auth as adminAuth } from 'firebase-admin'; // Import Admin Auth
import { DeckEntry } from '@/context/DeckBuilderContext';
import { headers } from 'next/headers'; // Used to get the auth token
import { NextResponse } from 'next/server';

// This is our POST function
export async function POST(request: Request) {
  try {
    // 1. Get the user's ID token from the request headers
    const authorization = (await headers()).get('Authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify the token using Firebase Admin
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // 3. Get the deck data from the request body
    const { name, deck } = (await request.json()) as {
      name: string;
      deck: DeckEntry[];
    };

    if (!name || !deck || deck.length === 0) {
      return NextResponse.json({ error: 'Invalid deck data' }, { status: 400 });
    }

    // 4. Create the new deck document in our Firestore subcollection
    const newDeckRef = await adminDb
      .collection('users')
      .doc(userId)
      .collection('decks')
      .add({
        name: name,
        cards: deck, // Save the array of cards
        createdAt: new Date(),
      });

    // 5. Return a success message with the new deck's ID
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