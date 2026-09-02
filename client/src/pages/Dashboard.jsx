import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  CalendarCheck,
  LogOut,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getGreeting, formatCurrency } from '../utils/formatters';
import Card, { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

// Mock initial stats for local dashboard display
const INITIAL_STATS = {
  totalRooms: 36,
  occupiedRooms: 28,
  occupancyRate: 78,
  todayCheckIns: 6,
  todayCheckOuts: 4,
  roomsNeedCleaning: 5,
  expectedRevenueToday: 3450,
};

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    user: 'Sarah Jenkins',
    action: 'checked in guest',
    target: 'Marcus Sterling (Room 304)',
    time: '12 minutes ago',
    type: 'checkin',
  },
  {
    id: 'act-2',
    user: 'Elena Rostova',
    action: 'marked room clean',
    target: 'Deluxe Suite 201',
    time: '34 minutes ago',
    type: 'clean',
  },
  {
    id: 'act-3',
    user: 'David Kim',
    action: 'created new booking',
    target: 'Family Suite 108 (3 Nights)',
    time: '1 hour ago',
    type: 'booking',
  },
  {
    id: 'act-4',
    user: 'Sarah Jenkins',
    action: 'processed invoice payment',
    target: '#INV-2026-089 ($680.00)',
    time: '2 hours ago',
    type: 'payment',
  },
  {
    id: 'act-5',
    user: 'System',
    action: 'flagged room for inspection',
    target: 'Penthouse 501',
    time: '3 hours ago',
    type: 'maintenance',
  },
];

const ROOM_STATUS_BREAKDOWN = [
  { label: 'Available', count: 8, color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: 'Occupied', count: 22, color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
  { label: 'Reserved', count: 6, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  { label: 'Needs Cleaning', count: 5, color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
  { label: 'Out of Service', count: 1, color: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-100' },
];

export default function Dashboard() {
  const { userProfile, isAdmin, isReceptionist } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();
  const firstName = userProfile?.name?.split(' ')[0] || 'Team';

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* ── Welcome Banner (ClickUp Style) ── */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Here is what's happening across StayFlow Hotel today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/rooms')}
            icon={BedDouble}
          >
            Room Board
          </Button>
          {(isAdmin || isReceptionist) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/bookings')}
              icon={Plus}
            >
              New Booking
            </Button>
          )}
        </div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Occupancy Rate"
          value={`${INITIAL_STATS.occupancyRate}%`}
          trend="+4% from last week"
          trendUp={true}
          color="primary"
        />
        <StatCard
          icon={CalendarCheck}
          label="Today's Check-ins"
          value={INITIAL_STATS.todayCheckIns}
          trend="4 already completed"
          trendUp={true}
          color="info"
        />
        <StatCard
          icon={LogOut}
          label="Today's Check-outs"
          value={INITIAL_STATS.todayCheckOuts}
          trend="2 pending keys return"
          trendUp={false}
          color="warning"
        />
        <StatCard
          icon={Sparkles}
          label="Rooms Needing Cleaning"
          value={INITIAL_STATS.roomsNeedCleaning}
          trend="2 high priority"
          trendUp={false}
          color="danger"
        />
      </div>

      {/* ── Main Dashboard Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Room Status Summary + Quick Access Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Availability Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  Room Status Distribution
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Total of {INITIAL_STATS.totalRooms} rooms across 4 floors
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/rooms')}
                className="text-xs text-primary-600 font-semibold"
              >
                View Board <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {/* Progress bar visual */}
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex mb-6 shadow-inner">
              <div style={{ width: '22%' }} className="bg-emerald-500 h-full" title="Available (22%)" />
              <div style={{ width: '61%' }} className="bg-blue-500 h-full" title="Occupied (61%)" />
              <div style={{ width: '17%' }} className="bg-amber-500 h-full" title="Reserved (17%)" />
            </div>

            {/* Status counts pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ROOM_STATUS_BREAKDOWN.map((st) => (
                <div
                  key={st.label}
                  className={`p-3 rounded-xl ${st.bg} border border-transparent flex flex-col items-center justify-center text-center`}
                >
                  <span className={`text-xl font-bold ${st.text}`}>{st.count}</span>
                  <span className="text-xs font-medium text-gray-600 mt-0.5">{st.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Action Workspaces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              hover
              onClick={() => navigate('/rooms')}
              className="p-5 flex items-start gap-4 border-l-4 border-l-primary-500"
            >
              <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Kanban Room Board</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Drag and drop rooms between Available, Occupied, and Cleaning states.
                </p>
              </div>
            </Card>

            <Card
              hover
              onClick={() => navigate('/housekeeping')}
              className="p-5 flex items-start gap-4 border-l-4 border-l-emerald-500"
            >
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Housekeeping Queue</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Cleaning schedules, task assignments, and inspection sign-offs.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Feed (ClickUp task style) */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-secondary" />
                <h3 className="text-base font-semibold text-text-primary">Activity Stream</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                Live
              </span>
            </div>

            <div className="space-y-4">
              {INITIAL_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 text-xs pb-3 border-b border-border-light last:border-0 last:pb-0"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center flex-shrink-0 text-[11px]">
                    {act.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-medium">
                      <span className="font-semibold">{act.user}</span> {act.action}
                    </p>
                    <p className="text-primary-600 font-semibold truncate mt-0.5">
                      {act.target}
                    </p>
                    <span className="text-[10px] text-text-tertiary mt-1 block">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
