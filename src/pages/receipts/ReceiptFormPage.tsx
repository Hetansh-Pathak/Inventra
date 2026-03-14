import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { suppliers, products, warehouses } from '@/mock/data';
import { ChevronLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Line { id: number; productId: string; locationId: string; qty: number; }

export default function ReceiptFormPage() {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Line[]>([{ id: 1, productId: '', locationId: '', qty: 1 }]);

  const addLine = () => setLines([...lines, { id: Date.now(), productId: '', locationId: '', qty: 1 }]);
  const removeLine = (id: number) => setLines(lines.filter(l => l.id !== id));
  const updateLine = (id: number, field: keyof Line, value: any) => setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));

  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const totalValue = lines.reduce((s, l) => {
    const p = products.find(pr => pr._id === l.productId);
    return s + l.qty * (p?.costPrice || 0);
  }, 0);

  const handleSubmit = () => {
    if (!supplier) { toast.error('Select a supplier'); return; }
    toast.success('Receipt created');
    navigate('/receipts');
  };

  return (
    <PageWrapper>
      <button onClick={() => navigate('/receipts')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Receipts
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Receipt</h1>
        <span className="status-draft px-3 py-1 rounded-full text-xs">● Draft</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Header Info</h3>
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Supplier *</label>
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
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
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Est. Value</span><span className="text-primary font-bold">₹{totalValue.toLocaleString()}</span></div>
          </div>
        </GlassCard>
      </div>

      {/* Lines */}
      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products to Receive</h3>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={line.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
              <select value={line.productId} onChange={(e) => updateLine(line.id, 'productId', e.target.value)} className="glass-input flex-1 text-sm">
                <option value="">Select product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
              </select>
              <select value={line.locationId} onChange={(e) => updateLine(line.id, 'locationId', e.target.value)} className="glass-input w-40 text-sm">
                <option value="">Location</option>
                {warehouses.flatMap(w => w.locations).map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
              <input type="number" min={1} value={line.qty} onChange={(e) => updateLine(line.id, 'qty', parseInt(e.target.value) || 1)} className="glass-input w-24 text-sm text-center" />
              <button onClick={() => removeLine(line.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
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
        <button className="btn-ghost-dark text-sm" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>Save Draft</button>
        <button onClick={handleSubmit} className="btn-primary-gradient text-sm">Confirm Receipt →</button>
      </div>
    </PageWrapper>
  );
}
