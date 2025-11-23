const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');
const cardData = require('../data/cards.json');

import type { Card } from '../src/types/card';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function seedDatabase() {
  const cardsCollection = db.collection('cards');

  // It reads the NEW json file here
  for (const card of cardData) {
    const docRef = cardsCollection.doc(card.id);
    await docRef.set(card); // Overwrites the old doc with the new structure
    console.log(`Updated card: ${card.name}`);
  }
}

seedDatabase();