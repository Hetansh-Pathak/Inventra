import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { apiFetch } from '@/lib/api';
import { ChevronLeft, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const isEditMode = location.pathname.includes('/edit');

  const [form, setForm] = useState({
    name: '', sku: '', category: '', unit: 'pcs', description: '',
    costPrice: '', sellingPrice: '', reorderLevel: '10', initialStock: '0',
    warehouse: '', location: '', isActive: true,
  });

  const categories = useAppStore(state => state.categories);
  const warehouses = useAppStore(state => state.warehouses);
  const products = useAppStore(state => state.products);
  const addProduct = useAppStore(state => state.addProduct);
  const product = isEditMode && id ? products.find(p => p._id === id) : null;
  const productLoading = false;

  useEffect(() => {
    if (isEditMode && product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: typeof product.category === 'object' ? product.category._id : (product.category || ''),
        unit: product.unit || 'pcs',
        description: product.description || '',
        costPrice: product.costPrice?.toString() || '',
        sellingPrice: product.sellingPrice?.toString() || '',
        reorderLevel: product.reorderLevel?.toString() || '10',
        initialStock: product.stock?.toString() || '0',
        warehouse: '',
        location: '',
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    }
  }, [product, isEditMode]);

  const mutation = {
    mutate: (payload: any) => {
      if (isEditMode && id) {
        toast.success('Product updated successfully');
      } else {
        addProduct({
          ...payload,
          _id: `prod_${Date.now()}`,
          stock: payload.initialStock || 0
        });
        toast.success('Product created successfully');
      }
      navigate('/products');
    },
    isPending: false
  };

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

    const payload: any = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      unit: form.unit,
      description: form.description,
      costPrice: Number(form.costPrice) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      reorderLevel: Number(form.reorderLevel) || 0,
      isActive: form.isActive,
    };

    if (!isEditMode) {
      payload.initialStock = Number(form.initialStock) || 0;
      if (form.warehouse) payload.warehouse = form.warehouse;
      if (form.location) payload.location = form.location;
    }

    mutation.mutate(payload);
  };

  const selectedWarehouse = warehouses?.find((w: any) => w._id === form.warehouse);

  if (isEditMode && productLoading) {
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
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{isEditMode ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block">Product Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input w-full text-sm" placeholder="Enter product name" />
                </div>
                <div>
                  <label className="section-label mb-1.5 block">SKU *</label>
                  <div className="flex gap-2">
                    <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="glass-input flex-1 text-sm font-mono" placeholder="SKU-001" />
                    <button type="button" onClick={generateSKU} className="btn-ghost-dark flex items-center gap-2 text-xs whitespace-nowrap">
                      <Sparkles className="w-3 h-3" /> Auto Generate
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-1.5 block">Category *</label>
                    <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="glass-input w-full text-sm">
                      <option value="">Select category</option>
                      {categories?.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label mb-1.5 block">Unit of Measure *</label>
                    <select required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="glass-input w-full text-sm">
                      {['kg', 'g', 'pcs', 'liters', 'meters', 'boxes', 'sets', 'pairs'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="glass-input w-full text-sm resize-none" rows={3} placeholder="Product description..." />
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
                    <input min="0" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className="glass-input w-full text-sm pl-7" type="number" />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                    <input min="0" step="0.01" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="glass-input w-full text-sm pl-7" type="number" />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Reorder Level *</label>
                  <input required min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} className="glass-input w-full text-sm" type="number" />
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

            {!isEditMode && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Opening Stock & Location</h3>
                <div className="space-y-4">
                  <div>
                    <label className="section-label mb-1.5 block">Initial Stock Qty (Optional)</label>
                    <input min="0" value={form.initialStock} onChange={(e) => setForm({ ...form, initialStock: e.target.value })} className="glass-input w-full text-sm" type="number" />
                  </div>
                  <div>
                    <label className="section-label mb-1.5 block">Warehouse</label>
                    <select value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value, location: '' })} className="glass-input w-full text-sm">
                      <option value="">Select warehouse</option>
                      {warehouses?.map((w: any) => <option key={w._id} value={w._id}>{w.name}</option>)}
                    </select>
                  </div>
                  {selectedWarehouse && selectedWarehouse.locations?.length > 0 && (
                    <div>
                      <label className="section-label mb-1.5 block">Location Bin</label>
                      <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="glass-input w-full text-sm">
                        <option value="">Select location</option>
                        {selectedWarehouse.locations.map((l: any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

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
          <button type="submit" disabled={mutation.isPending} className="btn-primary-gradient text-sm">
            {mutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </PageWrapper>
  );
}
