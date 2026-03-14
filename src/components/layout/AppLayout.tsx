import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import GlobalSearch from '@/components/common/GlobalSearch';
import QuickActionsFAB from '@/components/common/QuickActionsFAB';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

export default function AppLayout() {
  const { sidebarCollapsed } = useAppStore();

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
          <Outlet />
        </main>
      </motion.div>
      <GlobalSearch />
      <QuickActionsFAB />
    </div>
  );
}
