/**
 * TopBar — header bar shown above the main content area.
 * Shows the current page title, user avatar/name, and role badge.
 */
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Map routes to page titles
const PAGE_TITLES = {
  '/': 'Dashboard',
  '/rooms': 'Room Management',
  '/bookings': 'Bookings',
  '/guests': 'Guests',
  '/housekeeping': 'Housekeeping',
  '/billing': 'Billing',
  '/staff': 'Staff Management',
  '/reports': 'Reports',
};

// Role badge colors
const ROLE_COLORS = {
  admin: 'bg-primary-100 text-primary-700',
  receptionist: 'bg-info-100 text-info-600',
  housekeeping: 'bg-success-100 text-success-700',
};

export default function TopBar({ onMenuClick }) {
  const { userProfile } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'StayFlow';
  const roleColor = ROLE_COLORS[userProfile?.role] || 'bg-gray-100 text-gray-600';

  return (
    <header className="h-[60px] bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left: mobile menu button + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Right: notifications + user info */}
      <div className="flex items-center gap-4">
        {/* Notification bell (placeholder — no backend for this yet) */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User avatar + name */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-text-primary leading-tight">
              {userProfile?.name || 'User'}
            </span>
            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${roleColor} leading-none`}>
              {userProfile?.role || 'staff'}
            </span>
          </div>
          {/* Avatar circle with initials */}
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
            {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
