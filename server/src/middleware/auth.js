/**
 * Auth Middleware
 * Verifies the Firebase ID token in Authorization header.
 * Falls back to demo user decoding if in localhost dev mode.
 */
import { auth, db, isInitialized } from '../config/firebase.js';

export async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If running in local dev mode without Firebase credentials, attach demo admin
    if (!isInitialized) {
      req.user = {
        uid: 'demo_admin',
        email: 'admin@stayflow.com',
        name: 'Demo Admin',
        role: 'admin',
      };
      return next();
    }
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];

  if (!isInitialized) {
    // Local dev mode with Bearer token
    req.user = {
      uid: 'demo_user',
      email: 'user@stayflow.com',
      role: 'admin',
    };
    return next();
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    
    // Fetch user profile from Firestore to obtain their assigned role
    let role = 'receptionist';
    try {
      const userDoc = await db.collection('users').doc(decoded.uid).get();
      if (userDoc.exists) {
        role = userDoc.data().role || 'receptionist';
        req.userProfile = userDoc.data();
      }
    } catch (dbErr) {
      console.warn('Could not read user profile from Firestore:', dbErr.message);
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email,
      role,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
