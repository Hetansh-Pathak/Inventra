import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { apiFetch } from '@/lib/api';
import { ArrowDown, Truck, ArrowLeftRight, SlidersHorizontal, Search, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  receipt: { icon: ArrowDown, color: '#00BCD4', bg: 'rgba(0,188,212,0.15)', label: 'Receipt' },
  delivery: { icon: Truck, color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', label: 'Delivery' },
  transfer: { icon: ArrowLeftRight, color: '#6366F1', bg: 'rgba(99,102,241,0.15)', label: 'Transfer' },
  adjustment: { icon: SlidersHorizontal, color: '#FFB020', bg: 'rgba(255,176,32,0.15)', label: 'Adjustment' },
};

export default function MoveHistoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const moveHistory = useAppStore(state => state.moveHistory);
  const isLoading = false;

  const filtered = moveHistory.filter((m: any) => {
    const matchSearch = (m.product?.name || m.productName || '').toLowerCase().includes(search.toLowerCase()) || 
                        (m.reference || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Move History</h1>
          <p className="text-sm text-muted-foreground">Track all inventory movements</p>
        </div>
        <button className="btn-ghost-dark flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product or reference..." className="glass-input w-full pl-10 text-sm" />
          </div>
          <div className="flex flex-wrap rounded-lg overflow-hidden gap-1" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '2px' }}>
            {['all', 'receipt', 'delivery', 'transfer', 'adjustment'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className="px-3 py-1.5 text-xs font-medium capitalize transition-colors rounded-md"
                style={{ background: typeFilter === t ? 'rgba(0,212,170,0.15)' : 'transparent', color: typeFilter === t ? '#00D4AA' : '#94A3B8' }}>
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Date/Time</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Type</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Location</th>
                    <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Change</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m: any, i: number) => {
                    const t = typeConfig[m.type] || { icon: SlidersHorizontal, color: '#94A3B8', bg: 'rgba(255,255,255,0.05)', label: 'Unknown' };
                    const Icon = t.icon;
                    return (
                      <motion.tr key={m._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.bg }}>
                              <Icon className="w-3 h-3" style={{ color: t.color }} />
                            </div>
                            <span className="text-xs" style={{ color: t.color }}>{t.label}</span>
                          </div>
                        </td>
                        <td className="p-4 text-foreground">{m.product?.name || m.productName}</td>
                        <td className="p-4 text-muted-foreground text-xs">{m.location?.name || m.locationName || 'Default'}</td>
                        <td className={`p-4 text-right font-semibold ${m.change > 0 ? 'text-primary' : m.change < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {m.change > 0 ? '↑ +' : m.change < 0 ? '↓ ' : ''}{m.change}
                        </td>
                        <td className="p-4 font-mono text-primary text-xs">{m.reference || m.refId}</td>
                      </motion.tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-muted-foreground" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              Showing {filtered.length} of {moveHistory.length} moves
            </div>
          </>
        )}
      </GlassCard>
    </PageWrapper>
  );
}
