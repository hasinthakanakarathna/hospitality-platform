import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

let memoryGuests = [
  { id: 'g-1', name: 'Alex Rivera', email: 'alex.rivera@example.com', phone: '+1 (555) 234-5678', idNumber: 'P9823411', totalStays: 4, notes: 'Prefers high floors away from elevator.' },
  { id: 'g-2', name: 'Emily Watson', email: 'emily.w@example.com', phone: '+1 (555) 891-2345', idNumber: 'DL-88231', totalStays: 2, notes: 'Anniversary trip, requested extra pillows.' },
  { id: 'g-3', name: 'Dr. John Doe', email: 'johndoe.md@example.com', phone: '+1 (555) 432-1098', idNumber: 'US-PASSPORT-321', totalStays: 7, notes: 'VIP business traveler, late check-out requested.' },
];

router.get('/', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    if (!isInitialized) return res.json(memoryGuests);
    const snap = await db.collection('guests').get();
    const guests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    const { name, email, phone, idNumber, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Guest name is required' });

    const newGuest = {
      name,
      email: email || '',
      phone: phone || '',
      idNumber: idNumber || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    if (!isInitialized) {
      const created = { id: `g-${Date.now()}`, ...newGuest, totalStays: 1 };
      memoryGuests.unshift(created);
      return res.status(201).json(created);
    }

    const docRef = await db.collection('guests').add(newGuest);
    res.status(201).json({ id: docRef.id, ...newGuest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
