import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { apiFetch } from '@/lib/api';
import { Search, Plus, ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function AdjustmentsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

<<<<<<< HEAD
  const adjustments = useAppStore(state => state.adjustments);
=======
  const { adjustments, validateAdjustment } = useAppStore();
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
  const isLoading = false;
  const filtered = adjustments.filter((a: any) => 
    a.adjustmentNo?.toLowerCase().includes(search.toLowerCase()) || 
    a.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.productName?.toLowerCase().includes(search.toLowerCase())
  );

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
                {filtered.map((a: any, i: number) => (
                  <motion.tr
                    key={a._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/adjustments/${a._id}`)}
                    className="transition-colors hover:bg-primary/[0.03] cursor-pointer"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-4 font-mono text-primary">{a.adjustmentNo}</td>
                    <td className="p-4 text-foreground">{a.product?.name || a.productName}</td>
                    <td className="p-4 text-muted-foreground">{a.location?.name || a.locationName || 'Default'}</td>
                    <td className="p-4 text-right text-muted-foreground">{a.systemQty}</td>
                    <td className="p-4 text-right text-foreground">{a.countedQty}</td>
                    <td className={`p-4 text-right font-semibold ${a.difference > 0 ? 'text-primary' : a.difference < 0 ? 'text-destructive' : 'text-primary'}`}>
                      {a.difference > 0 ? '+' : ''}{a.difference}
                    </td>
                    <td className="p-4 text-muted-foreground">{a.reason}</td>
<<<<<<< HEAD
                    <td className="p-4 text-center"><StatusBadge status={a.status} /></td>
=======
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <StatusBadge status={a.status} />
                        {a.status === 'draft' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              validateAdjustment(a._id);
                              toast.success('Adjustment validated! Stock updated ✅');
                            }}
                            className="text-xs px-2 py-1 rounded-lg transition-colors mt-1"
                            style={{
                              background: 'rgba(0,212,170,0.1)',
                              border: '1px solid rgba(0,212,170,0.3)',
                              color: '#00D4AA',
                            }}
                          >
                            Validate
                          </button>
                        )}
                      </div>
                    </td>
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No adjustments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </PageWrapper>
  );
}

export function AdjustmentFormPage() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [counted, setCounted] = useState<string>('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

<<<<<<< HEAD
  const products = useAppStore(state => state.products);
  const warehouses = useAppStore(state => state.warehouses);
  const addAdjustment = useAppStore(state => state.addAdjustment);
=======
  const { products, warehouses, addAdjustment } = useAppStore();
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)

  const product = products.find((p: any) => p._id === productId);
  const systemQty = product?.stock || 0;
  const countedNum = counted === '' ? 0 : parseInt(counted);
  const diff = counted === '' ? 0 : countedNum - systemQty;

  const mutation = {
    mutate: (payload: any) => {
      addAdjustment({
        ...payload,
        adjustmentNo: `ADJ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        systemQty: systemQty,
        difference: diff,
        status: 'draft',
        createdAt: new Date().toISOString()
      } as any);
      toast.success('Adjustment created successfully');
      navigate('/adjustments');
    },
    isPending: false
  };

  const handleSubmit = () => {
<<<<<<< HEAD
    if (!productId || counted === '' || !reason) {
      toast.error('Please fill in required fields (Product, Count, Reason)');
      return;
    }

    const payload = {
      product: productId,
      location: locationId || undefined,
      countedQty: countedNum,
      reason,
      notes,
    };

    mutation.mutate(payload);
=======
    if (!productId) { toast.error('Select a product'); return; }
    if (counted === '') { toast.error('Enter counted quantity'); return; }
    const prod = products.find((p: any) => p._id === productId);
    const allLocations = warehouses.flatMap((w: any) =>
      w.locations.map((l: any) => ({ ...l, warehouseName: w.name }))
    );
    const loc = allLocations.find((l: any) => l._id === locationId);
    const na = addAdjustment({
      productId,
      productName: prod?.name || '',
      locationId: locationId || 'default',
      locationName: loc?.name || 'Main Warehouse',
      systemQty: prod?.stock || 0,
      countedQty: Number(counted),
      reason,
      notes,
      status: 'draft',
    } as any);
    toast.success(`Adjustment ${na?.adjustmentNo || ''} created!`);
    navigate('/adjustments');
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
  };

  return (
    <PageWrapper>
      <button onClick={() => navigate('/adjustments')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Adjustments
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">New Adjustment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Product *</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select product</option>
                {products.map((p: any) => <option key={p._id} value={p._id}>{p.name} ({p.sku}) — Stock: {p.stock}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Location</label>
              <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Default Location</option>
                {warehouses?.flatMap((w: any) => w.locations?.map((l: any) => ({ ...l, whName: w.name })) || []).map((l: any) => (
                  <option key={l._id} value={l._id}>{l.whName} - {l.name}</option>
                ))}
              </select>
            </div>
            {product && (
              <GlassCard className="p-3">
                <span className="text-xs text-muted-foreground">Current system stock: </span>
                <span className="text-sm font-bold text-foreground">{systemQty} {product.unit || 'pcs'}</span>
              </GlassCard>
            )}
            <div>
              <label className="section-label mb-1.5 block">Physical Count *</label>
              <div className="flex items-center gap-3">
                 <input type="number" min="0" value={counted} onChange={(e) => setCounted(e.target.value)} className="glass-input w-full text-lg font-bold" placeholder="0" />
                 {product && <span className="text-muted-foreground text-sm">{product.unit || 'pcs'}</span>}
              </div>
              {counted !== '' && (
                <div className="flex items-center flex-wrap gap-4 mt-3 p-3 rounded-xl" style={{ background: diff === 0 ? 'rgba(0,212,170,0.1)' : diff > 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,68,68,0.1)' }}>
                  <div className="text-sm"><span className="text-muted-foreground">System:</span> <span className="text-foreground">{systemQty}</span></div>
                  <div className="text-sm"><span className="text-muted-foreground">Counted:</span> <span className="text-foreground">{countedNum}</span></div>
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
          {product && counted !== '' ? (
            <p className="text-sm text-muted-foreground">
              This adjustment will <span className={diff >= 0 ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                {diff >= 0 ? 'increase' : 'decrease'}
              </span> stock of <span className="text-foreground font-medium">{product.name}</span> by <span className="font-bold text-foreground">{Math.abs(diff)}</span> {product.unit || 'pcs'}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Select a product and enter count to preview</p>
          )}
        </GlassCard>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => navigate('/adjustments')} className="btn-ghost-dark text-sm">Cancel</button>
        <button onClick={handleSubmit} disabled={mutation.isPending} className="btn-primary-gradient text-sm">
          {mutation.isPending ? 'Saving...' : 'Create Adjustment'}
        </button>
      </div>
    </PageWrapper>
  );
}

export function AdjustmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const adjustments = useAppStore(state => state.adjustments);
<<<<<<< HEAD
  const updateAdjustmentStatus = useAppStore(state => state.updateAdjustmentStatus);
=======
  const validateAdjustment = useAppStore((state: any) => state.validateAdjustment);
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
  const adjustment = adjustments.find(a => a._id === id);
  const isLoading = false;

  const validateMutation = {
    mutate: () => {
      if (id) {
<<<<<<< HEAD
        updateAdjustmentStatus(id, 'validated');
=======
        validateAdjustment(id);
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
        toast.success('Adjustment validated! Stock updated.');
      }
    },
    isPending: false
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[500px]">
           <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
        </div>
      </PageWrapper>
    );
  }

  if (!adjustment) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Adjustment Not Found</h2>
          <button onClick={() => navigate('/adjustments')} className="text-primary hover:underline text-sm">
            Back to Adjustments
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/adjustments')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{adjustment.adjustmentNo}</h1>
            <p className="text-sm text-muted-foreground">Stock Adjustment Detail</p>
          </div>
        </div>

        {/* Status Bar */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {[
              { step: 'Draft', status: adjustment.status === 'draft' || adjustment.status === 'validated' ? 'done' : 'draft' },
              { step: 'Validated', status: adjustment.status === 'validated' ? 'done' : adjustment.status === 'draft' ? 'upcoming' : 'done' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center flex-1 relative">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2 mx-auto"
                    style={{
                      background: item.status === 'done' ? '#00D4AA' : 'transparent',
                      borderColor: item.status !== 'upcoming' ? '#00D4AA' : 'rgba(255,255,255,0.15)',
                      color: item.status === 'upcoming' ? 'rgba(255,255,255,0.5)' : item.status === 'done' ? '#0A0E1A' : '#00D4AA',
                    }}
                  >
                    {item.status === 'done' ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className="text-xs mt-2 font-medium" style={{ color: item.status !== 'upcoming' ? '#00D4AA' : 'rgba(255,255,255,0.5)' }}>
                    {item.step}
                  </span>
                </div>
                {idx < 1 && (
                  <div
                    className="absolute top-5 left-[60%] w-[80%] h-px transition-colors"
                    style={{
                      background: item.status === 'done' ? '#00D4AA' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Info Grid */}
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">PRODUCT</p>
<<<<<<< HEAD
                  <p className="text-lg font-semibold text-foreground">{adjustment.product?.name || adjustment.productName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">LOCATION</p>
                  <p className="text-lg font-semibold text-foreground">{adjustment.location?.name || adjustment.locationName || 'Default'}</p>
=======
                  <p className="text-lg font-semibold text-foreground">{(adjustment as any).product?.name || adjustment.productName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">LOCATION</p>
                  <p className="text-lg font-semibold text-foreground">{(adjustment as any).location?.name || adjustment.locationName || 'Default'}</p>
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">REASON</p>
                  <p className="text-lg font-semibold text-foreground">{adjustment.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CREATED</p>
                  <p className="text-lg font-semibold text-foreground">{new Date(adjustment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </GlassCard>

            {/* Stock Impact */}
<<<<<<< HEAD
            <GlassCard className="p-6 border-2" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>
=======
            <GlassCard className="p-6 border-2 border-[#00D4AA]/30">
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
              <h3 className="text-sm font-semibold text-foreground mb-6">Stock Impact</h3>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground mb-2">SYSTEM QTY</p>
                    <p className="text-3xl font-bold text-foreground">{adjustment.systemQty}</p>
<<<<<<< HEAD
                    <p className="text-xs text-muted-foreground mt-2">{adjustment.product?.unit || 'pcs'}</p>
=======
                    <p className="text-xs text-muted-foreground mt-2">{(adjustment as any).product?.unit || 'pcs'}</p>
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-lg text-muted-foreground">→</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground mb-2">COUNTED QTY</p>
                    <p className="text-3xl font-bold text-primary">{adjustment.countedQty}</p>
<<<<<<< HEAD
                    <p className="text-xs text-muted-foreground mt-2">{adjustment.product?.unit || 'pcs'}</p>
=======
                    <p className="text-xs text-muted-foreground mt-2">{(adjustment as any).product?.unit || 'pcs'}</p>
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                  </div>
                </div>

                <div className="flex items-center justify-center py-6 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)' }}>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Difference</p>
                    <p
                      className="text-4xl font-bold"
                      style={{
                        color: adjustment.difference === 0
                          ? '#00D4AA'
                          : adjustment.difference > 0
                          ? '#00D4AA'
                          : '#FF4444',
                      }}
                    >
                      {adjustment.difference > 0 ? '+' : ''}{adjustment.difference}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Stock will {adjustment.difference > 0 ? 'increase' : adjustment.difference < 0 ? 'decrease' : 'remain the same'} by{' '}
<<<<<<< HEAD
                      <span className="font-semibold">{Math.abs(adjustment.difference)}</span> {adjustment.product?.unit || 'pcs'}
=======
                      <span className="font-semibold">{Math.abs(adjustment.difference)}</span> {(adjustment as any).product?.unit || 'pcs'}
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
            
            {adjustment.notes && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{adjustment.notes}</p>
              </GlassCard>
            )}
          </div>

          {/* Action Card */}
          <div className="space-y-6">
<<<<<<< HEAD
            <GlassCard className="p-6" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
=======
            <GlassCard className="p-6 border border-[#00D4AA]/20">
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
              <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>
              <div className="mb-4 text-center">
                 <StatusBadge status={adjustment.status} />
              </div>

              {adjustment.status === 'draft' && (
                <div className="space-y-3">
                  <button
                    onClick={() => validateMutation.mutate()}
                    disabled={validateMutation.isPending}
                    className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2"
                  >
                    {validateMutation.isPending ? (
                       <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    {validateMutation.isPending ? 'Validating...' : 'Validate Adjustment'}
                  </button>
                </div>
              )}

              {adjustment.status === 'validated' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.1)' }}>
                    <p className="text-xs text-primary font-medium text-center">✓ Validated</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
