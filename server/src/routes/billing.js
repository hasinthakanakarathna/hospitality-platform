import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

let memoryInvoices = [
  { id: 'INV-2026-001', guestName: 'Alex Rivera', roomNumber: '102', issuedDate: '2026-09-02', totalAmount: 385, paid: true },
  { id: 'INV-2026-002', guestName: 'Emily Watson', roomNumber: '201', issuedDate: '2026-09-01', totalAmount: 1350, paid: false },
  { id: 'INV-2026-003', guestName: 'Dr. John Doe', roomNumber: '202', issuedDate: '2026-09-03', totalAmount: 790, paid: true },
];

router.get('/', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    if (!isInitialized) return res.json(memoryInvoices);
    const snap = await db.collection('invoices').orderBy('issuedDate', 'desc').get();
    const invoices = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/toggle-paid', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInitialized) {
      const inv = memoryInvoices.find((item) => item.id === id);
      if (!inv) return res.status(404).json({ error: 'Invoice not found' });
      inv.paid = !inv.paid;
      return res.json(inv);
    }
    const docRef = db.collection('invoices').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Invoice not found' });
    const paid = !doc.data().paid;
    await docRef.update({ paid, paidDate: paid ? new Date().toISOString() : null });
    res.json({ id, paid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
