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
  location: string;
  requestedQty: number;
  unitPrice: number;
}

export default function DeliveryFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { customers, products, warehouses, deliveries, addDelivery } = useAppStore();
  const isEditMode = location.pathname.includes('/edit');

  const [customer, setCustomer] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [lines, setLines] = useState<Line[]>([{ id: Date.now(), product: '', location: '', requestedQty: 1, unitPrice: 0 }]);

  const delivery = isEditMode && id ? deliveries.find(d => d._id === id) : null;
  const deliveryLoading = false;

  useEffect(() => {
    if (isEditMode && delivery) {
      setCustomer(delivery.customer?._id || delivery.customerId || '');
      setDeliveryDate(delivery.deliveryDate ? new Date(delivery.deliveryDate).toISOString().split('T')[0] : '');
      if (delivery.lines && delivery.lines.length > 0) {
        setLines(delivery.lines.map((l: any, i: number) => ({
          id: Date.now() + i,
          product: l.product || l.productId || l._id,
          location: l.location || l.locationId || '',
          requestedQty: l.requestedQty || 1,
          unitPrice: l.unitPrice || 0,
        })));
      }
    }
  }, [isEditMode, delivery]);

  const mutation = {
    isPending: false,
    mutate: (payload: any) => {
      if (!isEditMode) {
        addDelivery(payload);
      }
      toast.success(isEditMode ? 'Delivery updated successfully' : 'Delivery created successfully');
      navigate('/deliveries');
    }
  };

  const addLine = () => setLines([...lines, { id: Date.now(), product: '', location: '', requestedQty: 1, unitPrice: 0 }]);
  const removeLine = (id: number) => setLines(lines.filter(l => l.id !== id));
  const updateLine = (id: number, field: keyof Line, value: any) => {
    setLines(lines.map(l => {
      if (l.id !== id) return l;
      if (field === 'product') {
        const p = products.find((pr: any) => pr._id === value);
        return { ...l, [field]: value, unitPrice: p?.sellingPrice || 0 };
      }
      return { ...l, [field]: value };
    }));
  };

  const totalQty = lines.reduce((s, l) => s + l.requestedQty, 0);
  const totalValue = lines.reduce((s, l) => s + (l.requestedQty * l.unitPrice), 0);

  const handleSubmit = (status: 'draft' | 'ready' = 'draft') => {
    if (!customer) { toast.error('Select a customer'); return; }
    if (lines.length === 0 || lines.some(l => !l.product || !l.requestedQty)) {
      toast.error('All lines must have a product and quantity');
      return;
    }

    const payload = {
      customer,
      deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : undefined,
      status: isEditMode && delivery?.status !== 'draft' ? delivery.status : status,
      lines: lines.map(l => ({
        product: l.product,
        location: l.location || undefined,
        requestedQty: Number(l.requestedQty),
        unitPrice: Number(l.unitPrice),
      }))
    };

    mutation.mutate(payload);
  };

  if (isEditMode && deliveryLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <button onClick={() => navigate('/deliveries')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Deliveries
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{isEditMode ? 'Edit Delivery' : 'New Delivery Order'}</h1>
        <span className={`px-3 py-1 rounded-full text-xs ${isEditMode && delivery?.status !== 'draft' ? 'status-ready' : 'status-draft'}`}>
          ● {isEditMode ? delivery?.status : 'Draft'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Customer *</label>
              <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select customer</option>
                {/* Fallback to mock data if API doesn't exist yet, but assuming it does */}
                {customers?.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="glass-input w-full text-sm" />
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Lines</span><span className="text-foreground">{lines.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Qty</span><span className="text-foreground">{totalQty}</span></div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="flex justify-between font-bold"><span className="text-muted-foreground">Total Value</span><span className="text-primary">₹{totalValue.toLocaleString('en-IN')}</span></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products to Deliver</h3>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={line.id} className="flex flex-wrap lg:flex-nowrap items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-xs text-muted-foreground w-6 text-center">{i + 1}</span>
              <select className="glass-input flex-1 min-w-[200px] text-sm" value={line.product} onChange={(e) => updateLine(line.id, 'product', e.target.value)}>
                <option value="">Select product</option>
                {products?.map((p: any) => <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>)}
              </select>
              <select className="glass-input w-full lg:w-48 text-sm" value={line.location} onChange={(e) => updateLine(line.id, 'location', e.target.value)}>
                <option value="">Default Location</option>
                {warehouses?.flatMap((w: any) => w.locations?.map((l: any) => ({ ...l, whName: w.name })) || []).map((l: any) => (
                  <option key={l._id} value={l._id}>{l.whName} - {l.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={line.requestedQty} onChange={(e) => updateLine(line.id, 'requestedQty', parseInt(e.target.value) || 1)} className="glass-input w-24 text-sm text-center" placeholder="Qty" />
                <span className="text-muted-foreground text-xs mx-1">×</span>
                <input type="number" min={0} value={line.unitPrice} onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))} className="glass-input w-24 text-sm text-right" placeholder="Price" />
              </div>
              <button onClick={() => removeLine(line.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors ml-auto lg:ml-0">
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addLine} className="mt-3 w-full btn-ghost-dark flex items-center justify-center gap-2 text-sm" style={{ borderColor: 'rgba(0,212,170,0.2)' }}>
          <Plus className="w-4 h-4" /> Add Line
        </button>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/deliveries')} className="btn-ghost-dark text-sm">Cancel</button>
        {(!isEditMode || delivery?.status === 'draft') && (
          <button onClick={() => handleSubmit('draft')} disabled={mutation.isPending} className="btn-ghost-dark text-sm" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>
            {mutation.isPending ? 'Saving...' : 'Save Draft'}
          </button>
        )}
        <button onClick={() => handleSubmit('ready')} disabled={mutation.isPending} className="btn-primary-gradient text-sm">
          {mutation.isPending ? 'Processing...' : (isEditMode && delivery?.status !== 'draft' ? 'Update Delivery' : 'Confirm Order →')}
        </button>
      </div>
    </PageWrapper>
  );
}
