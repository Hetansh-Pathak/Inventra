import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { notifications } from '@/mock/data';
import { useState } from 'react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/receipts': 'Receipts',
  '/deliveries': 'Delivery Orders',
  '/transfers': 'Internal Transfers',
  '/adjustments': 'Stock Adjustments',
  '/move-history': 'Move History',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Topbar() {
  const location = useLocation();
  const { setGlobalSearchOpen, currentUser, sidebarCollapsed } = useAppStore();
  const [showNotifs, setShowNotifs] = useState(false);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pageTitles['/' + pathParts[0]] || 'Page';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-6"
      style={{
        background: 'rgba(10,14,26,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left */}
      <div>
        <h1 className="text-lg font-bold text-foreground">{pageTitle}</h1>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Dashboard</span>
          {pathParts.length > 0 && pathParts[0] !== 'dashboard' && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary capitalize">{pathParts[0]}</span>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-muted-foreground transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Search className="w-4 h-4" />
          <span>Search... ⌘K</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: '#00D4AA', color: '#0A0E1A' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 glass-card p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                <button className="text-xs text-primary">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map(n => (
                  <div key={n._id} className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-primary/5"
                    style={{ borderLeft: n.isRead ? '3px solid transparent' : '3px solid #00D4AA' }}>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'rgba(0,212,170,0.2)', color: '#00D4AA', border: '2px solid rgba(0,212,170,0.4)' }}>
          {currentUser.initials}
        </div>
      </div>
    </header>
  );
}
