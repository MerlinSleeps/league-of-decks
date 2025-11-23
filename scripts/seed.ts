/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');
const cardData = require('../data/cards.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function seedDatabase() {
  const cardsCollection = db.collection('cards');

  for (const card of cardData) {
    const docRef = cardsCollection.doc(card.id);
    await docRef.set(card);
    console.log(`Updated card: ${card.name}`);
  }
}

seedDatabase();