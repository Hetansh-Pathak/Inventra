import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { ChevronLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';

interface Line {
  id: number;
  productId: string;
  locationId: string;
  qty: number;
}

export default function DeliveryFormPage() {
  const navigate = useNavigate();
  const { customers, products, warehouses, addDelivery } = useAppStore();
  const [customerId, setCustomerId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { id: 1, productId: '', locationId: '', qty: 1 }
  ]);

  const addLine = () =>
    setLines([...lines, { id: Date.now(), productId: '', locationId: '', qty: 1 }]);

  const removeLine = (id: number) =>
    setLines(lines.filter(l => l.id !== id));

  const updateLine = (id: number, field: keyof Line, value: any) =>
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));

  // Get all locations flat from all warehouses
  const allLocations = warehouses.flatMap(w =>
    w.locations.map(loc => ({
      ...loc,
      warehouseName: w.name,
      displayName: `${w.name} → ${loc.name}`,
    }))
  );

  const getProduct = (id: string) => products.find(p => p._id === id);
  const getLocation = (id: string) => allLocations.find(l => l._id === id);
  const getCustomer = (id: string) => customers.find(c => c._id === id);

  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const totalValue = lines.reduce((s, l) => {
    const p = getProduct(l.productId);
    return s + l.qty * (p?.sellingPrice || p?.costPrice || 0);
  }, 0);

  const handleSubmit = () => {
    if (!customerId) {
      toast.error('Please select a customer');
      return;
    }
    if (lines.some(l => !l.productId)) {
      toast.error('Please select a product for each line');
      return;
    }

    const selectedCustomer = getCustomer(customerId);

    const deliveryLines = lines.map((l, i) => {
      const prod = getProduct(l.productId);
      const loc = getLocation(l.locationId);
      return {
        _id: `line-${i}-${Date.now()}`,
        productId: l.productId,
        productName: prod?.name || 'Unknown Product',
        locationId: l.locationId || 'default',
        locationName: loc?.name || loc?.displayName || 'Main Warehouse',
        requestedQty: l.qty,
        pickedQty: 0,
        unit: prod?.unit || 'pcs',
        unitPrice: prod?.sellingPrice || prod?.costPrice || 0,
      };
    });

    const nd = addDelivery({
      customerId,
      customerName: selectedCustomer?.name || 'Unknown',
      status: 'draft',
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      lines: deliveryLines,
    });

    toast.success(`Delivery ${nd.deliveryNo} created! ✅`);
    navigate(`/deliveries/${nd._id}`);
  };

  return (
    <PageWrapper>
      <button
        onClick={() => navigate('/deliveries')}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Deliveries
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Delivery Order</h1>
        <span className="text-xs px-3 py-1 rounded-full"
          style={{ background: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)' }}>
          ● Draft
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Header Info</h3>
          <div className="space-y-4">
            <div>
              <label className="section-label mb-1.5 block">Customer *</label>
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                className="glass-input w-full text-sm"
              >
                <option value="">Select customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                className="glass-input w-full text-sm"
              />
            </div>
            <div>
              <label className="section-label mb-1.5 block">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="glass-input w-full text-sm resize-none"
                placeholder="Add notes..."
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-foreground font-medium">
                {customerId
                  ? getCustomer(customerId)?.name || '—'
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lines</span>
              <span className="text-foreground">{lines.length}</span>
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
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Products to Deliver</h3>

        <div className="space-y-3">
          {lines.map((line, i) => {
            const selectedProduct = getProduct(line.productId);
            return (
              <div
                key={line.id}
                className="grid gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  gridTemplateColumns: '24px 1fr 1fr 100px 40px',
                }}
              >
                <span className="text-xs text-muted-foreground self-center">{i + 1}</span>

                <div>
                  <select
                    value={line.productId}
                    onChange={e => updateLine(line.id, 'productId', e.target.value)}
                    className="glass-input w-full text-sm"
                  >
                    <option value="">Select product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Available: {p.stock})
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <p className="text-xs mt-1" style={{ color: '#00D4AA' }}>
                      SKU: {selectedProduct.sku} · Unit: {selectedProduct.unit}
                    </p>
                  )}
                </div>

                <select
                  value={line.locationId}
                  onChange={e => updateLine(line.id, 'locationId', e.target.value)}
                  className="glass-input w-full text-sm"
                >
                  <option value="">Select location</option>
                  {allLocations.map(loc => (
                    <option key={loc._id} value={loc._id}>
                      {loc.displayName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  max={selectedProduct?.stock || 9999}
                  value={line.qty}
                  onChange={e => updateLine(line.id, 'qty', parseInt(e.target.value) || 1)}
                  className="glass-input text-sm text-center"
                />

                <button
                  onClick={() => lines.length > 1 && removeLine(line.id)}
                  disabled={lines.length === 1}
                  className="p-1.5 rounded-lg transition-colors hover:bg-destructive/10 self-center"
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
          <Plus className="w-4 h-4" /> Add Product Line
        </button>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate('/deliveries')}
          className="btn-ghost-dark text-sm px-6"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary-gradient text-sm px-6"
        >
          Create Delivery
        </button>
      </div>
    </PageWrapper>
  );
}
