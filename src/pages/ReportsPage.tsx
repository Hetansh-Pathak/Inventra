import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { BarChart2, Activity, AlertTriangle, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { chartData, products } from '@/mock/data';

const reports = [
  { title: 'Stock Summary Report', desc: 'Overview of current stock levels across all warehouses', icon: BarChart2, gradient: 'linear-gradient(135deg, #00BCD4, #0097A7)' },
  { title: 'Movement Report', desc: 'Track stock movements over a period', icon: Activity, gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
  { title: 'Low Stock Report', desc: 'Products below reorder level', icon: AlertTriangle, gradient: 'linear-gradient(135deg, #FFB020, #F59E0B)' },
  { title: 'Inventory Valuation', desc: 'Total value of inventory by category', icon: IndianRupee, gradient: 'linear-gradient(135deg, #00D4AA, #00A884)' },
];

export default function ReportsPage() {
  const lowStockCount = products.filter(p => p.stock <= p.reorderLevel).length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0);

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-foreground mb-2">Reports</h1>
      <p className="text-sm text-muted-foreground mb-6">Generate and export inventory reports</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, i) => (
          <GlassCard key={i} className="p-0 overflow-hidden" hover>
            <div className="p-4 flex items-center gap-3" style={{ background: r.gradient }}>
              <r.icon className="w-8 h-8 text-primary-foreground" />
              <div>
                <h3 className="text-base font-semibold text-primary-foreground">{r.title}</h3>
                <p className="text-xs text-primary-foreground/80">{r.desc}</p>
              </div>
            </div>
            <div className="p-4">
              {i === 0 && (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={chartData.stockMovement.slice(0, 5)}>
                    <Bar dataKey="incoming" fill="#00D4AA" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="outgoing" fill="#00BCD4" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {i === 1 && (
                <div className="h-[120px] flex items-center justify-center text-sm text-muted-foreground">
                  {chartData.stockMovement.reduce((s, d) => s + d.incoming + d.outgoing, 0)} total movements this week
                </div>
              )}
              {i === 2 && (
                <div className="h-[120px] flex items-center justify-center">
                  <span className="text-3xl font-bold text-warning">{lowStockCount}</span>
                  <span className="text-sm text-muted-foreground ml-2">products below threshold</span>
                </div>
              )}
              {i === 3 && (
                <div className="h-[120px] flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">₹{(totalValue / 100000).toFixed(2)}L</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <button className="btn-primary-gradient text-xs flex-1">Generate Report</button>
                <button className="btn-ghost-dark text-xs">Export</button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </PageWrapper>
  );
}
