import * as admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json'; // Import your local key

// Helper to initialize
function initAdmin() {
  // Check if already initialized to prevent "duplicate app" errors
  if (!admin.apps.length) {

    // Safety check: ensure the JSON file was imported correctly
    if (!serviceAccount) {
      throw new Error('serviceAccountKey.json is missing or empty');
    }

    admin.initializeApp({
      // We cast it to ServiceAccount to satisfy TypeScript
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    console.log('✅ Firebase Admin SDK initialized with JSON file.');
  }
}

// ⭐️ Export the function
export function getFirestore() {
  initAdmin(); // Initialize only when called
  return admin.firestore();
}