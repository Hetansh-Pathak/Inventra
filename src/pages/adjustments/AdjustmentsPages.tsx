import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { adjustments, products, warehouses } from '@/mock/data';
import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function AdjustmentsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = adjustments.filter(a => a.adjustmentNo.toLowerCase().includes(search.toLowerCase()) || a.productName.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stock Adjustments</h1>
          <p className="text-sm text-muted-foreground">Reconcile physical and system stock</p>
        </div>
        <button onClick={() => navigate('/adjustments/new')} className="btn-primary-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Adjustment
        </button>
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search adjustments..." className="glass-input w-full pl-10 text-sm" />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Adj No.</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Location</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">System</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Counted</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Diff</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Reason</th>
              <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <motion.tr key={a._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-4 font-mono text-primary">{a.adjustmentNo}</td>
                <td className="p-4 text-foreground">{a.productName}</td>
                <td className="p-4 text-muted-foreground">{a.locationName}</td>
                <td className="p-4 text-right text-muted-foreground">{a.systemQty}</td>
                <td className="p-4 text-right text-foreground">{a.countedQty}</td>
                <td className={`p-4 text-right font-semibold ${a.difference > 0 ? 'text-primary' : 'text-destructive'}`}>
                  {a.difference > 0 ? '+' : ''}{a.difference}
                </td>
                <td className="p-4 text-muted-foreground">{a.reason}</td>
                <td className="p-4 text-center"><StatusBadge status={a.status} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </PageWrapper>
  );
}

export function AdjustmentFormPage() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [counted, setCounted] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const product = products.find(p => p._id === productId);
  const systemQty = product?.stock || 0;
  const diff = counted ? parseInt(counted) - systemQty : 0;

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-foreground mb-6">New Adjustment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Product *</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku}) — Stock: {p.stock}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Location *</label>
              <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select location</option>
                {warehouses.flatMap(w => w.locations).map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
            {product && (
              <GlassCard className="p-3">
                <span className="text-xs text-muted-foreground">Current system stock: </span>
                <span className="text-sm font-bold text-foreground">{systemQty} {product.unit}</span>
              </GlassCard>
            )}
            <div>
              <label className="section-label mb-1.5 block">Physical Count *</label>
              <input type="number" value={counted} onChange={(e) => setCounted(e.target.value)} className="glass-input w-full text-lg font-bold" placeholder="0" />
              {counted && (
                <div className="flex items-center gap-4 mt-3 p-3 rounded-xl" style={{ background: diff === 0 ? 'rgba(0,212,170,0.1)' : diff > 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,68,68,0.1)' }}>
                  <div className="text-sm"><span className="text-muted-foreground">System:</span> <span className="text-foreground">{systemQty}</span></div>
                  <div className="text-sm"><span className="text-muted-foreground">Counted:</span> <span className="text-foreground">{counted}</span></div>
                  <div className={`text-sm font-bold ${diff > 0 ? 'text-primary' : diff < 0 ? 'text-destructive' : 'text-primary'}`}>
                    Diff: {diff > 0 ? '+' : ''}{diff}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff > 0 ? 'status-done' : diff < 0 ? 'status-canceled' : 'status-done'}`}>
                    {diff > 0 ? 'GAIN' : diff < 0 ? 'LOSS' : 'MATCH'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="section-label mb-1.5 block">Reason *</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select reason</option>
                <option value="Damaged">🔨 Damaged</option>
                <option value="Expired">📅 Expired</option>
                <option value="Lost">🔍 Lost</option>
                <option value="Correction">✏️ Correction</option>
                <option value="Other">📋 Other</option>
              </select>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input w-full text-sm resize-none" rows={3} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 h-fit">
          <h3 className="text-sm font-semibold text-foreground mb-3">Preview</h3>
          {product && counted ? (
            <p className="text-sm text-muted-foreground">
              This adjustment will <span className={diff >= 0 ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                {diff >= 0 ? 'increase' : 'decrease'}
              </span> stock of <span className="text-foreground font-medium">{product.name}</span> by <span className="font-bold text-foreground">{Math.abs(diff)}</span> {product.unit}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Select a product and enter count to preview</p>
          )}
        </GlassCard>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => navigate('/adjustments')} className="btn-ghost-dark text-sm">Cancel</button>
        <button onClick={() => { toast.success('Adjustment created'); navigate('/adjustments'); }} className="btn-primary-gradient text-sm">Create Adjustment</button>
      </div>
    </PageWrapper>
  );
}
