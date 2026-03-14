import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/common/KPICard';
import { apiFetch } from '@/lib/api';
import { Search, Plus, Truck, FileText, CheckCircle, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeliveriesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { deliveries } = useAppStore();
  const isLoading = false;

  const filtered = deliveries.filter((d: any) => 
    d.deliveryNo?.toLowerCase().includes(search.toLowerCase()) || 
    d.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Delivery Orders</h1>
          <p className="text-sm text-muted-foreground">Manage outgoing shipments</p>
        </div>
        <button onClick={() => navigate('/deliveries/new')} className="btn-primary-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Delivery
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total" value={deliveries.length} icon={Archive} iconColor="#00D4AA" iconBg="rgba(0,212,170,0.15)" />
        <KPICard label="Ready" value={deliveries.filter((d: any) => d.status === 'ready').length} icon={CheckCircle} iconColor="#FFB020" iconBg="rgba(255,176,32,0.15)" />
        <KPICard label="In Progress" value={deliveries.filter((d: any) => d.status === 'picked' || d.status === 'packed').length} icon={Truck} iconColor="#8B5CF6" iconBg="rgba(139,92,246,0.15)" />
        <KPICard label="Done" value={deliveries.filter((d: any) => d.status === 'done').length} icon={FileText} iconColor="#00BCD4" iconBg="rgba(0,188,212,0.15)" />
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deliveries..." className="glass-input w-full pl-10 text-sm" />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Delivery No.</th>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Customer</th>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Date</th>
                  <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Items</th>
                  <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d: any, i: number) => (
                  <motion.tr key={d._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/deliveries/${d._id}`)} className="cursor-pointer transition-colors hover:bg-primary/[0.03]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-4 font-mono text-primary">{d.deliveryNo}</td>
                    <td className="p-4 text-foreground">{d.customer?.name || d.customerName || 'Unknown'}</td>
                    <td className="p-4 text-muted-foreground">{d.deliveryDate ? new Date(d.deliveryDate).toLocaleDateString() : '—'}</td>
                    <td className="p-4 text-center text-muted-foreground">{d.lines?.length || 0}</td>
                    <td className="p-4 text-center"><StatusBadge status={d.status} /></td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No deliveries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </PageWrapper>
  );
}
