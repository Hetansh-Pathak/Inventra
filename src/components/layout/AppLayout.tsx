import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import GlobalSearch from '@/components/common/GlobalSearch';
import QuickActionsFAB from '@/components/common/QuickActionsFAB';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AppLayout() {
  const { sidebarCollapsed, products, notifications, addNotification } = useAppStore();
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();

  const lowStockItems = products.filter(
    p => p.isActive && p.stock > 0 && p.stock <= p.reorderLevel
  );
  const outOfStockItems = products.filter(
    p => p.isActive && p.stock === 0
  );
  const criticalCount = lowStockItems.length + outOfStockItems.length;

  return (
    <div className="min-h-screen" style={{ background: '#0A0E1A' }}>
      <Sidebar />
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen flex flex-col"
      >
        <Topbar />
        <main className="flex-1">
          {showBanner && criticalCount > 0 && (
            <div className="mx-4 mt-4 mb-0 rounded-xl flex items-center justify-between gap-4 px-4 py-3"
              style={{
                background: outOfStockItems.length > 0
                  ? 'rgba(255,68,68,0.1)'
                  : 'rgba(255,176,32,0.1)',
                border: `1px solid ${outOfStockItems.length > 0
                  ? 'rgba(255,68,68,0.3)'
                  : 'rgba(255,176,32,0.3)'}`,
              }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0"
                  style={{ color: outOfStockItems.length > 0 ? '#FF4444' : '#FFB020' }} />
                <div>
                  <span className="text-sm font-medium"
                    style={{ color: outOfStockItems.length > 0 ? '#FF4444' : '#FFB020' }}>
                    {outOfStockItems.length > 0
                      ? `${outOfStockItems.length} product(s) out of stock!`
                      : `${lowStockItems.length} product(s) running low`}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {outOfStockItems.length > 0
                      ? outOfStockItems.slice(0,3).map(p=>p.name).join(', ')
                      : lowStockItems.slice(0,3).map(p=>`${p.name} (${p.stock} left)`).join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate('/products?filter=low-stock')}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  style={{
                    background: outOfStockItems.length > 0
                      ? 'rgba(255,68,68,0.2)' : 'rgba(255,176,32,0.2)',
                    color: outOfStockItems.length > 0 ? '#FF4444' : '#FFB020',
                    border: `1px solid ${outOfStockItems.length > 0
                      ? 'rgba(255,68,68,0.4)' : 'rgba(255,176,32,0.4)'}`,
                  }}>
                  View Products
                </button>
                <button onClick={() => setShowBanner(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </motion.div>
      <GlobalSearch />
      <QuickActionsFAB />
    </div>
  );
}
