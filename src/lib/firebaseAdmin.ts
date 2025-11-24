import * as admin from 'firebase-admin';

interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}
// TODO: Look for a better way to handle this
function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(config: FirebaseAdminConfig) {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: formatPrivateKey(config.privateKey),
    }),
  });
}

export function getFirestore() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    if (!privateKey) {
      throw new Error('Missing Firebase Admin private key. Check .env.local (local) or Vercel Env Vars (production).');
    }
    if (!clientEmail) {
      throw new Error('Missing Firebase Admin client email. Check .env.local (local) or Vercel Env Vars (production).');
    }
    if (!projectId) {
      throw new Error('Missing Firebase Admin project ID. Check .env.local (local) or Vercel Env Vars (production).');
    }
    throw new Error(
      'Missing Firebase Admin keys. Check .env.local (local) or Vercel Env Vars (production).'
    );
  }

  if (!admin.apps.length) {
    // TODO: Look for a better way to handle this
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  return admin.firestore();
}