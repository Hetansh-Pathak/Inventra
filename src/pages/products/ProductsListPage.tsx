import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { apiFetch } from '@/lib/api';
import { Search, Plus, Download, Eye, Pencil, Trash2 } from 'lucide-react';

export default function ProductsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialFilter = searchParams.get('filter') === 'low-stock' ? 'low-stock' : 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Sync URL query with local state only once initially or when URL changes
  useEffect(() => {
    if (searchParams.get('filter') === 'low-stock') {
      setStatusFilter('low-stock');
    }
  }, [searchParams]);

  const categories = useAppStore(state => state.categories);
  const allProducts = useAppStore(state => state.products);
  const isLoading = false;
  
  const lowStockCount = allProducts.filter(
    (p: any) => p.stock > 0 && p.stock <= p.reorderLevel).length;
  const outOfStockCount = allProducts.filter(
    (p: any) => p.stock === 0).length;

  const filtered = allProducts.filter((p: any) => {
    const pCategory = typeof p.category === 'object' ? p.category.name : (p.category || '');
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || pCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter || p.category?._id === categoryFilter;
    let matchStatus = true;
    if (statusFilter === 'active') matchStatus = p.isActive !== false;
    if (statusFilter === 'inactive') matchStatus = p.isActive === false;
    if (statusFilter === 'low-stock') matchStatus = (p.stock || 0) > 0 && (p.stock || 0) <= (p.reorderLevel || 0);
    if (statusFilter === 'out-of-stock') matchStatus = p.stock === 0;
    return matchSearch && matchCat && matchStatus;
  });

  const sorted = [...filtered].sort((a: any, b: any) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock-low') return (a.stock || 0) - (b.stock || 0);
    if (sortBy === 'stock-high') return (b.stock || 0) - (a.stock || 0);
    if (sortBy === 'value')
      return ((b.stock || 0) * (b.costPrice || 0)) - ((a.stock || 0) * (a.costPrice || 0));
    if (sortBy === 'recent')
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / perPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getStockBadge = (p: any) => {
    if (p.stock === 0) return <span className="status-canceled px-2 py-0.5 rounded-full text-xs">Out of Stock</span>;
    if (p.stock <= p.reorderLevel) return <span className="status-ready px-2 py-0.5 rounded-full text-xs">Low: {p.stock}</span>;
    return <span className="text-primary font-medium">{p.stock}</span>;
  };

  const getCategoryColor = (catId: string) => {
    // some APIs might populate category as an object, others as an ID string
    const catName = typeof catId === 'object' ? (catId as any).name : catId;
    const found = categories.find((c: any) => c.name === catName || c._id === catId);
    return found?.color || '#475569';
  };

  const getCategoryName = (catId: string) => {
    if (typeof catId === 'object') return (catId as any).name;
    const found = categories.find((c: any) => c._id === catId || c.name === catId);
    return found?.name || catId;
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            {!isLoading && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
                {filtered.length}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost-dark flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => navigate('/products/new')} className="btn-primary-gradient flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or SKU..." className="glass-input w-full pl-10 text-sm" />
          </div>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="glass-input text-sm w-40">
            <option value="name">Sort: Name A-Z</option>
            <option value="stock-low">Sort: Stock Low→High</option>
            <option value="stock-high">Sort: Stock High→Low</option>
            <option value="value">Sort: Value High→Low</option>
            <option value="recent">Sort: Recently Added</option>
          </select>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input text-sm pr-8">
            <option value="all">All Categories</option>
            {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <div className="flex flex-wrap rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {['all', 'active', 'inactive'].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setSearchParams({}); setCurrentPage(1); }}
                className="px-3 py-2 text-xs font-medium capitalize transition-colors"
                style={{
                  background: statusFilter === s ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.03)',
                  color: statusFilter === s ? '#00D4AA' : '#94A3B8',
                }}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStatusFilter('low-stock'); setSearchParams({ filter: 'low-stock' }); setCurrentPage(1); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: statusFilter === 'low-stock'
                  ? 'rgba(255,176,32,0.15)' : 'rgba(255,255,255,0.05)',
                border: statusFilter === 'low-stock'
                  ? '1px solid rgba(255,176,32,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: statusFilter === 'low-stock' ? '#FFB020' : '#94A3B8',
              }}>
              ⚠ Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => { setStatusFilter('out-of-stock'); setSearchParams({ filter: 'out-of-stock' }); setCurrentPage(1); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: statusFilter === 'out-of-stock'
                  ? 'rgba(255,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                border: statusFilter === 'out-of-stock'
                  ? '1px solid rgba(255,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: statusFilter === 'out-of-stock' ? '#FF4444' : '#94A3B8',
              }}>
              ✕ Out of Stock ({outOfStockCount})
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,212,170,0.3)', borderTopColor: '#00D4AA' }} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Category</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">UoM</th>
                    <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Stock</th>
                    <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Cost</th>
                    <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Reorder</th>
                    <th className="text-center p-4 text-xs uppercase text-muted-foreground font-medium">Status</th>
                    <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p: any, i: number) => (
                    <motion.tr key={p._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="transition-colors hover:bg-primary/[0.03] cursor-pointer"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onClick={() => navigate(`/products/${p._id}`)}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                            style={{ background: `linear-gradient(135deg, ${getCategoryColor(p.category)}20, ${getCategoryColor(p.category)}40)`, color: getCategoryColor(p.category) }}>
                            {p.name[0]}
                          </div>
                          <div>
                            <div className="text-foreground font-medium">{p.name}</div>
                            <div className="text-xs font-mono text-primary">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ background: `${getCategoryColor(p.category)}20`, color: getCategoryColor(p.category) }}>
                          {getCategoryName(p.category)}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.unit}</td>
                      <td className="p-4 text-right">{getStockBadge(p)}</td>
                      <td className="p-4 text-right text-foreground">₹{(p.costPrice || 0).toLocaleString()}</td>
                      <td className="p-4 text-right text-muted-foreground">{p.reorderLevel}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'status-done' : 'status-draft'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/products/${p._id}`); }} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/products/${p._id}/edit`); }} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">No products found matching filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs text-muted-foreground">Showing page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        background: currentPage === i + 1 ? 'rgba(0,212,170,0.15)' : 'transparent',
                        color: currentPage === i + 1 ? '#00D4AA' : '#94A3B8',
                      }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </GlassCard>
    </PageWrapper>
  );
}
