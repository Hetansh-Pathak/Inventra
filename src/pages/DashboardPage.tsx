import PageWrapper from '@/components/layout/PageWrapper';
import KPICard from '@/components/common/KPICard';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store/useAppStore';
import { products, receipts, deliveries, chartData, moveHistory, notifications } from '@/mock/data';
import { Package, AlertTriangle, XCircle, ArrowDownCircle, Truck, IndianRupee, ArrowDown, ArrowLeftRight, SlidersHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

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
  const { currentUser } = useAppStore();
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const pendingReceipts = receipts.filter(r => r.status === 'draft' || r.status === 'confirmed');
  const pendingDeliveries = deliveries.filter(d => d.status !== 'done' && d.status !== 'canceled');
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const totalStock = chartData.stockByCategory.reduce((s, c) => s + c.value, 0);

  const typeIcon: Record<string, any> = {
    receipt: { icon: ArrowDown, color: '#00BCD4', bg: 'rgba(0,188,212,0.15)' },
    delivery: { icon: Truck, color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
    transfer: { icon: ArrowLeftRight, color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
    adjustment: { icon: SlidersHorizontal, color: '#FFB020', bg: 'rgba(255,176,32,0.15)' },
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {currentUser.name} 👋</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard label="Total Products" value={products.length} icon={Package} iconColor="#6366F1" iconBg="rgba(99,102,241,0.15)" trend="+8 this month" trendUp />
        <KPICard label="Low Stock" value={lowStockProducts.length} icon={AlertTriangle} iconColor="#FFB020" iconBg="rgba(255,176,32,0.15)" trend="3 items added" trendUp glowColor="#FFB020" />
        <KPICard label="Out of Stock" value={outOfStockProducts.length} icon={XCircle} iconColor="#FF4444" iconBg="rgba(255,68,68,0.15)" trend="1 since yesterday" trendUp={false} glowColor="#FF4444" />
        <KPICard label="Pending Receipts" value={pendingReceipts.length} icon={ArrowDownCircle} iconColor="#00BCD4" iconBg="rgba(0,188,212,0.15)" trend="2 arriving today" trendUp />
        <KPICard label="Pending Deliveries" value={pendingDeliveries.length} icon={Truck} iconColor="#8B5CF6" iconBg="rgba(139,92,246,0.15)" trend="5 due today" trendUp />
        <KPICard label="Total Inventory Value" value={totalValue} prefix="₹" icon={IndianRupee} iconColor="#00D4AA" iconBg="rgba(0,212,170,0.15)" trend="4.2% vs last month" trendUp glowColor="#00D4AA" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <GlassCard className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Stock Movement — Last 7 Days</h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData.stockMovement}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="incoming" name="Incoming" fill="#00D4AA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" name="Outgoing" fill="#00BCD4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Stock by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData.stockByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {chartData.stockByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-2xl font-bold text-foreground -mt-2 mb-3">{totalStock.toLocaleString()}</div>
          <div className="space-y-1.5">
            {chartData.stockByCategory.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="text-foreground font-medium">{c.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Line Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <GlassCard className="lg:col-span-3 p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Inventory Value Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData.inventoryValue}>
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
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-0 relative">
            <div className="absolute left-[17px] top-2 bottom-2 w-0.5" style={{ background: 'rgba(0,212,170,0.2)' }} />
            {moveHistory.slice(0, 5).map((m, i) => {
              const t = typeIcon[m.type];
              const IconComp = t.icon;
              return (
                <motion.div key={m._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
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
            })}
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
                {[...lowStockProducts, ...outOfStockProducts].slice(0, 5).map(p => (
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
                      <button className="text-xs px-3 py-1 rounded-lg border transition-colors" style={{ borderColor: 'rgba(0,212,170,0.3)', color: '#00D4AA' }}>Order</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {pendingReceipts.slice(0, 3).map(r => (
                  <tr key={r._id} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3"><span className="status-waiting text-xs px-2 py-0.5 rounded-full">Receipt</span></td>
                    <td className="p-3 font-mono text-primary text-xs">{r.receiptNo}</td>
                    <td className="p-3 text-muted-foreground text-xs">{r.expectedDate}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {pendingDeliveries.slice(0, 2).map(d => (
                  <tr key={d._id} className="transition-colors hover:bg-primary/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3"><span className="status-validated text-xs px-2 py-0.5 rounded-full">Delivery</span></td>
                    <td className="p-3 font-mono text-primary text-xs">{d.deliveryNo}</td>
                    <td className="p-3 text-muted-foreground text-xs">{d.deliveryDate}</td>
                    <td className="p-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
