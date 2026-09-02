import { useState } from 'react';
import { Sparkles, Plus, CheckCircle2, Clock, AlertCircle, User, BedDouble } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const INITIAL_TASKS = [
  {
    id: 'hk-1',
    roomNumber: '103',
    assignedToName: 'Elena Rostova',
    priority: 'high',
    status: 'todo',
    notes: 'Full change of linens, deep vacuum, restock coffee bar.',
    dueTime: '11:30 AM',
  },
  {
    id: 'hk-2',
    roomNumber: '301',
    assignedToName: 'Maria Silva',
    priority: 'high',
    status: 'in-progress',
    notes: 'Suite checkout cleaning. Inspection required prior to 2 PM.',
    dueTime: '1:00 PM',
  },
  {
    id: 'hk-3',
    roomNumber: '204',
    assignedToName: 'Elena Rostova',
    priority: 'medium',
    status: 'done',
    notes: 'Turn-down service completed. Bath amenities replenished.',
    dueTime: '10:00 AM',
  },
  {
    id: 'hk-4',
    roomNumber: '302',
    assignedToName: 'Maintenance Team',
    priority: 'low',
    status: 'todo',
    notes: 'Shower mixer inspection & HVAC filter swap.',
    dueTime: '4:00 PM',
  },
];

const COLUMNS = [
  { id: 'todo', title: 'To Do', border: 'border-t-gray-400', countBg: 'bg-gray-100 text-gray-700' },
  { id: 'in-progress', title: 'In Progress', border: 'border-t-amber-500', countBg: 'bg-amber-100 text-amber-700' },
  { id: 'done', title: 'Completed', border: 'border-t-emerald-500', countBg: 'bg-emerald-100 text-emerald-700' },
];

export default function Housekeeping() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const moveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    toast.success(`Task moved to ${newStatus}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Housekeeping Task Board
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Cleaning queues, room turnover assignments, and staff sign-offs
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>
          New Cleaning Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col bg-[#f0f2f5] rounded-xl border border-border-light min-h-[500px]"
            >
              <div
                className={`p-3 bg-surface rounded-t-xl border-b border-border border-t-4 ${col.border} flex items-center justify-between shadow-xs`}
              >
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  {col.title}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.countBg}`}>
                  {colTasks.length}
                </span>
              </div>

              <div className="p-2 space-y-2.5 flex-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface rounded-lg p-3.5 border border-border shadow-xs hover:shadow-card-hover transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <BedDouble className="w-3.5 h-3.5 text-primary-500" />
                        Room {task.roomNumber}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">{task.notes}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-border-light text-[11px] text-text-tertiary">
                      <span className="flex items-center gap-1 font-medium text-text-secondary">
                        <User className="w-3 h-3 text-primary-500" />
                        {task.assignedToName}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                    </div>

                    {/* Fast Status Change buttons */}
                    <div className="flex items-center justify-end gap-1 pt-1">
                      {task.status !== 'todo' && (
                        <button
                          onClick={() => moveTask(task.id, 'todo')}
                          className="px-2 py-0.5 text-[10px] rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                        >
                          To Do
                        </button>
                      )}
                      {task.status !== 'in-progress' && (
                        <button
                          onClick={() => moveTask(task.id, 'in-progress')}
                          className="px-2 py-0.5 text-[10px] rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium"
                        >
                          In Progress
                        </button>
                      )}
                      {task.status !== 'done' && (
                        <button
                          onClick={() => moveTask(task.id, 'done')}
                          className="px-2 py-0.5 text-[10px] rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
