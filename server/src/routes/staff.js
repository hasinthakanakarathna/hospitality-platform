import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

let memoryStaff = [
  { uid: 'u-1', name: 'Hasintha (Admin)', email: 'admin@stayflow.com', role: 'admin', joined: '2026-08-15', active: true },
  { uid: 'u-2', name: 'Sarah Jenkins', email: 'reception@stayflow.com', role: 'receptionist', joined: '2026-08-20', active: true },
  { uid: 'u-3', name: 'Elena Rostova', email: 'housekeeping@stayflow.com', role: 'housekeeping', joined: '2026-08-22', active: true },
  { uid: 'u-4', name: 'Maria Silva', email: 'maria.s@stayflow.com', role: 'housekeeping', joined: '2026-08-25', active: true },
];

router.get('/', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    if (!isInitialized) return res.json(memoryStaff);
    const snap = await db.collection('users').get();
    const staff = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const newMember = {
      uid: `u-${Date.now()}`,
      name,
      email,
      role: role || 'receptionist',
      joined: new Date().toISOString().split('T')[0],
      active: true,
    };

    if (!isInitialized) {
      memoryStaff.push(newMember);
      return res.status(201).json(newMember);
    }

    await db.collection('users').doc(newMember.uid).set(newMember);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInitialized) {
      memoryStaff = memoryStaff.filter((s) => s.uid !== id);
      return res.json({ success: true });
    }
    await db.collection('users').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
