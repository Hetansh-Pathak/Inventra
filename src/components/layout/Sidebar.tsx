import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, ArrowDownCircle, Truck, ArrowLeftRight,
  SlidersHorizontal, Package, History, BarChart2, Settings,
  ChevronLeft, ChevronRight, LogOut, Box
} from 'lucide-react';

const navSections = [
  {
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Receipts', icon: ArrowDownCircle, path: '/receipts' },
      { label: 'Delivery Orders', icon: Truck, path: '/deliveries' },
      { label: 'Internal Transfers', icon: ArrowLeftRight, path: '/transfers' },
      { label: 'Stock Adjustments', icon: SlidersHorizontal, path: '/adjustments' },
    ]
  },
  {
    label: 'INVENTORY',
    items: [
      { label: 'Products', icon: Package, path: '/products' },
      { label: 'Move History', icon: History, path: '/move-history' },
    ]
  },
  {
    label: 'ANALYTICS',
    items: [
      { label: 'Reports', icon: BarChart2, path: '/reports' },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Settings', icon: Settings, path: '/settings' },
    ]
  },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentUser, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{
        background: '#0D1117',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00D4AA, #00BCD4)' }}>
            <Box className="w-5 h-5 text-navy-900" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-foreground font-bold text-base whitespace-nowrap"
              >
                CoreInventory
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navSections.map((section, si) => (
          <div key={si} className="mb-2">
            {section.label && !sidebarCollapsed && (
              <div className="section-label px-3 py-2">{section.label}</div>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 group relative"
                  style={{
                    background: isActive ? 'rgba(0,212,170,0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #00D4AA' : '3px solid transparent',
                    color: isActive ? '#00D4AA' : '#94A3B8',
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" style={{ color: isActive ? '#00D4AA' : undefined }} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="flex-shrink-0 px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-full flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-white/5">
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-1 items-center gap-3 overflow-hidden text-left"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-transform hover:scale-105"
              style={{ background: 'rgba(0,212,170,0.2)', color: '#00D4AA', border: '2px solid rgba(0,212,170,0.4)' }}>
              {currentUser?.initials}
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
                  <div className="text-sm font-semibold text-foreground truncate">{currentUser?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{currentUser?.role}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          {!sidebarCollapsed && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
                toast.success('Logged out successfully');
              }}
              className="p-1.5 rounded-lg transition-colors hover:bg-destructive/10 flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
