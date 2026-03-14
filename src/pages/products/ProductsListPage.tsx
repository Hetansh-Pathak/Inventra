import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { products, categories } from '@/mock/data';
import { Search, Plus, Download, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';

export default function ProductsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && p.isActive) || (statusFilter === 'inactive' && !p.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getStockBadge = (p: typeof products[0]) => {
    if (p.stock === 0) return <span className="status-canceled px-2 py-0.5 rounded-full text-xs">Out of Stock</span>;
    if (p.stock <= p.reorderLevel) return <span className="status-ready px-2 py-0.5 rounded-full text-xs">Low: {p.stock}</span>;
    return <span className="text-primary font-medium">{p.stock}</span>;
  };

  const getCategoryColor = (cat: string) => categories.find(c => c.name === cat)?.color || '#475569';

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>{products.length}</span>
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
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or SKU..." className="glass-input w-full pl-10 text-sm" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-input text-sm pr-8">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {['all', 'active', 'inactive'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-2 text-xs font-medium capitalize transition-colors"
                style={{
                  background: statusFilter === s ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.03)',
                  color: statusFilter === s ? '#00D4AA' : '#94A3B8',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden">
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
              {paginated.map((p, i) => (
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
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${getCategoryColor(p.category)}20`, color: getCategoryColor(p.category) }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.unit}</td>
                  <td className="p-4 text-right">{getStockBadge(p)}</td>
                  <td className="p-4 text-right text-foreground">₹{p.costPrice.toLocaleString()}</td>
                  <td className="p-4 text-right text-muted-foreground">{p.reorderLevel}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'status-done' : 'status-draft'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/products/${p._id}`)} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => navigate(`/products/${p._id}/edit`)} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs text-muted-foreground">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} products</span>
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
      </GlassCard>
    </PageWrapper>
  );
}
