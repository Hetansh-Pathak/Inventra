import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { apiFetch } from '@/lib/api';
import { ChevronLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Line {
  id: number;
  product: string;
  warehouseId: string;
  locationId: string;
  expectedQty: number;
  unitPrice: number;
}

export default function ReceiptFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { suppliers, products, warehouses, receipts, addReceipt } = useAppStore();
  const isEditMode = location.pathname.includes('/edit');

  const [supplier, setSupplier] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Line[]>([{ id: Date.now(), product: '', warehouseId: '', locationId: '', expectedQty: 1, unitPrice: 0 }]);

  const receipt = isEditMode && id ? receipts.find(r => r._id === id) : null;
  const receiptLoading = false;

  useEffect(() => {
    if (isEditMode && receipt) {
      setSupplier(receipt.supplier?._id || receipt.supplierId || '');
      setExpectedDate(receipt.expectedDate ? new Date(receipt.expectedDate).toISOString().split('T')[0] : '');
      setReference(receipt.reference || '');
      setNotes(receipt.notes || '');
      if (receipt.lines && receipt.lines.length > 0) {
        setLines(receipt.lines.map((l: any, i: number) => ({
          id: Date.now() + i,
          product: l.product || l.productId || l._id,
          warehouseId: l.warehouseId || '',
          locationId: l.location || l.locationId || '',
          expectedQty: l.expectedQty || 1,
          unitPrice: l.unitPrice || 0,
        })));
      }
    }
  }, [isEditMode, receipt]);

  const mutation = {
    isPending: false,
    mutate: (payload: any) => {
      if (!isEditMode) {
        addReceipt(payload);
      }
      toast.success(isEditMode ? 'Receipt updated successfully' : 'Receipt created successfully');
      navigate('/receipts');
    }
  };

  const addLine = () => setLines([...lines, { id: Date.now(), product: '', warehouseId: '', locationId: '', expectedQty: 1, unitPrice: 0 }]);
  const removeLine = (id: number) => setLines(lines.filter(l => l.id !== id));
  const updateLine = (id: number, field: keyof Line, value: any) => {
    setLines(lines.map(l => {
      if (l.id !== id) return l;
      // Auto-fill unit price if product is selected
      if (field === 'product') {
        const p = products.find((pr: any) => pr._id === value);
        return { ...l, [field]: value, unitPrice: p?.costPrice || 0 };
      }
      return { ...l, [field]: value };
    }));
  };

  const totalQty = lines.reduce((s, l) => s + l.expectedQty, 0);
  const totalValue = lines.reduce((s, l) => s + (l.expectedQty * l.unitPrice), 0);

  const handleSubmit = (status: 'draft' | 'confirmed' = 'draft') => {
    if (!supplier) { toast.error('Select a supplier'); return; }
    if (lines.length === 0 || lines.some(l => !l.product || !l.expectedQty)) {
      toast.error('All lines must have a product and quantity');
      return;
    }

    const selectedSupplier = suppliers.find((s: any) => s._id === supplier);

    const payload = {
      supplier: supplier, // Ensure we send supplier ID for backend
      supplierId: supplier,
      supplierName: selectedSupplier?.name || 'Unknown Supplier', // Fix Unknown
      expectedDate: expectedDate ? new Date(expectedDate).toISOString() : undefined,
      reference,
      notes,
      status: isEditMode && receipt?.status !== 'draft' ? receipt.status : status,
      lines: lines.map(l => {
        const prodDef = products.find((p: any) => p._id === l.product);
        const whDef = warehouses.find((w: any) => w._id === l.warehouseId);
        const locDef = whDef?.locations?.find((loc: any) => loc._id === l.locationId);

        return {
          product: l.product,
          productId: l.product,
          productName: prodDef?.name || 'Unknown Product', // Fix Unknown
          unit: prodDef?.unit || 'pcs',
          warehouseId: l.warehouseId || undefined,
          location: l.locationId || undefined,
          locationId: l.locationId || undefined,
          locationName: locDef?.name || undefined,
          expectedQty: Number(l.expectedQty),
          unitPrice: Number(l.unitPrice),
        };
      })
    };

    mutation.mutate(payload);
  };

  if (isEditMode && receiptLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <button onClick={() => navigate('/receipts')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Receipts
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{isEditMode ? 'Edit Receipt' : 'New Receipt'}</h1>
        <span className={`px-3 py-1 rounded-full text-xs ${isEditMode && receipt?.status !== 'draft' ? 'status-validated' : 'status-draft'}`}>
          ● {isEditMode ? receipt?.status : 'Draft'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Header Info</h3>
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Supplier *</label>
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select supplier</option>
                {suppliers?.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label mb-1.5 block">Expected Date</label>
                <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} className="glass-input w-full text-sm" />
              </div>
              <div>
                <label className="section-label mb-1.5 block">Reference No.</label>
                <input value={reference} onChange={(e) => setReference(e.target.value)} className="glass-input w-full text-sm" placeholder="PO number" />
              </div>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input w-full text-sm resize-none" rows={3} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Lines</span><span className="text-foreground font-medium">{lines.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Qty</span><span className="text-foreground font-medium">{totalQty}</span></div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Est. Value</span><span className="text-primary font-bold">₹{totalValue.toLocaleString('en-IN')}</span></div>
          </div>
        </GlassCard>
      </div>

      {/* Lines */}
      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products to Receive</h3>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={line.id} className="flex flex-wrap lg:flex-nowrap items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-xs text-muted-foreground w-6 text-center">{i + 1}</span>
              <select value={line.product} onChange={(e) => updateLine(line.id, 'product', e.target.value)} className="glass-input flex-1 min-w-[200px] text-sm">
                <option value="">Select product</option>
                {products?.map((p: any) => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
              </select>
              <select
                value={line.warehouseId}
                onChange={e => { updateLine(line.id, 'warehouseId', e.target.value); updateLine(line.id, 'locationId', ''); }}
                className="glass-input text-sm flex-1 min-w-[150px]">
                <option value="">Select Warehouse</option>
                {warehouses.map((w: any) => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
              {line.warehouseId && (
                <select
                  value={line.locationId}
                  onChange={e => updateLine(line.id, 'locationId', e.target.value)}
                  className="glass-input text-sm flex-1 min-w-[150px]">
                  <option value="">Select Location</option>
                  {warehouses
                    .find((w: any) => w._id === line.warehouseId)
                    ?.locations?.map((loc: any) => (
                      <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))}
                </select>
              )}
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={line.expectedQty} onChange={(e) => updateLine(line.id, 'expectedQty', parseInt(e.target.value) || 1)} className="glass-input w-24 text-sm text-center" placeholder="Qty" />
                <span className="text-muted-foreground text-xs mx-1">×</span>
                <input type="number" min={0} value={line.unitPrice} onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))} className="glass-input w-28 text-sm text-right" placeholder="Price" />
              </div>
              <button onClick={() => removeLine(line.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors ml-auto lg:ml-0">
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addLine} className="mt-3 w-full btn-ghost-dark flex items-center justify-center gap-2 text-sm" style={{ borderColor: 'rgba(0,212,170,0.2)' }}>
          <Plus className="w-4 h-4" /> Add Product Line
        </button>
      </GlassCard>

      <div className="flex items-center justify-end gap-3">
        <button onClick={() => navigate('/receipts')} className="btn-ghost-dark text-sm">Cancel</button>
        {(!isEditMode || receipt?.status === 'draft') && (
          <button onClick={() => handleSubmit('draft')} disabled={mutation.isPending} className="btn-ghost-dark text-sm" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>
            {mutation.isPending ? 'Saving...' : 'Save Draft'}
          </button>
        )}
        <button onClick={() => handleSubmit('confirmed')} disabled={mutation.isPending} className="btn-primary-gradient text-sm">
          {mutation.isPending ? 'Processing...' : (isEditMode && receipt?.status !== 'draft' ? 'Update Receipt' : 'Confirm Receipt →')}
        </button>
      </div>
    </PageWrapper>
  );
}
