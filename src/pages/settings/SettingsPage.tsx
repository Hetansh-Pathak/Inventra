import { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { warehouses, categories, auditLogs } from '@/mock/data';
import { Settings as SettingsIcon, Warehouse, MapPin, Tag, Ruler, Users, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { label: 'General', icon: SettingsIcon },
  { label: 'Warehouses', icon: Warehouse },
  { label: 'Categories', icon: Tag },
  { label: 'Audit Log', icon: FileText },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Tab nav */}
        <GlassCard className="w-52 p-2 flex-shrink-0 h-fit">
          {tabs.map(t => (
            <button key={t.label} onClick={() => setActiveTab(t.label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5"
              style={{
                background: activeTab === t.label ? 'rgba(0,212,170,0.12)' : 'transparent',
                color: activeTab === t.label ? '#00D4AA' : '#94A3B8',
                borderLeft: activeTab === t.label ? '3px solid #00D4AA' : '3px solid transparent',
              }}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </GlassCard>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'General' && (
            <GlassCard className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Company Settings</h3>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="section-label mb-1.5 block">Company Name</label>
                  <input defaultValue="CoreInventory Corp" className="glass-input w-full text-sm" />
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Default Currency</label>
                  <select defaultValue="INR" className="glass-input w-full text-sm">
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
                <div>
                  <label className="section-label mb-1.5 block">SKU Prefix</label>
                  <input defaultValue="PROD-" className="glass-input w-full text-sm" />
                </div>
                <h3 className="text-base font-semibold text-foreground mt-6 mb-4">Notifications</h3>
                {['Low stock alerts', 'Email on validation', 'Daily summary'].map(n => (
                  <label key={n} className="flex items-center gap-3 cursor-pointer">
                    <div className="w-11 h-6 rounded-full relative" style={{ background: 'rgba(0,212,170,0.6)' }}>
                      <div className="w-5 h-5 rounded-full bg-foreground absolute top-0.5" style={{ transform: 'translateX(22px)' }} />
                    </div>
                    <span className="text-sm text-foreground">{n}</span>
                  </label>
                ))}
                <button onClick={() => toast.success('Settings saved')} className="btn-primary-gradient text-sm mt-4">Save Changes</button>
              </div>
            </GlassCard>
          )}

          {activeTab === 'Warehouses' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouses.map(w => (
                  <GlassCard key={w._id} className="p-5" hover>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{w.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{w.address}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
                            {w.locations.length} locations
                          </span>
                          {w.isDefault && <span className="text-xs px-2 py-0.5 rounded-full status-done">Default</span>}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              <button className="btn-primary-gradient text-sm mt-4">+ Add Warehouse</button>
            </div>
          )}

          {activeTab === 'Categories' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(c => (
                  <GlassCard key={c._id} className="p-4" hover>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ background: c.color }} />
                      <div>
                        <div className="text-sm font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.productCount} products</div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              <button className="btn-primary-gradient text-sm mt-4">+ Add Category</button>
            </div>
          )}

          {activeTab === 'Audit Log' && (
            <GlassCard className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Time</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">User</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Action</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Module</th>
                    <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(l => (
                    <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(l.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-foreground">{l.user}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          l.action === 'created' ? 'status-done' : l.action === 'updated' ? 'status-waiting' :
                          l.action === 'deleted' ? 'status-canceled' : 'status-validated'
                        }`}>{l.action}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">{l.module}</td>
                      <td className="p-4 text-xs text-muted-foreground">{l.changes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
