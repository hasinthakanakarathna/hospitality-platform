import { useState } from 'react';
import { CalendarDays, Plus, Search, Filter, CheckCircle2, Clock, User, DoorClosed } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import { BOOKING_STATUS, formatCurrency, formatDate } from '../utils/formatters';

const INITIAL_BOOKINGS = [
  {
    id: 'b-101',
    guestName: 'Alex Rivera',
    guestPhone: '+1 (555) 234-5678',
    roomNumber: '102',
    roomType: 'Double',
    checkIn: '2026-09-02',
    checkOut: '2026-09-05',
    nights: 3,
    totalAmount: 360,
    status: 'checked-in',
  },
  {
    id: 'b-102',
    guestName: 'Emily & Mark Watson',
    guestPhone: '+1 (555) 891-2345',
    roomNumber: '201',
    roomType: 'Suite',
    checkIn: '2026-09-01',
    checkOut: '2026-09-06',
    nights: 5,
    totalAmount: 1200,
    status: 'checked-in',
  },
  {
    id: 'b-103',
    guestName: 'Dr. John Doe',
    guestPhone: '+1 (555) 432-1098',
    roomNumber: '202',
    roomType: 'Deluxe',
    checkIn: '2026-09-03',
    checkOut: '2026-09-07',
    nights: 4,
    totalAmount: 720,
    status: 'confirmed',
  },
  {
    id: 'b-104',
    guestName: 'Carlos Gomez',
    guestPhone: '+1 (555) 678-9012',
    roomNumber: '104',
    roomType: 'Single',
    checkIn: '2026-08-28',
    checkOut: '2026-09-02',
    nights: 5,
    totalAmount: 425,
    status: 'checked-out',
  },
];

export default function Bookings() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = bookings.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Bookings & Reservations
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage reservations, check-ins, check-outs, and stay schedules
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>
          New Reservation
        </Button>
      </div>

      <div className="bg-surface p-3 rounded-xl border border-border shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="text-xs text-text-secondary">
          Showing <span className="font-semibold text-text-primary">{filtered.length}</span> bookings
        </div>
      </div>

      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background text-text-secondary border-b border-border uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Stay Dates</th>
                <th className="px-4 py-3">Nights</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light bg-surface">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                        {b.guestName.charAt(0)}
                      </div>
                      <div>
                        <div>{b.guestName}</div>
                        <div className="text-[10px] text-text-tertiary">{b.guestPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-primary font-medium">
                    Room {b.roomNumber} ({b.roomType})
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{b.nights} nights</td>
                  <td className="px-4 py-3 font-bold text-text-primary">
                    {formatCurrency(b.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} config={BOOKING_STATUS} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-primary-600 font-semibold hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
