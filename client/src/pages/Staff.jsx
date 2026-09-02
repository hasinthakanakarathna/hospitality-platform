import { useState } from 'react';
import { UserCog, Plus, Shield, UserCheck, Sparkles, Trash2, Mail, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const INITIAL_STAFF = [
  {
    uid: 'u-1',
    name: 'Hasintha (Admin)',
    email: 'admin@stayflow.com',
    role: 'admin',
    joined: '2026-08-15',
    active: true,
  },
  {
    uid: 'u-2',
    name: 'Sarah Jenkins',
    email: 'reception@stayflow.com',
    role: 'receptionist',
    joined: '2026-08-20',
    active: true,
  },
  {
    uid: 'u-3',
    name: 'Elena Rostova',
    email: 'housekeeping@stayflow.com',
    role: 'housekeeping',
    joined: '2026-08-22',
    active: true,
  },
  {
    uid: 'u-4',
    name: 'Maria Silva',
    email: 'maria.s@stayflow.com',
    role: 'housekeeping',
    joined: '2026-08-25',
    active: true,
  },
];

export default function Staff() {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'receptionist',
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      toast.error('Please fill in name and email');
      return;
    }

    const created = {
      uid: `u-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      joined: new Date().toISOString().split('T')[0],
      active: true,
    };

    setStaffList((prev) => [...prev, created]);
    toast.success(`Staff member ${newStaff.name} added as ${newStaff.role.toUpperCase()}`);
    setIsModalOpen(false);
    setNewStaff({ name: '', email: '', role: 'receptionist' });
  };

  const handleRemove = (uid, name) => {
    setStaffList((prev) => prev.filter((s) => s.uid !== uid));
    toast.success(`Removed staff member ${name}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Staff Management</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Admin portal: invite team members, assign workspace roles, and manage permissions
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Staff Member
        </Button>
      </div>

      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background text-text-secondary border-b border-border uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light bg-surface">
              {staffList.map((member) => (
                <tr key={member.uid} className="hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-semibold text-text-primary flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{member.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        member.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : member.role === 'receptionist'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{member.joined}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {member.email !== 'admin@stayflow.com' && (
                      <button
                        onClick={() => handleRemove(member.uid, member.name)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite New Staff Member"
        size="md"
      >
        <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-text-primary mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. David Miller"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-text-primary mb-1">Work Email</label>
            <input
              type="email"
              required
              placeholder="david@hotel.com"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-text-primary mb-1">Workspace Role</label>
            <select
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="receptionist">Receptionist (Front Desk)</option>
              <option value="housekeeping">Housekeeping (Room Cleaning)</option>
              <option value="admin">Admin (Full Control)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
