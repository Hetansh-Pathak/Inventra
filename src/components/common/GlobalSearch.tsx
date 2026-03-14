import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, ArrowDownCircle, Truck, ArrowLeftRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { products, receipts, deliveries, transfers } from '@/mock/data';

export default function GlobalSearch() {
  const { globalSearchOpen, setGlobalSearchOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setGlobalSearchOpen(true);
    }
    if (e.key === 'Escape') setGlobalSearchOpen(false);
  }, [setGlobalSearchOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const q = query.toLowerCase();
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  const filteredReceipts = receipts.filter(r => r.receiptNo.toLowerCase().includes(q) || r.supplierName.toLowerCase().includes(q));
  const filteredDeliveries = deliveries.filter(d => d.deliveryNo.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q));
  const filteredTransfers = transfers.filter(t => t.transferNo.toLowerCase().includes(q));

  const handleSelect = (path: string) => {
    setGlobalSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <AnimatePresence>
      {globalSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setGlobalSearchOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[640px] glass-card overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, receipts, orders..."
                className="flex-1 bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => setGlobalSearchOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {query && (
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredProducts.length > 0 && (
                  <div className="mb-3">
                    <div className="section-label px-3 py-1">Products ({filteredProducts.length})</div>
                    {filteredProducts.slice(0, 3).map(p => (
                      <button key={p._id} onClick={() => handleSelect(`/products/${p._id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors text-left">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">{p.name}</span>
                        <span className="text-xs font-mono text-primary">{p.sku}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{p.stock} {p.unit}</span>
                      </button>
                    ))}
                  </div>
                )}
                {filteredReceipts.length > 0 && (
                  <div className="mb-3">
                    <div className="section-label px-3 py-1">Receipts ({filteredReceipts.length})</div>
                    {filteredReceipts.slice(0, 3).map(r => (
                      <button key={r._id} onClick={() => handleSelect(`/receipts/${r._id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors text-left">
                        <ArrowDownCircle className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-mono text-primary">{r.receiptNo}</span>
                        <span className="text-xs text-muted-foreground">{r.supplierName}</span>
                      </button>
                    ))}
                  </div>
                )}
                {filteredDeliveries.length > 0 && (
                  <div className="mb-3">
                    <div className="section-label px-3 py-1">Deliveries ({filteredDeliveries.length})</div>
                    {filteredDeliveries.slice(0, 3).map(d => (
                      <button key={d._id} onClick={() => handleSelect(`/deliveries/${d._id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors text-left">
                        <Truck className="w-4 h-4 text-purple" />
                        <span className="text-sm font-mono text-primary">{d.deliveryNo}</span>
                        <span className="text-xs text-muted-foreground">{d.customerName}</span>
                      </button>
                    ))}
                  </div>
                )}
                {filteredTransfers.length > 0 && (
                  <div className="mb-3">
                    <div className="section-label px-3 py-1">Transfers ({filteredTransfers.length})</div>
                    {filteredTransfers.slice(0, 3).map(t => (
                      <button key={t._id} onClick={() => handleSelect(`/transfers/${t._id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors text-left">
                        <ArrowLeftRight className="w-4 h-4 text-info" />
                        <span className="text-sm font-mono text-primary">{t.transferNo}</span>
                      </button>
                    ))}
                  </div>
                )}
                {filteredProducts.length === 0 && filteredReceipts.length === 0 && filteredDeliveries.length === 0 && filteredTransfers.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-10 h-10 text-primary mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No results for "{query}"</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
