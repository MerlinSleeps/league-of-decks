// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// We import the JSON file directly.
// The '../..' goes up from 'src/lib' to the 'src' folder, then to the root.
import serviceAccount from '../../serviceAccountKey.json';

let adminDb: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    // We must cast the imported JSON to the 'ServiceAccount' type
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('❌ Firebase admin initialization error:', error.message);
  }
}

// Assign the firestore instance
adminDb = admin.firestore();

export { adminDb };