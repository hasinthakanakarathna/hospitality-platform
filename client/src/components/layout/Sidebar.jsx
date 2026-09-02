/**
 * ClickUp-style collapsible sidebar navigation.
 * 
 * Features:
 * - Dark background with purple accent for active item
 * - Collapses to icon-only mode on small screens or toggle
 * - Role-based item filtering (housekeeping only sees their pages)
 * - Smooth transitions and hover effects
 */
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  Sparkles,
  Receipt,
  UserCog,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Hotel,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { hasAccess } from '../../utils/roles';

// Sidebar navigation items — order matches the spec
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'rooms', label: 'Rooms', icon: BedDouble, path: '/rooms' },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays, path: '/bookings' },
  { id: 'guests', label: 'Guests', icon: Users, path: '/guests' },
  { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles, path: '/housekeeping' },
  { id: 'billing', label: 'Billing', icon: Receipt, path: '/billing' },
  { id: 'staff', label: 'Staff', icon: UserCog, path: '/staff' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  // Filter nav items based on the user's role
  const visibleItems = NAV_ITEMS.filter(
    (item) => userProfile && hasAccess(userProfile.role, item.id)
  );

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen flex flex-col
        bg-sidebar-bg text-sidebar-text
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center h-[60px] px-4 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <Hotel className="w-4.5 h-4.5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-white whitespace-nowrap animate-fade-in">
              StayFlow
            </span>
          )}
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`
                group flex items-center gap-3 px-3 py-2 rounded-lg
                text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-primary-500/15 text-primary-300'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`flex-shrink-0 w-[18px] h-[18px] transition-colors duration-150
                  ${isActive ? 'text-primary-400' : 'text-sidebar-text group-hover:text-sidebar-text-active'}
                `}
              />
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 w-[3px] h-6 bg-primary-400 rounded-r-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User Info & Collapse Toggle ── */}
      <div className="border-t border-white/5 p-2 space-y-1">
        {/* Logout button */}
        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
            text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active
            transition-all duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title="Logout"
        >
          <LogOut className="flex-shrink-0 w-[18px] h-[18px]" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
            text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active
            transition-all duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px]" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
