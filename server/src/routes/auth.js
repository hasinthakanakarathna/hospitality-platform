import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/auth/me — returns current authenticated user profile and assigned role
router.get('/me', verifyAuth, async (req, res) => {
  try {
    if (!isInitialized) {
      return res.json({
        uid: req.user.uid,
        name: req.user.name || 'Demo User',
        email: req.user.email,
        role: req.user.role || 'admin',
      });
    }

    const doc = await db.collection('users').doc(req.user.uid).get();
    if (!doc.exists) {
      // First time login auto-sync
      const newProfile = {
        uid: req.user.uid,
        name: req.user.name || req.user.email.split('@')[0],
        email: req.user.email,
        role: 'receptionist',
        createdAt: new Date().toISOString(),
      };
      await db.collection('users').doc(req.user.uid).set(newProfile);
      return res.json(newProfile);
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
