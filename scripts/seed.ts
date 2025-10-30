// scripts/seed.ts

// USE 'require' for JavaScript packages
const admin = require('firebase-admin');

// USE 'require' for JSON files
const serviceAccount = require('../serviceAccountKey.json'); 
const cardData = require('../data/cards.json');

// KEEP 'import type' for TypeScript types
import type { Card } from '../src/types/card'; 

// Check if the app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function seedDatabase() {
  console.log('Starting to seed database...');

  const cardsCollection = db.collection('cards');
  
  const cards = cardData as Card[]; 

  for (const card of cards) {
    const docRef = cardsCollection.doc(card.id);
    
    try {
      await docRef.set(card);
      console.log(`Successfully added card: ${card.name}`);
    } catch (error) {
      console.error(`Error adding card ${card.name}: `, error);
    }
  }

  console.log('Database seeding finished!');
}

// Run the function
seedDatabase();