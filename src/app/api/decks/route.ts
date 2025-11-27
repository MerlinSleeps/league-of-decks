// src/app/api/decks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { createFirebaseAdminApp } from '@/lib/firebaseAdmin';
import { createDeck, ensureUserExists, getUserDecks } from '@/lib/decks';

// Initialize Admin SDK to verify tokens
createFirebaseAdminApp({
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!,
});

// GET: Fetch the authenticated user's decks
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const decks = await getUserDecks(userId);

    return NextResponse.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Save a new deck
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email || 'no-email';

    // 1. Ensure User exists in Neon (using Firebase UID as the primary key)
    await ensureUserExists(userId, email);

    // 2. Parse body
    const body = await request.json();
    const { name, deck } = body;

    // Note: Your frontend sends `deck` as an object { legend, mainDeck, etc. }
    // You need to flatten this into a single list of DeckEntry for the database function
    // or update the createDeck function to handle the separated structure.
    // For simplicity, let's assume we combine them here:
    const allCards = [
      ...(deck.legend ? [{ card: deck.legend, count: 1 }] : []),
      ...deck.mainDeck,
      ...deck.runeDeck,
      ...deck.battlefieldDeck
    ];

    // 3. Save to Neon
    const deckId = await createDeck(userId, name, allCards);

    return NextResponse.json({ success: true, deckId });
  } catch (error) {
    console.error('Error saving deck:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}