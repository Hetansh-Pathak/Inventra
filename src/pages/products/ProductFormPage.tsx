import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { categories, warehouses } from '@/mock/data';
import { ChevronLeft, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', sku: '', category: '', unit: 'pcs', description: '',
    costPrice: '', sellingPrice: '', reorderLevel: '', initialStock: '',
    warehouse: '', location: '', isActive: true,
  });

  const generateSKU = () => {
    const prefix = form.name ? form.name.substring(0, 3).toUpperCase() : 'PRD';
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    setForm({ ...form, sku: `${prefix}-${num}` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Product created successfully');
    navigate('/products');
  };

  const selectedWarehouse = warehouses.find(w => w.name === form.warehouse);

  return (
    <PageWrapper>
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">New Product</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block">Product Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input w-full text-sm" placeholder="Enter product name" />
                </div>
                <div>
                  <label className="section-label mb-1.5 block">SKU *</label>
                  <div className="flex gap-2">
                    <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="glass-input flex-1 text-sm font-mono" placeholder="SKU-001" />
                    <button type="button" onClick={generateSKU} className="btn-ghost-dark flex items-center gap-2 text-xs whitespace-nowrap">
                      <Sparkles className="w-3 h-3" /> Auto Generate
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-1.5 block">Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="glass-input w-full text-sm">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label mb-1.5 block">Unit of Measure *</label>
                    <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="glass-input w-full text-sm">
                      {['kg', 'g', 'pcs', 'liters', 'meters', 'boxes', 'sets', 'pairs'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="glass-input w-full text-sm resize-none" rows={3} placeholder="Product description..." />
                  <div className="text-right text-xs text-muted-foreground mt-1">{form.description.length}/500</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Pricing & Thresholds</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="section-label mb-1.5 block">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                    <input value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className="glass-input w-full text-sm pl-7" type="number" />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                    <input value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="glass-input w-full text-sm pl-7" type="number" />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Reorder Level</label>
                  <input value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} className="glass-input w-full text-sm" type="number" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Product Image</h3>
              <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
                style={{ borderColor: 'rgba(0,212,170,0.3)', background: 'rgba(0,212,170,0.03)' }}>
                <Upload className="w-10 h-10 text-primary mx-auto mb-3 opacity-60" />
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Stock & Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block">Initial Stock Qty</label>
                  <input value={form.initialStock} onChange={(e) => setForm({ ...form, initialStock: e.target.value })} className="glass-input w-full text-sm" type="number" />
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Warehouse</label>
                  <select value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value, location: '' })} className="glass-input w-full text-sm">
                    <option value="">Select warehouse</option>
                    {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                {selectedWarehouse && (
                  <div>
                    <label className="section-label mb-1.5 block">Location</label>
                    <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="glass-input w-full text-sm">
                      <option value="">Select location</option>
                      {selectedWarehouse.locations.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Status</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="sr-only" />
                  <div className="w-11 h-6 rounded-full transition-colors" style={{ background: form.isActive ? '#00D4AA' : 'rgba(255,255,255,0.1)' }}>
                    <div className="w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-transform" style={{ transform: `translateX(${form.isActive ? '22px' : '2px'})` }} />
                  </div>
                </div>
                <span className="text-sm text-foreground">Product is Active</span>
              </label>
            </GlassCard>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button type="button" onClick={() => navigate('/products')} className="btn-ghost-dark text-sm">Cancel</button>
          <button type="button" className="btn-ghost-dark text-sm" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>Save as Draft</button>
          <button type="submit" className="btn-primary-gradient text-sm">Save Product</button>
        </div>
      </form>
    </PageWrapper>
  );
}
