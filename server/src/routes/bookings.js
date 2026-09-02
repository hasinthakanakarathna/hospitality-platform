import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

let memoryBookings = [
  {
    id: 'b-101',
    guestId: 'g-1',
    guestName: 'Alex Rivera',
    roomId: 'room-102',
    roomNumber: '102',
    checkIn: '2026-09-02',
    checkOut: '2026-09-05',
    status: 'checked-in',
    totalAmount: 360,
    createdAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'b-102',
    guestId: 'g-2',
    guestName: 'Emily Watson',
    roomId: 'room-201',
    roomNumber: '201',
    checkIn: '2026-09-01',
    checkOut: '2026-09-06',
    status: 'checked-in',
    totalAmount: 1200,
    createdAt: '2026-08-28T14:30:00Z',
  },
  {
    id: 'b-103',
    guestId: 'g-3',
    guestName: 'Dr. John Doe',
    roomId: 'room-202',
    roomNumber: '202',
    checkIn: '2026-09-03',
    checkOut: '2026-09-07',
    status: 'confirmed',
    totalAmount: 720,
    createdAt: '2026-09-01T09:15:00Z',
  },
];

// Helper: check date overlap
function hasDateConflict(startA, endA, startB, endB) {
  const a1 = new Date(startA).getTime();
  const a2 = new Date(endA).getTime();
  const b1 = new Date(startB).getTime();
  const b2 = new Date(endB).getTime();
  return a1 < b2 && a2 > b1;
}

// GET /api/bookings — Admin & Receptionist only
router.get('/', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    if (!isInitialized) {
      return res.json(memoryBookings);
    }
    const snapshot = await db.collection('bookings').orderBy('checkIn', 'desc').get();
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings — Create booking with conflict detection
router.post('/', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    const { guestId, guestName, roomId, roomNumber, checkIn, checkOut, totalAmount } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required booking fields (roomId, checkIn, checkOut)' });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Double-booking conflict check
    if (!isInitialized) {
      const conflict = memoryBookings.find(
        (b) =>
          b.roomId === roomId &&
          ['confirmed', 'checked-in'].includes(b.status) &&
          hasDateConflict(checkIn, checkOut, b.checkIn, b.checkOut)
      );

      if (conflict) {
        return res.status(409).json({
          error: `Double-booking conflict: Room ${roomNumber || roomId} is already booked from ${conflict.checkIn} to ${conflict.checkOut}`,
        });
      }

      const newBooking = {
        id: `b-${Date.now()}`,
        guestId: guestId || 'g-guest',
        guestName: guestName || 'Guest',
        roomId,
        roomNumber: roomNumber || '101',
        checkIn,
        checkOut,
        status: 'confirmed',
        totalAmount: Number(totalAmount) || 200,
        createdAt: new Date().toISOString(),
      };
      memoryBookings.unshift(newBooking);
      return res.status(201).json(newBooking);
    }

    // Firestore conflict query
    const existingSnap = await db
      .collection('bookings')
      .where('roomId', '==', roomId)
      .where('status', 'in', ['confirmed', 'checked-in'])
      .get();

    for (const doc of existingSnap.docs) {
      const existing = doc.data();
      if (hasDateConflict(checkIn, checkOut, existing.checkIn, existing.checkOut)) {
        return res.status(409).json({
          error: `Double-booking conflict: Room is already booked from ${existing.checkIn} to ${existing.checkOut}`,
        });
      }
    }

    const bookingData = {
      guestId,
      guestName,
      roomId,
      roomNumber,
      checkIn,
      checkOut,
      status: 'confirmed',
      totalAmount: Number(totalAmount) || 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('bookings').add(bookingData);
    res.status(201).json({ id: docRef.id, ...bookingData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isInitialized) {
      const b = memoryBookings.find((item) => item.id === id);
      if (!b) return res.status(404).json({ error: 'Booking not found' });
      b.status = status;
      return res.json(b);
    }

    await db.collection('bookings').doc(id).update({ status });
    res.json({ id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
