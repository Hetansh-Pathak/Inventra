import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { apiFetch } from '@/lib/api';
import { ChevronLeft, Check, Building, Calendar, FileText, CheckCircle, Printer, Download, User, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const steps = ['Draft', 'Processing', 'Received'];
const statusToStep: Record<string, number> = {
  draft: 0, processing: 1, received: 2
};

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { receipts, updateReceiptStatus, suppliers, products } = useAppStore();

  const [modalState, setModalState] = useState<{ open: boolean; receivedQtys: Record<string, number> }>({
    open: false,
    receivedQtys: {},
  });

  const receipt = receipts.find(r => r._id === id);
  const isLoading = false;

  const statusMutation = {
    isPending: false,
    mutate: (newStatus: any) => {
      if (id) updateReceiptStatus(id, newStatus);
      toast.success('Status updated successfully!');
    }
  };

  const validateMutation = {
    isPending: false,
    mutate: (qtys: Record<string, number>) => {
      if (id) updateReceiptStatus(id, 'validated', qtys);
      toast.success('Receipt validated! Stock updated.');
      setModalState(prev => ({ ...prev, open: false }));
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

  if (!receipt) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground text-center mb-4">Receipt not found</p>
          <button onClick={() => navigate('/receipts')} className="btn-primary-gradient text-sm">
            Back to Receipts
          </button>
        </div>
      </PageWrapper>
    );
  }

  const currentStep = statusToStep[receipt.status] ?? 0;

  // Find supplier to resolve Unknown Supplier issue
  const receiptSupplier = suppliers?.find((s: any) => s._id === receipt.supplier || s._id === receipt.supplierId);

  // Enrich lines with product and location data from store
  const enrichedLines = receipt.lines.map((l: any) => {
    const prodDef = products?.find((p: any) => p._id === l.product || p._id === l.productId);
    return {
      ...l,
      productName: l.productName && l.productName !== 'Unknown Product' ? l.productName : (prodDef?.name || 'Unknown Product'),
      sku: prodDef?.sku || 'N/A',
      unit: l.unit || prodDef?.unit || 'pcs',
      locationName: l.location?.name || l.locationName || 'Default',
    };
  });

  const totalQty = enrichedLines.reduce((s: number, l: any) => s + (l.expectedQty || l.qty || 0), 0);
  const totalValue = enrichedLines.reduce((s: number, l: any) => s + ((l.expectedQty || l.qty || 0) * (l.unitPrice || 0)), 0);

  const handleStatusUpdate = (newStatus: 'processing' | 'received' | 'canceled' | 'confirmed' | 'validated' | 'done') => {
    updateReceiptStatus(id!, newStatus as any);
    toast.success('Status updated successfully!');
  };

  const handleOpenValidateModal = () => {
    const initialQtys: Record<string, number> = {};
    enrichedLines.forEach((line: any) => {
      initialQtys[line.product || line.productId || line._id] = line.receivedQty ?? line.expectedQty;
    });
    setModalState({ open: true, receivedQtys: initialQtys });
  };

  const handleConfirmValidation = () => {
    validateMutation.mutate(modalState.receivedQtys);
  };

  return (
    <PageWrapper>
      <button
        onClick={() => navigate('/receipts')}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Receipts
      </button>

      {/* Status Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between max-w-2xl text-center">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-0 flex-1 relative">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all mx-auto"
                    style={{
                      borderColor: i <= currentStep ? '#00D4AA' : 'rgba(255,255,255,0.15)',
                      backgroundColor: i < currentStep ? '#00D4AA' : i === currentStep ? 'transparent' : 'transparent',
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
                    style={{ background: i < currentStep ? '#00D4AA' : 'rgba(255,255,255,0.1)' }}
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
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            {/* Supplier Card */}
            <GlassCard className="p-4 flex flex-col h-full">
              <div className="flex items-start gap-2">
              <User className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" style={{ color: '#00D4AA' }} />
              <div>
                <p className="text-xs text-muted-foreground">Supplier</p>
                <p className="text-foreground font-medium mt-0.5">{receiptSupplier?.name || receipt.supplierName || '—'}</p>
              </div>
            </div>
            </GlassCard>

            {/* Dates Card */}
            <GlassCard className="p-4 flex flex-col h-full">
              <div className="flex items-start gap-3 flex-1">
                <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium mb-2">DATES</p>
                  <div className="space-y-1">
                    <div className="text-xs"><span className="text-muted-foreground">Created:</span> <span className="text-foreground">{new Date(receipt.createdAt).toLocaleDateString()}</span></div>
                    <div className="text-xs"><span className="text-muted-foreground">Expected:</span> <span className="text-foreground">{receipt.expectedDate ? new Date(receipt.expectedDate).toLocaleDateString() : '—'}</span></div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Reference Card */}
            <GlassCard className="p-4 flex flex-col h-full">
              <div className="flex items-start gap-3 flex-1">
                <FileText className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium mb-1">REFERENCE</p>
                  <p className="text-sm font-mono text-foreground mb-1">{receipt.reference || receipt.receiptNo || '—'}</p>
                  {receipt.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2" title={receipt.notes}>Notes: {receipt.notes}</p>}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Product Lines Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-0 overflow-hidden text-sm">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Product Lines</h3>
              <span className="text-xs text-muted-foreground">{enrichedLines.length} products · {totalQty} units</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-xs uppercase text-muted-foreground">
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-right p-4 font-medium">Expected</th>
                    <th className="text-right p-4 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedLines.map((l: any, i: number) => (
                    <tr key={l._id || i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="text-foreground font-medium">{l.productName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {l.sku}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground text-xs">{l.locationName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-foreground">
                        {l.expectedQty || l.qty} {l.unit}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          (l.receivedQty || 0) === (l.expectedQty || l.qty) ? 'bg-[#00D4AA]/10 text-[#00D4AA]' :
                          (l.receivedQty || 0) > 0 ? 'bg-[#FFB020]/10 text-[#FFB020]' : 'text-slate-500'
                        }`}>
                          {l.receivedQty || 0} {l.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Action Card */}
          <GlassCard className="p-6 border-[#00D4AA]/20">
            <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>

            <div className="mb-4 p-3 rounded-lg text-center" style={{ background: 'rgba(0,212,170,0.05)' }}>
              <StatusBadge status={receipt.status} />
            </div>

            <div className="space-y-2">
              {receipt.status === 'draft' && (
                <>
                  <button
                    onClick={() => statusMutation.mutate('confirmed')}
                    disabled={statusMutation.isPending}
                    className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm Receipt
                  </button>
                  <button onClick={() => navigate(`/receipts/${receipt._id}/edit`)} className="w-full px-3 py-2 text-sm rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => statusMutation.mutate('canceled')} className="w-full px-3 py-2 text-sm rounded-lg" style={{ background: 'rgba(255,68,68,0.15)', color: '#FF4444' }}>
                    Cancel
                  </button>
                </>
              )}

              {receipt.status === 'confirmed' && (
                <>
                  <div className="p-4 rounded-lg mt-6" style={{ background: 'rgba(0,212,170,0.05)' }}>
                    <p className="text-xs font-medium text-primary mb-2" style={{ color: '#00D4AA' }}>Stock will increase:</p>
                    {enrichedLines.map((l: any) => (
                      <p key={l._id} className="text-xs text-slate-300">• {l.productName}: +{l.receivedQty || l.expectedQty || l.qty} {l.unit}</p>
                    ))}
                  </div>
                  <button onClick={() => handleStatusUpdate('received')} className="bg-gradient-to-r from-[#00D4AA] to-[#00BCD4] text-[#0A0E1A] font-bold w-full py-2.5 rounded-xl text-sm transition-transform hover:scale-[1.02]">
                    Validate Receipt → Update Stock
                  </button>
                </>
              )}

              {receipt.status === 'validated' && (
                <>
                  <button
                    onClick={() => statusMutation.mutate('done')}
                    disabled={statusMutation.isPending}
                    className="btn-primary-gradient w-full text-sm"
                  >
                    Mark as Done
                  </button>
                  <button className="w-full px-3 py-2 text-sm rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Printer className="w-4 h-4 inline mr-2" /> Print
                  </button>
                  <button className="w-full px-3 py-2 text-sm rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Download className="w-4 h-4 inline mr-2" /> Export PDF
                  </button>
                </>
              )}

              {(receipt.status === 'done' || receipt.status === 'canceled') && (
                <div className="text-center p-3 rounded-lg" style={{ background: receipt.status === 'done' ? 'rgba(0,212,170,0.05)' : 'rgba(255,68,68,0.05)' }}>
                  {receipt.status === 'done' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-primary font-medium">Completed</p>
                    </>
                  ) : (
                    <p className="text-xs text-[#FF4444] font-medium">Canceled</p>
                  )}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Summary Card */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lines:</span>
                <span className="text-foreground font-medium">{enrichedLines.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Qty:</span>
                <span className="text-foreground font-medium">{totalQty}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Value:</span>
                <span className="text-foreground font-medium">₹{totalValue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Validate Modal */}
      <AnimatePresence>
        {modalState.open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalState(prev => ({ ...prev, open: false }))}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <h2 className="text-lg font-semibold text-foreground">Validate Receipt</h2>
                  <p className="text-sm text-muted-foreground mt-1">Enter the actual quantities received</p>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto max-h-[40vh] overflow-y-auto" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <table className="w-full text-sm mb-6">
                      <thead className="sticky top-0 z-10" style={{ background: '#080C14' }}>
                        <tr>
                          <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Product</th>
                          <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Expected</th>
                          <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrichedLines.map((line: any) => {
                          const idKey = line.product || line.productId || line._id;
                          return (
                            <tr key={idKey} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <td className="p-3 text-foreground">{line.product?.name || line.productName}</td>
                              <td className="p-3 text-right text-muted-foreground">{line.expectedQty}</td>
                              <td className="p-3">
                                <div className="flex justify-end">
                                  <input
                                    type="number"
                                    min="0"
                                    value={modalState.receivedQtys[idKey] || 0}
                                    onChange={(e) =>
                                      setModalState(prev => ({
                                        ...prev,
                                        receivedQtys: { ...prev.receivedQtys, [idKey]: parseInt(e.target.value) || 0 },
                                      }))
                                    }
                                    className="glass-input w-24 text-right text-sm"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 rounded-lg mt-6" style={{ background: 'rgba(0,212,170,0.05)' }}>
                    <p className="text-xs text-muted-foreground mb-2">Stock changes that will occur:</p>
                    <div className="space-y-1">
                      {enrichedLines.map((line: any) => {
                        const idKey = line.product || line.productId || line._id;
                        return (
                          <p key={idKey} className="text-xs text-primary">
                            • {line.product?.name || line.productName}: +{modalState.receivedQtys[idKey] || line.expectedQty} at {line.location?.name || line.locationName || 'Default'}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setModalState(prev => ({ ...prev, open: false }))}
                      className="px-4 py-2 text-sm rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmValidation}
                      disabled={validateMutation.isPending}
                      className="btn-primary-gradient px-4 py-2 text-sm flex items-center gap-2"
                    >
                      {validateMutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Confirm & Update Stock
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
