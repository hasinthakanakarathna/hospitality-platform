import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card, { StatCard } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';

const OCCUPANCY_DATA = [
  { day: 'Mon', rate: 64 },
  { day: 'Tue', rate: 70 },
  { day: 'Wed', rate: 78 },
  { day: 'Thu', rate: 85 },
  { day: 'Fri', rate: 94 },
  { day: 'Sat', rate: 98 },
  { day: 'Sun', rate: 82 },
];

const REVENUE_BY_TYPE = [
  { type: 'Single', revenue: 4250 },
  { type: 'Double', revenue: 9800 },
  { type: 'Deluxe', revenue: 14200 },
  { type: 'Suite', revenue: 19600 },
];

export default function Reports() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-text-primary tracking-tight">
          Performance & Analytics
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Occupancy rates, weekly trends, revenue breakdown, and hospitality KPIs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Average Occupancy"
          value="81.5%"
          trend="+5.2% vs last month"
          trendUp={true}
          color="primary"
        />
        <StatCard
          icon={DollarSign}
          label="ADR (Avg Daily Rate)"
          value="$158.00"
          trend="+$12.50 vs target"
          trendUp={true}
          color="success"
        />
        <StatCard
          icon={BarChart3}
          label="Monthly Revenue (MTD)"
          value="$47,850"
          trend="+18% YoY growth"
          trendUp={true}
          color="info"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Occupancy Rate Trend */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Weekly Occupancy Rate (%)</h3>
              <p className="text-xs text-text-secondary">Past 7 days occupancy levels</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Peak: 98% (Sat)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OCCUPANCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b68ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7b68ee" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Occupancy']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#7b68ee"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#occupancyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Room Category */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Revenue by Room Category</h3>
              <p className="text-xs text-text-secondary">Distribution across room tiers</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_BY_TYPE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
