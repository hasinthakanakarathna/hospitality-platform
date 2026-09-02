/**
 * AppLayout — main layout wrapper that combines Sidebar + TopBar + content area.
 * 
 * Handles:
 * - Sidebar collapse state (persisted in localStorage)
 * - Mobile sidebar overlay
 * - Content area shifts based on sidebar width
 */
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  // Persist sidebar state in localStorage so it survives page refreshes
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed);
  }, [collapsed]);

  // Close mobile sidebar when route changes (handled by clicking a nav link)
  const handleMobileClose = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity"
          onClick={handleMobileClose}
        />
      )}

      {/* Sidebar — always visible on desktop, overlay on mobile */}
      <div className={`
        lg:block
        ${mobileOpen ? 'block' : 'hidden'}
      `}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => {
            setCollapsed(!collapsed);
            setMobileOpen(false);
          }}
        />
      </div>

      {/* Main content area — shifts right based on sidebar width */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}
        `}
      >
        <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
