import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/common/KPICard';
import { transfers, warehouses, products } from '@/mock/data';
import { Search, Plus, ArrowRight, Archive, FileText, CheckCircle, ChevronLeft, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function TransfersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = transfers.filter(t => t.transferNo.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Internal Transfers</h1>
          <p className="text-sm text-muted-foreground">Move stock between locations</p>
        </div>
        <button onClick={() => navigate('/transfers/new')} className="btn-primary-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Transfer
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard label="Total" value={transfers.length} icon={Archive} iconColor="#00D4AA" iconBg="rgba(0,212,170,0.15)" />
        <KPICard label="Ready" value={transfers.filter(t => t.status === 'ready').length} icon={CheckCircle} iconColor="#FFB020" iconBg="rgba(255,176,32,0.15)" />
        <KPICard label="Done" value={transfers.filter(t => t.status === 'done').length} icon={FileText} iconColor="#00BCD4" iconBg="rgba(0,188,212,0.15)" />
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transfers..." className="glass-input w-full pl-10 text-sm" />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Transfer No.</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">From</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">To</th>
              <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Items</th>
              <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <motion.tr key={t._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/transfers/${t._id}`)} className="cursor-pointer transition-colors hover:bg-primary/[0.03]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-4 font-mono text-primary">{t.transferNo}</td>
                <td className="p-4 text-foreground">{t.fromWarehouse}</td>
                <td className="p-4 text-foreground">{t.toWarehouse}</td>
                <td className="p-4 text-center text-muted-foreground">{t.lines.length}</td>
                <td className="p-4 text-center"><StatusBadge status={t.status} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </PageWrapper>
  );
}

export function TransferDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const transfer = transfers.find(t => t._id === id);
  if (!transfer) return <PageWrapper><p className="text-muted-foreground text-center py-20">Transfer not found</p></PageWrapper>;

  return (
    <PageWrapper>
      <button onClick={() => navigate('/transfers')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{transfer.transferNo}</h1>
            <StatusBadge status={transfer.status} />
          </div>
          <div className="flex items-center gap-4">
            <GlassCard className="p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">From</div>
              <div className="text-sm font-semibold text-foreground">{transfer.fromWarehouse}</div>
              <div className="text-xs text-muted-foreground">{transfer.fromLocation}</div>
            </GlassCard>
            <ArrowRight className="w-5 h-5 text-primary" />
            <GlassCard className="p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">To</div>
              <div className="text-sm font-semibold text-foreground">{transfer.toWarehouse}</div>
              <div className="text-xs text-muted-foreground">{transfer.toLocation}</div>
            </GlassCard>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Qty</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Unit</th>
            </tr>
          </thead>
          <tbody>
            {transfer.lines.map(l => (
              <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-4 text-foreground">{l.productName}</td>
                <td className="p-4 text-right text-foreground font-medium">{l.qty}</td>
                <td className="p-4 text-right text-muted-foreground">{l.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {transfer.status !== 'done' && (
        <div className="flex justify-end">
          <button onClick={() => toast.success('Transfer completed')} className="btn-primary-gradient text-sm">Complete Transfer</button>
        </div>
      )}
    </PageWrapper>
  );
}

export function TransferFormPage() {
  const navigate = useNavigate();
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [lines, setLines] = useState([{ id: 1, productId: '', qty: 1 }]);

  return (
    <PageWrapper>
      <button onClick={() => navigate('/transfers')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">New Transfer</h1>

      <div className="flex items-center gap-4 mb-6">
        <GlassCard className="flex-1 p-5">
          <h3 className="section-label mb-3">Source</h3>
          <select value={fromWarehouse} onChange={(e) => setFromWarehouse(e.target.value)} className="glass-input w-full text-sm">
            <option value="">Select warehouse</option>
            {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
          </select>
        </GlassCard>
        <ArrowRight className="w-6 h-6 text-primary flex-shrink-0" />
        <GlassCard className="flex-1 p-5">
          <h3 className="section-label mb-3">Destination</h3>
          <select value={toWarehouse} onChange={(e) => setToWarehouse(e.target.value)} className="glass-input w-full text-sm">
            <option value="">Select warehouse</option>
            {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
          </select>
        </GlassCard>
      </div>

      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products</h3>
        {lines.map((line, i) => (
          <div key={line.id} className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <select className="glass-input flex-1 text-sm" value={line.productId} onChange={(e) => {
              const updated = [...lines]; updated[i].productId = e.target.value; setLines(updated);
            }}>
              <option value="">Select product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input type="number" min={1} value={line.qty} onChange={(e) => {
              const updated = [...lines]; updated[i].qty = parseInt(e.target.value) || 1; setLines(updated);
            }} className="glass-input w-24 text-sm text-center" />
            <button onClick={() => setLines(lines.filter(l => l.id !== line.id))} className="p-1.5 rounded-lg hover:bg-destructive/10">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ))}
        <button onClick={() => setLines([...lines, { id: Date.now(), productId: '', qty: 1 }])} className="mt-2 w-full btn-ghost-dark flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/transfers')} className="btn-ghost-dark text-sm">Cancel</button>
        <button onClick={() => { toast.success('Transfer created'); navigate('/transfers'); }} className="btn-primary-gradient text-sm">Create Transfer</button>
      </div>
    </PageWrapper>
  );
}
