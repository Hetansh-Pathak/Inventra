import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { ChevronLeft, Pencil, Package, MapPin, TrendingUp, IndianRupee } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentProduct = useAppStore(state => state.products.find(p => p._id === id));
  const product = currentProduct;
  const categoriesData = useAppStore(state => state.categories);
  const ledgerData = useAppStore(state => state.moveHistory.filter(m => (m.product?._id || m.product || m.productId) === id));
  
  const isLoading = false;

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
        </div>
      </PageWrapper>
    );
  }

  if (!product) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
          <p className="text-muted-foreground">Product not found</p>
          <button onClick={() => navigate('/products')} className="btn-primary-gradient mt-4 text-sm">Back to Products</button>
        </div>
      </PageWrapper>
    );
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
  const categories = categoriesData || [];
  const catColor = categories.find((c: any) => c.name === categoryName || c._id === categoryName)?.color || '#475569';
  
  // Try mapping product moves from ledger API
  const productMoves = ledgerData?.moves || ledgerData || [];
  const totalValue = (product.stock || 0) * (product.costPrice || 0);

  // If backend provides locations array: [{ warehouseName, locationName, qty }]
  const stockLocations = product.locations || [
    { warehouseName: 'Primary Warehouse', locationName: 'Default', qty: product.stock || 0 }
  ];

  return (
    <PageWrapper>
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Hero card */}
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${catColor}20, ${catColor}40)`, color: catColor }}>
            {product.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="font-mono text-sm px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>SKU: {product.sku}</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${catColor}20`, color: catColor }}>{categoryName}</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}>{product.unit}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'status-done' : 'status-draft'}`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {product.description && <p className="text-sm text-muted-foreground mt-3 max-w-3xl">{product.description}</p>}
          </div>
          <button onClick={() => navigate(`/products/${product._id}/edit`)} className="btn-ghost-dark flex items-center gap-2 text-sm mt-4 sm:mt-0">
            <Pencil className="w-4 h-4" /> Edit Product
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Stock', value: `${product.stock || 0} ${product.unit}`, icon: Package, color: '#00D4AA' },
          { label: 'Locations', value: stockLocations.length.toString(), icon: MapPin, color: '#00BCD4' },
          { label: 'Reorder Level', value: product.reorderLevel?.toString() || '0', icon: TrendingUp, color: '#FFB020' },
          { label: 'Total Value', value: `₹${totalValue.toLocaleString()}`, icon: IndianRupee, color: '#8B5CF6' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-lg font-bold text-foreground">{s.value}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock by Location */}
        <div className="lg:col-span-1">
          <GlassCard className="p-5 h-full">
            <h3 className="text-base font-semibold text-foreground mb-4">Stock by Location</h3>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium rounded-l-lg">Warehouse/Loc</th>
                  <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium rounded-r-lg">Qty</th>
                </tr>
              </thead>
              <tbody>
                {stockLocations.map((loc: any, i: number) => (
                  <tr key={i} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3">
                      <div className="text-foreground text-sm">{loc.warehouseName || loc.warehouse}</div>
                      {(loc.locationName || loc.location) && (
                        <div className="text-xs text-muted-foreground mt-0.5">{loc.locationName || loc.location}</div>
                      )}
                    </td>
                    <td className="p-3 text-right text-foreground font-medium">{loc.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Move History */}
        <div className="lg:col-span-2">
          <GlassCard className="p-5 h-full">
            <h3 className="text-base font-semibold text-foreground mb-4">Move History</h3>
            {productMoves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">No movement history for this product yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium rounded-l-lg">Date</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Type</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Reference</th>
                      <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium rounded-r-lg">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productMoves.map((m: any) => (
                      <tr key={m._id} className="transition-colors hover:bg-primary/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
                        <td className="p-3"><StatusBadge status={m.type === 'receipt' ? 'confirmed' : m.type === 'delivery' ? 'ready' : m.type === 'adjustment' ? 'validated' : 'draft'} /></td>
                        <td className="p-3 font-mono text-primary text-xs">{m.reference || m._id.substring(0,8)}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded font-semibold text-xs ${m.change > 0 ? 'text-[#00D4AA] bg-[#00D4AA]/10' : 'text-[#FF4444] bg-[#FF4444]/10'}`}>
                            {m.change > 0 ? '+' : ''}{m.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
