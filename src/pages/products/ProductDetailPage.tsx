import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { products, categories, moveHistory, warehouses } from '@/mock/data';
import { ChevronLeft, Pencil, Package, MapPin, TrendingUp, IndianRupee } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p._id === id);

  if (!product) return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
        <p className="text-muted-foreground">Product not found</p>
        <button onClick={() => navigate('/products')} className="btn-primary-gradient mt-4 text-sm">Back to Products</button>
      </div>
    </PageWrapper>
  );

  const catColor = categories.find(c => c.name === product.category)?.color || '#475569';
  const productMoves = moveHistory.filter(m => m.productId === product._id);
  const totalValue = product.stock * product.costPrice;

  return (
    <PageWrapper>
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Hero card */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${catColor}20, ${catColor}40)`, color: catColor }}>
            {product.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-sm px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>SKU: {product.sku}</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${catColor}20`, color: catColor }}>{product.category}</span>
              <span className="text-xs text-muted-foreground">{product.unit}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'status-done' : 'status-draft'}`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {product.description && <p className="text-sm text-muted-foreground mt-3">{product.description}</p>}
          </div>
          <button onClick={() => navigate(`/products/${product._id}/edit`)} className="btn-ghost-dark flex items-center gap-2 text-sm">
            <Pencil className="w-4 h-4" /> Edit
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Stock', value: `${product.stock} ${product.unit}`, icon: Package, color: '#00D4AA' },
          { label: 'Locations', value: '3', icon: MapPin, color: '#00BCD4' },
          { label: 'Avg Movement', value: '45/mo', icon: TrendingUp, color: '#8B5CF6' },
          { label: 'Total Value', value: `₹${totalValue.toLocaleString()}`, icon: IndianRupee, color: '#FFB020' },
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

      {/* Stock Levels */}
      <GlassCard className="p-5 mb-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Stock Levels</h3>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Warehouse</th>
              <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Location</th>
              <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.slice(0, 2).map(w => (
              <tr key={w._id} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-3 text-foreground">{w.name}</td>
                <td className="p-3 text-muted-foreground">{w.locations[0]?.name}</td>
                <td className="p-3 text-right text-foreground font-medium">{Math.floor(product.stock / 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Move History */}
      <GlassCard className="p-5">
        <h3 className="text-base font-semibold text-foreground mb-4">Move History</h3>
        {productMoves.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No movement history for this product</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Date</th>
                <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Type</th>
                <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Reference</th>
                <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {productMoves.map(m => (
                <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="p-3 text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><StatusBadge status={m.type === 'receipt' ? 'confirmed' : m.type === 'delivery' ? 'ready' : 'draft'} /></td>
                  <td className="p-3 font-mono text-primary text-xs">{m.reference}</td>
                  <td className={`p-3 text-right font-semibold ${m.change > 0 ? 'text-primary' : 'text-destructive'}`}>
                    {m.change > 0 ? '+' : ''}{m.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </PageWrapper>
  );
}
