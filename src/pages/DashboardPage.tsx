import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import KPICard from '@/components/common/KPICard';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store/useAppStore';
import { apiFetch } from '@/lib/api';
import { Package, AlertTriangle, XCircle, ArrowDownCircle, Truck, IndianRupee, ArrowDown, ArrowLeftRight, SlidersHorizontal, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs" style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const {
    currentUser, products, receipts, deliveries,
    transfers, adjustments, moveHistory, chartData, warehouses
  } = useAppStore();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const [dismissBanner, setDismissBanner] = useState(false);

  const kpis = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    pendingReceipts: receipts.filter(r => r.status === 'draft' || r.status === 'confirmed').length,
    pendingDeliveries: deliveries.filter(d => d.status !== 'done' && d.status !== 'canceled').length,
    totalValue: products.reduce((sum, p) => sum + p.stock * p.costPrice, 0),
  };

  const alerts = {
    lowStock: products.filter(p => p.stock <= p.reorderLevel),
    pendingReceipts: receipts.filter(r => ['draft', 'confirmed'].includes(r.status)),
    pendingDeliveries: deliveries.filter(d => ['draft', 'ready', 'picked', 'packed'].includes(d.status)),
  };

  const charts = {
    stockMovement: chartData.stockMovement || [],
    stockByCategory: chartData.stockByCategory || [],
    inventoryValue: chartData.inventoryValue || [],
    recentActivity: moveHistory.slice(0, 10),
  };

  const isLoading = false;

  const typeIcon: Record<string, any> = {
    receipt: { icon: ArrowDown, color: '#00BCD4', bg: 'rgba(0,188,212,0.15)' },
    delivery: { icon: Truck, color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
    transfer: { icon: ArrowLeftRight, color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
    adjustment: { icon: SlidersHorizontal, color: '#FFB020', bg: 'rgba(255,176,32,0.15)' },
  };

  const hasLowStock = alerts?.lowStock?.length > 0;

  if (isLoading) {
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
      {/* Alerts Banner */}
      <AnimatePresence>
        {hasLowStock && !dismissBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-6 overflow-hidden rounded-lg relative"
            style={{ background: 'rgba(255, 176, 32, 0.1)', border: '1px solid rgba(255, 176, 32, 0.3)' }}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <p className="text-sm font-medium text-warning">
                  ⚠ {alerts.lowStock.length} products are below reorder level —{' '}
                  <button onClick={() => navigate('/products?filter=low_stock')} className="underline hover:text-white transition-colors">
                    View Low Stock Items
                  </button>
                </p>
              </div>
              <button onClick={() => setDismissBanner(true)} className="p-1 rounded-full hover:bg-white/5 transition-colors">
                <X className="w-4 h-4 text-warning" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {currentUser?.name} 👋</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard label="Total Products" value={kpis?.totalProducts || 0} icon={Package} iconColor="#6366F1" iconBg="rgba(99,102,241,0.15)" trend={kpis?.productsTrend} trendUp={kpis?.productsTrendUp} />
        <KPICard label="Low Stock" value={kpis?.lowStock || 0} icon={AlertTriangle} iconColor="#FFB020" iconBg="rgba(255,176,32,0.15)" trend={kpis?.lowStockTrend} trendUp={kpis?.lowStockTrendUp} glowColor="#FFB020" />
        <KPICard label="Out of Stock" value={kpis?.outOfStock || 0} icon={XCircle} iconColor="#FF4444" iconBg="rgba(255,68,68,0.15)" trend={kpis?.outOfStockTrend} trendUp={kpis?.outOfStockTrendUp} glowColor="#FF4444" />
        <KPICard label="Pending Receipts" value={kpis?.pendingReceipts || 0} icon={ArrowDownCircle} iconColor="#00BCD4" iconBg="rgba(0,188,212,0.15)" trend={kpis?.receiptsTrend} trendUp={kpis?.receiptsTrendUp} />
        <KPICard label="Pending Deliveries" value={kpis?.pendingDeliveries || 0} icon={Truck} iconColor="#8B5CF6" iconBg="rgba(139,92,246,0.15)" trend={kpis?.deliveriesTrend} trendUp={kpis?.deliveriesTrendUp} />
        <KPICard label="Total Inventory Value" value={kpis?.totalValue || 0} prefix="₹" icon={IndianRupee} iconColor="#00D4AA" iconBg="rgba(0,212,170,0.15)" trend={kpis?.valueTrend} trendUp={kpis?.valueTrendUp} glowColor="#00D4AA" />
      </div>

      {/* Dynamic Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          {['All', 'Receipts', 'Deliveries', 'Transfers', 'Adjustments'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: typeFilter === t ? 'rgba(0,212,170,0.15)' : 'transparent',
                color: typeFilter === t ? '#00D4AA' : '#94A3B8',
                border: `1px solid ${typeFilter === t ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.1)'}`
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="h-6 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input text-xs h-8 pl-3 pr-8 min-w-[120px] appearance-none"
        >
          <option value="All" className="bg-[#0A0E1A]">All Statuses</option>
          <option value="Draft" className="bg-[#0A0E1A]">Draft</option>
          <option value="Confirmed" className="bg-[#0A0E1A]">Confirmed</option>
          <option value="Done" className="bg-[#0A0E1A]">Done</option>
          <option value="Canceled" className="bg-[#0A0E1A]">Canceled</option>
        </select>
        <select
          value={warehouseFilter}
          onChange={(e) => setWarehouseFilter(e.target.value)}
          className="glass-input text-xs h-8 pl-3 pr-8 min-w-[120px] appearance-none"
        >
          <option value="All" className="bg-[#0A0E1A]">All Warehouses</option>
          {warehouses?.map((w: any) => (
            <option key={w._id} value={w._id} className="bg-[#0A0E1A]">{w.name}</option>
          ))}
        </select>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <GlassCard className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Stock Movement — Last 7 Days</h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>Last 7 days</span>
          </div>
          {charts?.stockMovement?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.stockMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="incoming" name="Incoming" fill="#00D4AA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" name="Outgoing" fill="#00BCD4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Stock by Category</h3>
          {charts?.stockByCategory?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={charts.stockByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {charts.stockByCategory.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color || '#00D4AA'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-2xl font-bold text-foreground -mt-2 mb-3">
                {charts.stockByCategory.reduce((s: number, c: any) => s + (c.value||0), 0).toLocaleString()}
              </div>
              <div className="space-y-1.5">
                {charts.stockByCategory.map((c: any) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color || '#00D4AA' }} />
                      <span className="text-muted-foreground">{c.name}</span>
                    </div>
                    <span className="text-foreground font-medium">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </GlassCard>
      </div>

      {/* Line Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <GlassCard className="lg:col-span-3 p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Inventory Value Trend</h3>
          {charts?.inventoryValue?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={charts.inventoryValue}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#00D4AA" fill="url(#tealGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-0 relative">
            <div className="absolute left-[17px] top-2 bottom-2 w-0.5" style={{ background: 'rgba(0,212,170,0.2)' }} />
            {charts?.recentActivity?.length > 0 ? charts.recentActivity.slice(0, 5).map((m: any, i: number) => {
              const t = typeIcon[m.type] || typeIcon['receipt'];
              const IconComp = t.icon;
              return (
                <motion.div key={m._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 py-2.5 relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center z-10 flex-shrink-0" style={{ background: t.bg }}>
                    <IconComp className="w-4 h-4" style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {m.productName} <span className="text-muted-foreground">— {m.change > 0 ? '+' : ''}{m.change} units</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-primary">{m.reference}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="py-8 text-center text-sm text-muted-foreground">No recent activity found</div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Low Stock + Pending Ops */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> Low Stock Alerts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Product</th>
                  <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Current</th>
                  <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Min</th>
                  <th className="text-right p-3 text-xs uppercase text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts?.lowStock?.slice(0, 5).map((p: any) => (
                  <tr key={p._id} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3">
                      <div className="text-foreground font-medium">{p.name}</div>
                      <div className="text-xs text-primary font-mono">{p.sku}</div>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`text-sm font-semibold ${p.stock === 0 ? 'text-destructive' : 'text-warning'}`}>{p.stock}</span>
                    </td>
                    <td className="p-3 text-right text-muted-foreground">{p.reorderLevel}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => navigate(`/receipts/new?product=${p._id}`)} className="text-xs px-3 py-1 rounded-lg border transition-colors hover:bg-[rgba(0,212,170,0.1)]" style={{ borderColor: 'rgba(0,212,170,0.3)', color: '#00D4AA' }}>Order</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!alerts?.lowStock || alerts.lowStock.length === 0) && (
              <div className="p-4 text-center text-sm text-muted-foreground border-b border-[rgba(255,255,255,0.04)]">No low stock items! 🎉</div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            ⏳ Pending Operations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Type</th>
                  <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Reference</th>
                  <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts?.pendingReceipts?.slice(0, 3).map((r: any) => (
                  <tr key={r._id} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3"><span className="status-waiting text-xs px-2 py-0.5 rounded-full">Receipt</span></td>
                    <td className="p-3 font-mono text-primary text-xs">{r.receiptNo}</td>
                    <td className="p-3 text-muted-foreground text-xs">{r.expectedDate || new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {alerts?.pendingDeliveries?.slice(0, 2).map((d: any) => (
                  <tr key={d._id} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3"><span className="status-validated text-xs px-2 py-0.5 rounded-full">Delivery</span></td>
                    <td className="p-3 font-mono text-primary text-xs">{d.deliveryNo}</td>
                    <td className="p-3 text-muted-foreground text-xs">{d.deliveryDate || new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="p-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!alerts?.pendingReceipts?.length && !alerts?.pendingDeliveries?.length) && (
              <div className="p-4 text-center text-sm text-muted-foreground border-b border-[rgba(255,255,255,0.04)]">No pending operations</div>
            )}
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
