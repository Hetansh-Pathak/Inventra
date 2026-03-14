import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/common/KPICard';
import { receipts } from '@/mock/data';
import { Search, Plus, FileText, CheckCircle, Clock, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReceiptsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = receipts.filter(r => r.receiptNo.toLowerCase().includes(search.toLowerCase()) || r.supplierName.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Total', value: receipts.length, icon: Archive, iconColor: '#00D4AA', iconBg: 'rgba(0,212,170,0.15)' },
    { label: 'Draft', value: receipts.filter(r => r.status === 'draft').length, icon: FileText, iconColor: '#94A3B8', iconBg: 'rgba(148,163,184,0.15)' },
    { label: 'Confirmed', value: receipts.filter(r => r.status === 'confirmed').length, icon: Clock, iconColor: '#00BCD4', iconBg: 'rgba(0,188,212,0.15)' },
    { label: 'Validated', value: receipts.filter(r => r.status === 'validated').length, icon: CheckCircle, iconColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.15)' },
  ];

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receipts</h1>
          <p className="text-sm text-muted-foreground">Manage incoming inventory</p>
        </div>
        <button onClick={() => navigate('/receipts/new')} className="btn-primary-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Receipt
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => <KPICard key={s.label} {...s} />)}
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search receipts..."
            className="glass-input w-full pl-10 text-sm" />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Receipt No.</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Supplier</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Expected</th>
              <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Lines</th>
              <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/receipts/${r._id}`)}
                className="cursor-pointer transition-colors hover:bg-primary/[0.03]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-4 font-mono text-primary">{r.receiptNo}</td>
                <td className="p-4 text-foreground">{r.supplierName}</td>
                <td className="p-4 text-muted-foreground">{r.expectedDate}</td>
                <td className="p-4 text-center text-muted-foreground">{r.lines.length}</td>
                <td className="p-4 text-center"><StatusBadge status={r.status} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </PageWrapper>
  );
}
