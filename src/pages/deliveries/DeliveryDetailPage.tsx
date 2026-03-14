import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { apiFetch } from '@/lib/api';
import { ChevronLeft, Check, AlertTriangle, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const steps = ['Draft', 'Ready', 'Picked', 'Packed', 'Done'];
const statusToStep: Record<string, number> = { draft: 0, ready: 1, picked: 2, packed: 3, done: 4 };

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deliveries, updateDeliveryStatus, products } = useAppStore();

  const delivery = deliveries.find(d => d._id === id);
  const isLoading = false;

  const [pickedQtys, setPickedQtys] = useState<Record<string, number>>({});
  const [packingChecks, setPackingChecks] = useState({ check1: false, check2: false, check3: false, check4: false });

  // Initialize pickedQtys when delivery loads
  useEffect(() => {
    if (delivery?.lines) {
      const initial: Record<string, number> = {};
      delivery.lines.forEach((line: any) => {
        initial[line.product || line.productId || line._id] = line.pickedQty ?? line.requestedQty;
      });
      setPickedQtys(initial);
    }
  }, [delivery]);

  const statusMutation = {
    isPending: false,
    mutate: (newStatus: any) => {
      if (id) updateDeliveryStatus(id, newStatus);
      toast.success('Status updated successfully!');
    }
  };

  const validateMutation = {
    isPending: false,
    mutate: () => {
      if (id) updateDeliveryStatus(id, 'done');
      toast.success('Delivery validated! Stock updated.');
    }
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

  if (!delivery) {
    return (
      <PageWrapper>
        <p className="text-muted-foreground text-center py-20">Delivery not found</p>
      </PageWrapper>
    );
  }

  const currentStep = statusToStep[delivery.status] ?? 0;
  const lines = delivery.lines || [];
  const totalValue = lines.reduce((s: number, l: any) => s + (l.requestedQty || 0) * (l.unitPrice || 0), 0);
  const pickedCount = Object.values(pickedQtys).filter((qty) => qty > 0).length;
  const checkedCount = Object.values(packingChecks).filter(v => v).length;
  const allPackingChecked = Object.values(packingChecks).every(v => v === true);

  const handleMarkPicked = () => {
    if (pickedCount === 0) {
      toast.error('Please pick at least one item');
      return;
    }
    // We update pickedQtys along with status if your backend supports it, otherwise just status
    // For now, assume PATCH /status can handle additional payload or just advance status
    if (id) {
      updateDeliveryStatus(id, 'picked', pickedQtys);
      toast.success('Status updated successfully!');
    }
  };

  const handleMarkPacked = () => {
    if (!allPackingChecked) {
      toast.error('Please complete all checks');
      return;
    }
<<<<<<< HEAD
    statusMutation.mutate('packed');
  };

  const handleValidateDelivery = () => {
    validateMutation.mutate();
=======
    if (id) {
      updateDeliveryStatus(id, 'packed');
      toast.success('Status updated successfully!');
    }
  };



  // Enrich lines with fresh product data from store
  const enrichedLines = delivery.lines.map((line: any) => {
    const freshProduct = products.find(p => p._id === line.productId || p._id === line.product);
    return {
      ...line,
      productName: line.productName && line.productName !== 'Unknown Product'
        ? line.productName
        : freshProduct?.name || line.productName || '—',
      unit: line.unit || freshProduct?.unit || 'pcs',
      unitPrice: line.unitPrice || freshProduct?.sellingPrice
        || freshProduct?.costPrice || 0,
    };
  });

  const totalQty = enrichedLines.reduce((s: number, l: any) => s + (l.requestedQty || l.qty || 0), 0);
  const totalValue = enrichedLines.reduce(
    (s: number, l: any) => s + (l.requestedQty || l.qty || 0) * l.unitPrice, 0
  );

  const handleStatusUpdate = (
    newStatus: 'ready' | 'picked' | 'packed' | 'done' | 'canceled',
    extraQtys?: Record<string, number>
  ) => {
    updateDeliveryStatus(id!, newStatus, extraQtys);
    const messages: Record<string, string> = {
      ready: 'Delivery marked as Ready! 📦',
      picked: 'Items marked as Picked! ✅',
      packed: 'Items Packed! 📫',
      done: 'Delivery validated! Stock updated ✅',
      canceled: 'Delivery canceled',
    };
    toast.success(messages[newStatus] || 'Status updated');
    if (newStatus === 'canceled') navigate('/deliveries');
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
  };

  return (
    <PageWrapper>
      <button
        onClick={() => navigate('/deliveries')}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Deliveries
      </button>
<<<<<<< HEAD

      {/* Status Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
=======
      {/* Status Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between max-w-2xl text-center">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-0 flex-1 relative">
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all mx-auto"
                    style={{
                      borderColor: i <= currentStep ? '#00D4AA' : 'rgba(255,255,255,0.15)',
<<<<<<< HEAD
                      backgroundColor: i < currentStep ? '#00D4AA' : 'transparent',
=======
                      backgroundColor: i < currentStep ? '#00D4AA' : i === currentStep ? 'transparent' : 'transparent',
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                      color: i <= currentStep ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {i < currentStep ? <Check className="w-4 h-4 text-[#0A0E1A]" /> : i + 1}
                  </div>
                  <span className="text-xs mt-2 font-medium" style={{ color: i <= currentStep ? '#00D4AA' : 'rgba(255,255,255,0.5)' }}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-4 left-[60%] w-[80%] h-px"
<<<<<<< HEAD
                    style={{ background: i < currentStep ? '#00D4AA' : 'rgba(255,255,255,0.1)', position: 'relative', top: '-11px', flex: 1, marginRight: '-50%', marginLeft: '10px' }}
=======
                    style={{ background: i < currentStep ? '#00D4AA' : 'rgba(255,255,255,0.1)' }}
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                  />
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <GlassCard className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">CUSTOMER</p>
<<<<<<< HEAD
              <p className="text-sm font-semibold text-foreground">{delivery.customer?.name || delivery.customerName}</p>
=======
              <p className="text-sm font-semibold text-foreground">{delivery.customer?.name || delivery.customerId || delivery.customerName || 'Unknown Customer'}</p>
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
              <p className="text-xs text-muted-foreground mt-2">Delivery #{delivery.deliveryNo}</p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">DELIVERY DATE</p>
              <p className="text-sm font-semibold text-foreground">{delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : '—'}</p>
              <p className="text-xs text-muted-foreground mt-2">Created: {new Date(delivery.createdAt).toLocaleDateString()}</p>
            </GlassCard>
          </motion.div>

          {/* Step Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* READY/DRAFT - Show product lines */}
            {(delivery.status === 'draft' || delivery.status === 'ready') && (
              <GlassCard className="overflow-hidden">
                <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="text-sm font-semibold text-foreground">Product Lines</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Location</th>
                        <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Requested</th>
                        <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l: any) => {
                        const idKey = l.product || l.productId || l._id;
                        const productRecord = products.find((p: any) => p._id === idKey);
                        const stock = productRecord?.stock || 0;
                        const hasEnough = stock >= l.requestedQty;
                        return (
                          <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="p-4 text-foreground">{l.product?.name || l.productName}</td>
                            <td className="p-4 text-muted-foreground">{l.location?.name || l.locationName || 'Default'}</td>
                            <td className="p-4 text-right text-foreground">{l.requestedQty} {l.unit}</td>
                            <td className="p-4 text-right" style={{ color: hasEnough ? '#00D4AA' : '#FF4444' }}>
                              {stock} {l.unit}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* READY - Picking Step */}
            {delivery.status === 'ready' && (
              <GlassCard className="p-6 mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Step 1: Pick Items</h3>
                <div className="space-y-4">
                  {lines.map((line: any) => {
                    const idKey = line.product || line.productId || line._id;
                    return (
                      <div key={idKey} className="flex flex-wrap items-center justify-between p-3 rounded-lg gap-2" style={{ background: 'rgba(0,212,170,0.05)' }}>
                        <div>
                          <p className="text-sm font-medium text-foreground">{line.product?.name || line.productName}</p>
                          <p className="text-xs text-muted-foreground">{line.location?.name || line.locationName || 'Default'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="0"
                            max={line.requestedQty}
                            value={pickedQtys[idKey] ?? line.requestedQty}
                            onChange={(e) => setPickedQtys(prev => ({ ...prev, [idKey]: parseInt(e.target.value) || 0 }))}
                            className="glass-input w-20 text-center text-sm"
                          />
                          <span className="text-xs text-muted-foreground w-16 text-right">of {line.requestedQty}</span>
                          {(pickedQtys[idKey] || 0) >= line.requestedQty && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)' }}>
                  <p className="text-xs text-muted-foreground">
                    {pickedCount} of {lines.length} items picked
                  </p>
                  <div className="w-full h-2 rounded-full mt-2" style={{ background: 'rgba(0,212,170,0.15)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(pickedCount / Math.max(lines.length, 1)) * 100}%`, background: '#00D4AA' }} />
                  </div>
                </div>
              </GlassCard>
            )}

            {/* PICKED - Packing Checklist */}
            {delivery.status === 'picked' && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Step 2: Pack Items</h3>
                <div className="space-y-3 mb-6">
                  {[
                    { key: 'check1', label: 'All items verified against delivery order' },
                    { key: 'check2', label: 'Packaging materials applied' },
                    { key: 'check3', label: 'Shipping label printed' },
                    { key: 'check4', label: 'Items ready for dispatch' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors" style={{ background: 'rgba(0,212,170,0.05)' }}>
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={packingChecks[item.key as keyof typeof packingChecks]}
                          onChange={(e) => setPackingChecks(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="w-5 h-5 rounded border-2 border-primary appearance-none checked:bg-primary"
                        />
                        {packingChecks[item.key as keyof typeof packingChecks] && <Check className="absolute w-3 h-3 text-[#080C14] pointer-events-none" />}
                      </div>
                      <span className="text-sm text-foreground">{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)' }}>
                  <p className="text-xs text-muted-foreground">
                    {checkedCount} of 4 checks completed
                  </p>
                  <div className="w-full h-2 rounded-full mt-2" style={{ background: 'rgba(0,212,170,0.15)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(checkedCount / 4) * 100}%`, background: '#00D4AA' }} />
                  </div>
                </div>
              </GlassCard>
            )}

            {/* PACKED - Validation Step */}
            {delivery.status === 'packed' && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Step 3: Validate Delivery</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mb-6">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Product</th>
                        <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">From</th>
                        <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Qty</th>
                        <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l: any) => (
                        <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="p-3 text-foreground">{l.product?.name || l.productName}</td>
                          <td className="p-3 text-muted-foreground">{l.location?.name || l.locationName || 'Default'}</td>
                          <td className="p-3 text-right text-foreground">{l.requestedQty} {l.unit}</td>
                          <td className="p-3 text-right text-foreground">₹{((l.requestedQty || 0) * (l.unitPrice || 0)).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Total value: <span className="text-foreground font-semibold">₹{totalValue.toLocaleString('en-IN')}</span></p>

                <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(255,68,68,0.05)' }}>
                  <p className="text-xs text-muted-foreground mb-2">Stock impact on validation:</p>
                  <div className="space-y-1">
                    {lines.map((l: any) => (
                      <p key={l._id} className="text-xs" style={{ color: '#FF4444' }}>
                        • {l.product?.name || l.productName}: −{l.requestedQty} from {l.location?.name || l.locationName || 'Default'}
                      </p>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* DONE - Success */}
            {delivery.status === 'done' && (
              <GlassCard className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Delivery Completed</p>
                <p className="text-sm text-muted-foreground mt-2">Total dispatched: ₹{totalValue.toLocaleString('en-IN')}</p>
              </GlassCard>
            )}
            
            {/* CANCELED - Success */}
            {delivery.status === 'canceled' && (
              <GlassCard className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-[#FF4444] mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Delivery Canceled</p>
              </GlassCard>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Action Card */}
<<<<<<< HEAD
          <GlassCard className="p-6" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
=======
          <GlassCard className="p-6 border-[#00D4AA]/20">
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
            <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>

            <div className="mb-4 p-3 rounded-lg text-center" style={{ background: 'rgba(0,212,170,0.05)' }}>
              <StatusBadge status={delivery.status} />
            </div>

            <div className="space-y-3">
              {delivery.status === 'draft' && (
                <>
                  <button
                    onClick={() => statusMutation.mutate('ready')}
                    disabled={statusMutation.isPending}
                    className="btn-primary-gradient w-full text-sm"
                  >
                    Confirm Order
                  </button>
                  <button onClick={() => navigate(`/deliveries/${delivery._id}/edit`)} className="w-full px-3 py-2 text-sm rounded-lg transition-colors border border-transparent" style={{ background: 'rgba(255,255,255,0.05)' }}>
                     ✏️ Edit
                  </button>
                </>
              )}
                
              {delivery.status === 'ready' && (
                <button
                  onClick={handleMarkPicked}
                  disabled={statusMutation.isPending}
                  className="btn-primary-gradient w-full text-sm"
                >
                  Mark as Picked
                </button>
              )}

              {delivery.status === 'picked' && (
                <button
                  onClick={handleMarkPacked}
                  disabled={!allPackingChecked || statusMutation.isPending}
                  className="btn-primary-gradient w-full text-sm disabled:opacity-50"
                >
                  Mark as Packed
                </button>
              )}

              {delivery.status === 'packed' && (
                <button
<<<<<<< HEAD
                  onClick={handleValidateDelivery}
=======
                  onClick={() => validateMutation.mutate()}
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                  disabled={validateMutation.isPending}
                  className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2"
                >
                  {validateMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {validateMutation.isPending ? 'Validating...' : 'Validate Delivery'}
                </button>
              )}
<<<<<<< HEAD

              {(delivery.status !== 'done' && delivery.status !== 'canceled') && (
                <button onClick={() => statusMutation.mutate('canceled')} disabled={statusMutation.isPending} className="w-full px-3 py-2 text-sm rounded-lg" style={{ background: 'rgba(255,68,68,0.15)', color: '#FF4444' }}>
                  Cancel
=======
              {delivery.status === 'done' && (
                <div className="text-center py-2">
                  <p className="text-xs" style={{ color: '#00D4AA' }}>
                    ✓ Delivery Completed
                  </p>
                </div>
              )}
              {delivery.status !== 'done' && delivery.status !== 'canceled' && (
                <button
                  onClick={() => {
                    if (confirm('Cancel this delivery?')) {
                      handleStatusUpdate('canceled');
                    }
                  }}
                  className="w-full text-sm py-2 rounded-lg transition-colors"
                  style={{
                    background: 'rgba(255,68,68,0.1)',
                    border: '1px solid rgba(255,68,68,0.3)',
                    color: '#FF4444',
                  }}
                >
                  Cancel Delivery
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
                </button>
              )}
            </div>
          </GlassCard>

          {/* Summary */}
<<<<<<< HEAD
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lines:</span>
                <span className="text-foreground font-medium">{lines.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Qty:</span>
                <span className="text-foreground font-medium">{lines.reduce((s: number, l: any) => s + (l.requestedQty || 0), 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Value:</span>
                <span className="text-foreground font-medium">₹{totalValue.toLocaleString('en-IN')}</span>
=======
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lines</span>
                <span className="text-foreground">{enrichedLines.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Qty</span>
                <span className="text-foreground">{totalQty}</span>
              </div>
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Value</span>
                <span className="font-semibold" style={{ color: '#00D4AA' }}>
                  ₹{totalValue.toLocaleString('en-IN')}
                </span>
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
