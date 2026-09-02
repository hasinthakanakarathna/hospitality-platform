import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

// In-memory fallback dataset for local dev testing before Firestore credentials are provided
let memoryRooms = [
  { id: 'room-101', roomNumber: '101', type: 'Single', floor: 1, status: 'available', pricePerNight: 85, amenities: ['wifi', 'tv', 'ac'], guestName: null },
  { id: 'room-102', roomNumber: '102', type: 'Double', floor: 1, status: 'occupied', pricePerNight: 120, amenities: ['wifi', 'tv', 'ac', 'minibar'], guestName: 'Alex Rivera' },
  { id: 'room-103', roomNumber: '103', type: 'Double', floor: 1, status: 'dirty', pricePerNight: 120, amenities: ['wifi', 'tv', 'ac'], guestName: null },
  { id: 'room-201', roomNumber: '201', type: 'Suite', floor: 2, status: 'occupied', pricePerNight: 240, amenities: ['wifi', 'tv', 'ac', 'minibar', 'balcony'], guestName: 'Emily Watson' },
  { id: 'room-202', roomNumber: '202', type: 'Deluxe', floor: 2, status: 'reserved', pricePerNight: 180, amenities: ['wifi', 'tv', 'ac'], guestName: 'Dr. John Doe' },
  { id: 'room-203', roomNumber: '203', type: 'Single', floor: 2, status: 'available', pricePerNight: 95, amenities: ['wifi', 'tv', 'ac'], guestName: null },
  { id: 'room-301', roomNumber: '301', type: 'Suite', floor: 3, status: 'dirty', pricePerNight: 260, amenities: ['wifi', 'tv', 'ac', 'minibar'], guestName: null },
  { id: 'room-302', roomNumber: '302', type: 'Deluxe', floor: 3, status: 'maintenance', pricePerNight: 190, amenities: ['wifi', 'tv'], guestName: null },
];

// GET /api/rooms — accessible to all authenticated staff
router.get('/', verifyAuth, async (req, res) => {
  try {
    if (!isInitialized) {
      return res.json(memoryRooms);
    }
    const snapshot = await db.collection('rooms').get();
    const rooms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms — Admin / Receptionist only
router.post('/', verifyAuth, requireRole(['admin', 'receptionist']), async (req, res) => {
  try {
    const { roomNumber, type, floor, status, pricePerNight, amenities } = req.body;
    if (!roomNumber) {
      return res.status(400).json({ error: 'Room number is required' });
    }

    const newRoom = {
      roomNumber,
      type: type || 'Double',
      floor: Number(floor) || 1,
      status: status || 'available',
      pricePerNight: Number(pricePerNight) || 100,
      amenities: amenities || ['wifi'],
      lastCleaned: new Date().toISOString(),
    };

    if (!isInitialized) {
      const created = { id: `room-${Date.now()}`, ...newRoom };
      memoryRooms.unshift(created);
      return res.status(201).json(created);
    }

    const docRef = await db.collection('rooms').add(newRoom);
    res.status(201).json({ id: docRef.id, ...newRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/rooms/:id/status — Housekeeping, Receptionist, Admin
router.patch('/:id/status', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'occupied', 'reserved', 'dirty', 'maintenance'].includes(status)) {
      return res.status(400).json({ error: 'Invalid room status' });
    }

    if (!isInitialized) {
      const room = memoryRooms.find((r) => r.id === id);
      if (!room) return res.status(404).json({ error: 'Room not found' });
      room.status = status;
      return res.json(room);
    }

    await db.collection('rooms').doc(id).update({ status });
    res.json({ id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/rooms/:id — Admin only
router.delete('/:id', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInitialized) {
      memoryRooms = memoryRooms.filter((r) => r.id !== id);
      return res.json({ success: true, message: 'Room deleted' });
    }
    await db.collection('rooms').doc(id).delete();
    res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
