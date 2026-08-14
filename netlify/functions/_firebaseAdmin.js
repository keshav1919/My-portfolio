import admin from 'firebase-admin';

let isInitialized = false;

export function getFirebaseAdmin() {
  if (isInitialized && admin.apps.length > 0) {
    return admin;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id || 'keshavcoder-web',
        });
      }
      isInitialized = true;
      return admin;
    } catch (err) {
      console.warn('[_firebaseAdmin] Invalid FIREBASE_SERVICE_ACCOUNT JSON:', err.message);
    }
  }

  // Attempt default application credential if in Google Cloud / Firebase environment
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'keshavcoder-web',
      });
      isInitialized = true;
      return admin;
    } catch {
      // Ignored if local without credentials
    }
  }

  return admin.apps.length ? admin : null;
}

/**
 * Authoritative server-side account existence check.
 * Checks both Firebase Auth and Firestore users collection.
 */
export async function checkUserExists(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  if (!normalizedEmail) return false;

  const fbAdmin = getFirebaseAdmin();
  if (!fbAdmin || !fbAdmin.apps.length) {
    // If Admin SDK is not initialized, log notice and return true or handle safely
    console.warn('[_firebaseAdmin] Admin SDK not configured with service account. Set FIREBASE_SERVICE_ACCOUNT in Netlify.');
    return true; // Fallback in non-configured dev environments to allow dev testing
  }

  try {
    // 1. Authoritative check in Firebase Auth
    const userRecord = await fbAdmin.auth().getUserByEmail(normalizedEmail);
    if (userRecord && userRecord.uid) {
      return true;
    }
  } catch (authErr) {
    if (authErr.code === 'auth/user-not-found') {
      // Check secondary Firestore users collection
      try {
        const snap = await fbAdmin
          .firestore()
          .collection('users')
          .where('email', '==', normalizedEmail)
          .limit(1)
          .get();
        return !snap.empty;
      } catch (fsErr) {
        console.warn('[_firebaseAdmin Firestore check]', fsErr.message);
        return false;
      }
    }
    console.warn('[_firebaseAdmin Auth check]', authErr.message);
  }

  return false;
}
