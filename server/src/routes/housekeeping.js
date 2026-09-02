import { Router } from 'express';
import { db, isInitialized } from '../config/firebase.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

let memoryTasks = [
  { id: 'hk-1', roomNumber: '103', assignedToName: 'Elena Rostova', priority: 'high', status: 'todo', notes: 'Full change of linens, deep vacuum, restock coffee bar.', dueTime: '11:30 AM' },
  { id: 'hk-2', roomNumber: '301', assignedToName: 'Maria Silva', priority: 'high', status: 'in-progress', notes: 'Suite checkout cleaning. Inspection required prior to 2 PM.', dueTime: '1:00 PM' },
  { id: 'hk-3', roomNumber: '204', assignedToName: 'Elena Rostova', priority: 'medium', status: 'done', notes: 'Turn-down service completed. Bath amenities replenished.', dueTime: '10:00 AM' },
  { id: 'hk-4', roomNumber: '302', assignedToName: 'Maintenance Team', priority: 'low', status: 'todo', notes: 'Shower mixer inspection & HVAC filter swap.', dueTime: '4:00 PM' },
];

router.get('/', verifyAuth, async (req, res) => {
  try {
    if (!isInitialized) return res.json(memoryTasks);
    const snap = await db.collection('housekeepingTasks').get();
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isInitialized) {
      const task = memoryTasks.find((t) => t.id === id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      task.status = status;
      return res.json(task);
    }

    await db.collection('housekeepingTasks').doc(id).update({ status });
    res.json({ id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
