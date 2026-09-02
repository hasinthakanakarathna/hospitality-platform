import { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const INITIAL_GUESTS = [
  {
    id: 'g-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    idNumber: 'P9823411',
    totalStays: 4,
    notes: 'Prefers high floors away from elevator.',
  },
  {
    id: 'g-2',
    name: 'Emily Watson',
    email: 'emily.w@example.com',
    phone: '+1 (555) 891-2345',
    idNumber: 'DL-88231',
    totalStays: 2,
    notes: 'Anniversary trip, requested extra pillows.',
  },
  {
    id: 'g-3',
    name: 'Dr. John Doe',
    email: 'johndoe.md@example.com',
    phone: '+1 (555) 432-1098',
    idNumber: 'US-PASSPORT-321',
    totalStays: 7,
    notes: 'VIP business traveler, late check-out requested.',
  },
];

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = INITIAL_GUESTS.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Guest Directory</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Profiles, stay histories, contact details, and guest preferences
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>
          Add Guest Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((guest) => (
          <Card key={guest.id} className="p-5 space-y-3 hover:border-primary-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                {guest.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">{guest.name}</h4>
                <span className="text-[11px] text-primary-600 font-medium font-mono">
                  ID: {guest.idNumber}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-text-secondary pt-2 border-t border-border-light">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-text-tertiary" />
                <span>{guest.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-text-tertiary" />
                <span>{guest.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                <span>Total Stays: <strong className="text-text-primary">{guest.totalStays}</strong></span>
              </div>
            </div>

            {guest.notes && (
              <div className="text-[11px] bg-amber-50 text-amber-800 p-2 rounded-lg font-medium">
                Note: {guest.notes}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
