import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowDownCircle, Truck, ArrowLeftRight, SlidersHorizontal } from 'lucide-react';

const actions = [
  { label: 'New Receipt', icon: ArrowDownCircle, path: '/receipts/new', color: '#00BCD4' },
  { label: 'New Delivery', icon: Truck, path: '/deliveries/new', color: '#8B5CF6' },
  { label: 'New Transfer', icon: ArrowLeftRight, path: '/transfers/new', color: '#00D4AA' },
  { label: 'New Adjustment', icon: SlidersHorizontal, path: '/adjustments/new', color: '#FFB020' },
];

export default function QuickActionsFAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-3 items-end">
            {actions.map((a, i) => (
              <motion.button
                key={a.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { navigate(a.path); setOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-card hover:border-primary/30 transition-all"
              >
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{a.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${a.color}20` }}>
                  <a.icon className="w-4 h-4" style={{ color: a.color }} />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #00D4AA, #00BCD4)',
          boxShadow: '0 4px 20px rgba(0,212,170,0.4)',
        }}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }}>
          <Plus className="w-6 h-6 text-navy-900" />
        </motion.div>
      </motion.button>
    </div>
  );
}
