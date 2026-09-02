import { useState } from 'react';
import { Receipt, Plus, Search, CheckCircle, Clock, DollarSign, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    guestName: 'Alex Rivera',
    roomNumber: '102',
    issuedDate: '2026-09-02',
    dueDate: '2026-09-05',
    totalAmount: 385,
    paid: true,
    paymentMethod: 'Credit Card (Visa)',
  },
  {
    id: 'INV-2026-002',
    guestName: 'Emily & Mark Watson',
    roomNumber: '201',
    issuedDate: '2026-09-01',
    dueDate: '2026-09-06',
    totalAmount: 1350,
    paid: false,
    paymentMethod: 'Pending Checkout',
  },
  {
    id: 'INV-2026-003',
    guestName: 'Dr. John Doe',
    roomNumber: '202',
    issuedDate: '2026-09-03',
    dueDate: '2026-09-07',
    totalAmount: 790,
    paid: true,
    paymentMethod: 'Corporate Card',
  },
];

export default function Billing() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  const togglePaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, paid: !inv.paid } : inv))
    );
    toast.success('Invoice status updated');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Invoicing & Billing
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Folios, guest stay charges, extras, and payment records
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>
          Generate Invoice
        </Button>
      </div>

      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background text-text-secondary border-b border-border uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light bg-surface">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary-600">{inv.id}</td>
                  <td className="px-4 py-3 font-semibold text-text-primary">{inv.guestName}</td>
                  <td className="px-4 py-3 text-text-secondary">Room {inv.roomNumber}</td>
                  <td className="px-4 py-3 text-text-secondary">{inv.issuedDate}</td>
                  <td className="px-4 py-3 font-bold text-text-primary">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        inv.paid
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {inv.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => togglePaid(inv.id)}
                      className="px-2 py-1 text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition-colors"
                    >
                      Mark as {inv.paid ? 'Unpaid' : 'Paid'}
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
