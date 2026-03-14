import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { customers, products, warehouses } from '@/mock/data';
import { ChevronLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeliveryFormPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [lines, setLines] = useState([{ id: 1, productId: '', locationId: '', qty: 1 }]);

  const addLine = () => setLines([...lines, { id: Date.now(), productId: '', locationId: '', qty: 1 }]);
  const removeLine = (id: number) => setLines(lines.filter(l => l.id !== id));

  return (
    <PageWrapper>
      <button onClick={() => navigate('/deliveries')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">New Delivery Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Customer *</label>
              <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="glass-input w-full text-sm">
                <option value="">Select customer</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
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
            <div className="flex justify-between"><span className="text-muted-foreground">Total Qty</span><span className="text-foreground">{lines.reduce((s, l) => s + l.qty, 0)}</span></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products to Deliver</h3>
        {lines.map((line, i) => (
          <div key={line.id} className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
            <select className="glass-input flex-1 text-sm" value={line.productId} onChange={(e) => {
              const updated = [...lines]; updated[i].productId = e.target.value; setLines(updated);
            }}>
              <option value="">Select product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>)}
            </select>
            <input type="number" min={1} value={line.qty} onChange={(e) => {
              const updated = [...lines]; updated[i].qty = parseInt(e.target.value) || 1; setLines(updated);
            }} className="glass-input w-24 text-sm text-center" />
            <button onClick={() => removeLine(line.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ))}
        <button onClick={addLine} className="mt-2 w-full btn-ghost-dark flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Line
        </button>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/deliveries')} className="btn-ghost-dark text-sm">Cancel</button>
        <button onClick={() => { toast.success('Delivery created'); navigate('/deliveries'); }} className="btn-primary-gradient text-sm">Create Delivery</button>
      </div>
    </PageWrapper>
  );
}
