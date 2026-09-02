import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/summary', verifyAuth, requireRole(['admin']), async (req, res) => {
  res.json({
    occupancyRate: 81.5,
    averageDailyRate: 158.00,
    monthlyRevenue: 47850,
    weeklyOccupancy: [
      { day: 'Mon', rate: 64 },
      { day: 'Tue', rate: 70 },
      { day: 'Wed', rate: 78 },
      { day: 'Thu', rate: 85 },
      { day: 'Fri', rate: 94 },
      { day: 'Sat', rate: 98 },
      { day: 'Sun', rate: 82 },
    ],
    revenueByType: [
      { type: 'Single', revenue: 4250 },
      { type: 'Double', revenue: 9800 },
      { type: 'Deluxe', revenue: 14200 },
      { type: 'Suite', revenue: 19600 },
    ],
  });
});

export default router;
