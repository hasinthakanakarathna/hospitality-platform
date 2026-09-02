/**
 * Firebase Admin SDK Configuration
 * 
 * Supports:
 * 1. FIREBASE_SERVICE_ACCOUNT_JSON (stringified json, recommended for Render deployment)
 * 2. FIREBASE_SERVICE_ACCOUNT_PATH (file path for local development)
 * 3. Fallback dev mode if no credentials supplied yet (prevents crashing on initial localhost tests)
 */
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let isInitialized = false;
let db = null;
let auth = null;

try {
  let credential = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const keyPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    }
  }

  if (credential) {
    admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    db = admin.firestore();
    auth = admin.auth();
    isInitialized = true;
    console.log('✓ Firebase Admin SDK connected to Firestore');
  } else {
    console.warn('⚠️ No Firebase service account credentials found in .env');
    console.warn('⚠️ Server running in Local Standalone / Mock Mode for fast prototyping');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
}

export { admin, db, auth, isInitialized };
