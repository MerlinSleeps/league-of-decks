// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    // These are the environment variables we will set in Vercel
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
      throw new Error('Missing Firebase Admin SDK environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

adminDb = admin.firestore();

export { adminDb };