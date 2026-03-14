import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/common/KPICard';
import {
  Search, Plus, ArrowRight, Archive, FileText,
  CheckCircle, ChevronLeft, Check, X,
  Package, MapPin, Calendar, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';

// ─── LIST PAGE ───────────────────────────────────────
export function TransfersListPage() {
  const navigate = useNavigate();
  const { transfers } = useAppStore();
  const [search, setSearch] = useState('');

  const filtered = transfers.filter(t =>
    t.transferNo.toLowerCase().includes(search.toLowerCase()) ||
    t.fromWarehouse.toLowerCase().includes(search.toLowerCase()) ||
    t.toWarehouse.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Internal Transfers</h1>
          <p className="text-sm text-muted-foreground">Move stock between locations</p>
        </div>
        <button
          onClick={() => navigate('/transfers/new')}
          className="btn-primary-gradient flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> New Transfer
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard label="Total" value={transfers.length}
          icon={Archive} iconColor="#00D4AA" iconBg="rgba(0,212,170,0.15)" />
        <KPICard label="Ready"
          value={transfers.filter(t => t.status === 'ready').length}
          icon={CheckCircle} iconColor="#FFB020" iconBg="rgba(255,176,32,0.15)" />
        <KPICard label="Done"
          value={transfers.filter(t => t.status === 'done').length}
          icon={FileText} iconColor="#00BCD4" iconBg="rgba(0,188,212,0.15)" />
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transfers..."
            className="glass-input w-full pl-10 text-sm"
          />
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                  No transfers found
                </td>
              </tr>
            ) : filtered.map((t, i) => (
              <motion.tr
                key={t._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/transfers/${t._id}`)}
                className="cursor-pointer transition-colors hover:bg-primary/[0.03]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <td className="p-4 font-mono text-primary">{t.transferNo}</td>
                <td className="p-4 text-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span>
                      {t.fromWarehouse || '—'}
                      {t.fromLocation ? ` → ${t.fromLocation}` : ''}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span>
                      {t.toWarehouse || '—'}
                      {t.toLocation ? ` → ${t.toLocation}` : ''}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center text-muted-foreground">{t.lines.length}</td>
                <td className="p-4 text-center"><StatusBadge status={t.status} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-xs text-muted-foreground"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {filtered.length} of {transfers.length} transfers
        </div>
      </GlassCard>
    </PageWrapper>
  );
}

// ─── DETAIL PAGE ─────────────────────────────────────
export function TransferDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transfers, products, updateTransferStatus } = useAppStore();

  // Always get from store — live data
  const transfer = transfers.find(t => t._id === id);

  if (!transfer) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground text-center mb-4">Transfer not found</p>
          <button onClick={() => navigate('/transfers')} className="btn-primary-gradient text-sm">
            Back to Transfers
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Enrich lines with fresh product data
  const enrichedLines = transfer.lines.map(line => {
    const freshProduct = products.find(p => p._id === line.productId);
    return {
      ...line,
      productName: line.productName || freshProduct?.name || '—',
      unit: line.unit || freshProduct?.unit || 'pcs',
    };
  });

  const steps = ['Draft', 'Ready', 'Done'];
  const statusToStep: Record<string, number> = {
    draft: 0, ready: 1, done: 2
  };
  const currentStep = statusToStep[transfer.status] ?? 0;

  const handleAction = (newStatus: 'ready' | 'done' | 'canceled') => {
    if (newStatus === 'canceled') {
      if (!confirm('Cancel this transfer?')) return;
    }
    if (newStatus === 'done') {
      if (!confirm('Complete transfer? Stock location will be updated.')) return;
    }
    updateTransferStatus(id!, newStatus);
    const msgs: Record<string, string> = {
      ready: 'Transfer confirmed! Ready to move. 📦',
      done: 'Transfer done! Move logged in history ✅',
      canceled: 'Transfer canceled',
    };
    toast.success(msgs[newStatus]);
    if (newStatus === 'canceled') navigate('/transfers');
  };

  return (
    <PageWrapper>
      <button
        onClick={() => navigate('/transfers')}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Transfers
      </button>

      {/* Status Bar */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-center max-w-sm mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                  style={{
                    background: i <= currentStep ? '#00D4AA' : 'transparent',
                    borderColor: i <= currentStep ? '#00D4AA' : 'rgba(255,255,255,0.15)',
                    color: i <= currentStep ? '#0A0E1A' : '#475569',
                  }}
                >
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs mt-1"
                  style={{ color: i === currentStep ? '#00D4AA' : '#475569' }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2"
                  style={{ background: i < currentStep ? '#00D4AA' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">

          {/* From → To Visual */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Transfer Route</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 rounded-xl text-center"
                style={{ background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.2)' }}>
                <p className="text-xs text-muted-foreground mb-1">FROM</p>
                <p className="text-sm font-bold text-foreground">
                  {transfer.fromWarehouse || '—'}
                </p>
                <p className="text-xs mt-1" style={{ color: '#00BCD4' }}>
                  {transfer.fromLocation || '—'}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 flex-shrink-0" style={{ color: '#00D4AA' }} />
              <div className="flex-1 p-4 rounded-xl text-center"
                style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <p className="text-xs text-muted-foreground mb-1">TO</p>
                <p className="text-sm font-bold text-foreground">
                  {transfer.toWarehouse || '—'}
                </p>
                <p className="text-xs mt-1" style={{ color: '#00D4AA' }}>
                  {transfer.toLocation || '—'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5" style={{ color: '#8B5CF6' }} />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-foreground mt-0.5">
                    {new Date(transfer.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 mt-0.5" style={{ color: '#FFB020' }} />
                <div>
                  <p className="text-xs text-muted-foreground">Created By</p>
                  <p className="text-foreground mt-0.5">{transfer.createdBy || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="w-4 h-4 mt-0.5" style={{ color: '#00D4AA' }} />
                <div>
                  <p className="text-xs text-muted-foreground">Transfer No.</p>
                  <p className="font-mono mt-0.5" style={{ color: '#00D4AA' }}>
                    {transfer.transferNo}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Product Lines */}
          <GlassCard className="overflow-hidden">
            <div className="p-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-foreground">Products to Transfer</h3>
              <span className="text-xs text-muted-foreground">
                {enrichedLines.length} products ·{' '}
                {enrichedLines.reduce((s, l) => s + l.qty, 0)} units
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
                  <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Quantity</th>
                  <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Unit</th>
                </tr>
              </thead>
              <tbody>
                {enrichedLines.map(l => (
                  <tr key={l._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-4">
                      <p className="text-foreground font-medium">{l.productName}</p>
                    </td>
                    <td className="p-4 text-right font-semibold" style={{ color: '#00D4AA' }}>
                      {l.qty}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">{l.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>

          {/* Impact preview when ready to complete */}
          {transfer.status === 'ready' && (
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Stock Movement Preview
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Total stock stays the same — only location changes.
              </p>
              {enrichedLines.map(l => (
                <div key={l._id} className="flex items-center gap-3 mb-2 text-xs">
                  <span className="text-foreground font-medium flex-1">{l.productName}</span>
                  <span style={{ color: '#FF4444' }}>
                    {transfer.fromWarehouse} −{l.qty}
                  </span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span style={{ color: '#00D4AA' }}>
                    {transfer.toWarehouse} +{l.qty}
                  </span>
                </div>
              ))}
            </GlassCard>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <GlassCard className="p-5 border-[#00D4AA]/20">
            <h3 className="text-sm font-semibold text-foreground mb-3">Actions</h3>
            <div className="mb-4">
              <StatusBadge status={transfer.status} />
            </div>
            <div className="space-y-2">
              {transfer.status === 'draft' && (
                <button
                  onClick={() => handleAction('ready')}
                  className="btn-primary-gradient w-full text-sm"
                >
                  Confirm Transfer
                </button>
              )}
              {transfer.status === 'ready' && (
                <button
                  onClick={() => handleAction('done')}
                  className="btn-primary-gradient w-full text-sm"
                >
                  Complete Transfer ✓
                </button>
              )}
              {transfer.status === 'done' && (
                <div className="text-center py-2">
                  <p className="text-xs" style={{ color: '#00D4AA' }}>
                    ✓ Transfer Completed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Logged in Move History
                  </p>
                </div>
              )}
              {transfer.status !== 'done' && transfer.status !== 'canceled' && (
                <button
                  onClick={() => handleAction('canceled')}
                  className="w-full text-sm py-2 rounded-lg transition-colors"
                  style={{
                    background: 'rgba(255,68,68,0.1)',
                    border: '1px solid rgba(255,68,68,0.3)',
                    color: '#FF4444',
                  }}
                >
                  Cancel Transfer
                </button>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Products</span>
                <span className="text-foreground">{enrichedLines.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Units</span>
                <span className="text-foreground">
                  {enrichedLines.reduce((s, l) => s + l.qty, 0)}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── FORM PAGE ───────────────────────────────────────
export function TransferFormPage() {
  const navigate = useNavigate();
  const { warehouses, products, addTransfer } = useAppStore();
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [fromLocationId, setFromLocationId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [toLocationId, setToLocationId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState([{ id: 1, productId: '', qty: 1 }]);

  const fromWarehouse = warehouses.find(w => w._id === fromWarehouseId);
  const toWarehouse = warehouses.find(w => w._id === toWarehouseId);
  const fromLocation = fromWarehouse?.locations.find(l => l._id === fromLocationId);
  const toLocation = toWarehouse?.locations.find(l => l._id === toLocationId);

  const addLine = () =>
    setLines([...lines, { id: Date.now(), productId: '', qty: 1 }]);

  const removeLine = (id: number) =>
    setLines(lines.filter(l => l.id !== id));

  const updateLine = (id: number, field: string, value: any) =>
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));

  const handleSubmit = () => {
    if (!fromWarehouseId) {
      toast.error('Please select source warehouse'); return;
    }
    if (!toWarehouseId) {
      toast.error('Please select destination warehouse'); return;
    }
    if (fromWarehouseId === toWarehouseId && fromLocationId === toLocationId) {
      toast.error('Source and destination cannot be the same'); return;
    }
    if (lines.some(l => !l.productId)) {
      toast.error('Please select a product for each line'); return;
    }

    const transferLines = lines.map((l, i) => {
      const prod = products.find(p => p._id === l.productId);
      return {
        _id: `tline-${i}-${Date.now()}`,
        productId: l.productId,
        productName: prod?.name || '—',
        qty: l.qty,
        unit: prod?.unit || 'pcs',
      };
    });

    const nt = addTransfer({
      fromWarehouse: fromWarehouse?.name || '',
      fromLocation: fromLocation?.name || fromWarehouse?.name || '',
      toWarehouse: toWarehouse?.name || '',
      toLocation: toLocation?.name || toWarehouse?.name || '',
      status: 'draft',
      scheduledDate,
      notes,
      lines: transferLines,
    } as any);

    toast.success(`Transfer ${nt.transferNo} created! ✅`);
    navigate(`/transfers/${nt._id}`);
  };

  return (
    <PageWrapper>
      <button
        onClick={() => navigate('/transfers')}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Transfers
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Internal Transfer</h1>
        <span className="text-xs px-3 py-1 rounded-full"
          style={{ background: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)' }}>
          ● Draft
        </span>
      </div>

      {/* From → To selector */}
      <div className="flex items-center gap-4 mb-6">
        <GlassCard className="flex-1 p-5">
          <h3 className="section-label mb-3">SOURCE</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Warehouse *</label>
              <select
                value={fromWarehouseId}
                onChange={e => { setFromWarehouseId(e.target.value); setFromLocationId(''); }}
                className="glass-input w-full text-sm"
              >
                <option value="">Select warehouse</option>
                {warehouses.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>
            {fromWarehouseId && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                <select
                  value={fromLocationId}
                  onChange={e => setFromLocationId(e.target.value)}
                  className="glass-input w-full text-sm"
                >
                  <option value="">All locations</option>
                  {fromWarehouse?.locations.map(loc => (
                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </GlassCard>

        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <ArrowRight className="w-7 h-7" style={{ color: '#00D4AA' }} />
          <span className="text-xs text-muted-foreground">move to</span>
        </div>

        <GlassCard className="flex-1 p-5">
          <h3 className="section-label mb-3">DESTINATION</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Warehouse *</label>
              <select
                value={toWarehouseId}
                onChange={e => { setToWarehouseId(e.target.value); setToLocationId(''); }}
                className="glass-input w-full text-sm"
              >
                <option value="">Select warehouse</option>
                {warehouses.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>
            {toWarehouseId && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                <select
                  value={toLocationId}
                  onChange={e => setToLocationId(e.target.value)}
                  className="glass-input w-full text-sm"
                >
                  <option value="">All locations</option>
                  {toWarehouse?.locations.map(loc => (
                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Extra info */}
      <GlassCard className="p-5 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="section-label mb-1.5 block">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className="glass-input w-full text-sm"
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="glass-input w-full text-sm"
            />
          </div>
        </div>
      </GlassCard>

      {/* Product lines */}
      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products to Transfer</h3>
        <div className="space-y-3">
          {lines.map((line, i) => {
            const selectedProd = products.find(p => p._id === line.productId);
            return (
              <div
                key={line.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span className="text-xs text-muted-foreground w-6 flex-shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <select
                    value={line.productId}
                    onChange={e => updateLine(line.id, 'productId', e.target.value)}
                    className="glass-input w-full text-sm"
                  >
                    <option value="">Select product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.stock} {p.unit})
                      </option>
                    ))}
                  </select>
                  {selectedProd && (
                    <p className="text-xs mt-1" style={{ color: '#00D4AA' }}>
                      SKU: {selectedProd.sku} · Available: {selectedProd.stock} {selectedProd.unit}
                    </p>
                  )}
                </div>
                <input
                  type="number"
                  min={1}
                  max={selectedProd?.stock || 9999}
                  value={line.qty}
                  onChange={e => updateLine(line.id, 'qty', parseInt(e.target.value) || 1)}
                  className="glass-input w-24 text-sm text-center flex-shrink-0"
                />
                <button
                  onClick={() => lines.length > 1 && removeLine(line.id)}
                  disabled={lines.length === 1}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 flex-shrink-0 transition-colors"
                  style={{ opacity: lines.length === 1 ? 0.3 : 1 }}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
        <button
          onClick={addLine}
          className="mt-3 w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl transition-colors"
          style={{
            background: 'rgba(0,212,170,0.05)',
            border: '1px dashed rgba(0,212,170,0.3)',
            color: '#00D4AA',
          }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate('/transfers')}
          className="btn-ghost-dark text-sm px-6"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary-gradient text-sm px-6"
        >
          Create Transfer
        </button>
      </div>
    </PageWrapper>
  );
}
