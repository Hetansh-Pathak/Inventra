import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import { apiFetch } from '@/lib/api';
import { Settings as SettingsIcon, Warehouse, Tag, Plus, Check, X, Edit2, Trash2, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { label: 'General', icon: SettingsIcon },
  { label: 'Users', icon: Users },
  { label: 'Warehouses', icon: Warehouse },
  { label: 'Categories', icon: Tag },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  // --- USERS ---
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'Users') {
      setUsersLoading(true);
      apiFetch('/auth/users')
        .then(res => setUsers(res.data))
        .catch(err => toast.error('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  // --- WAREHOUSES ---
  const warehouses = useAppStore(state => state.warehouses);
  const addWarehouse = useAppStore(state => state.addWarehouse);
  const warehousesLoading = false;

  const [newWhName, setNewWhName] = useState('');
  const [newWhAddress, setNewWhAddress] = useState('');
  const [isAddingWh, setIsAddingWh] = useState(false);

  const addWhMutation = {
    mutate: (payload: any) => {
      addWarehouse({
        _id: `wh_${Date.now()}`,
        name: payload.name,
        address: payload.address || '',
        locations: [],
        isActive: true
      });
      toast.success('Warehouse added');
      setIsAddingWh(false);
      setNewWhName('');
      setNewWhAddress('');
    }
  };

  const [editWhId, setEditWhId] = useState<string | null>(null);
  const [editWhName, setEditWhName] = useState('');
  const [editWhAddress, setEditWhAddress] = useState('');

  const editWhMutation = {
    mutate: ({ id, payload }: { id: string, payload: any }) => {
      toast.success('Warehouse updated');
      setEditWhId(null);
    }
  };

  const deleteWhMutation = {
    mutate: (id: string) => {
      toast.success('Warehouse deleted');
    }
  };

  // --- CATEGORIES ---
  const categories = useAppStore(state => state.categories);
  const categoriesLoading = false;

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  const addCatMutation = {
    mutate: (payload: any) => {
      toast.success('Category added');
      setIsAddingCat(false);
      setNewCatName('');
      setNewCatDesc('');
    }
  };

  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  const editCatMutation = {
    mutate: ({ id, payload }: { id: string, payload: any }) => {
      toast.success('Category updated');
      setEditCatId(null);
    }
  };

  const deleteCatMutation = {
    mutate: (id: string) => {
      toast.success('Category deleted');
    }
  };


  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab nav */}
        <GlassCard className="w-full md:w-52 p-2 flex-shrink-0 h-fit">
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

          {activeTab === 'Users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Registered Users</h3>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center p-12">
                   <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users?.map((u: any) => (
                    <GlassCard key={u._id} className="p-5" hover>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{u.full_name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{u.email}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
                              {u.role}
                            </span>
                            {u.is_active ? 
                              <span className="text-xs px-2 py-0.5 rounded-full status-done">Active</span> :
                              <span className="text-xs px-2 py-0.5 rounded-full status-canceled">Inactive</span>
                            }
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  {users?.length === 0 && !usersLoading && (
                    <div className="col-span-full text-center p-8 text-muted-foreground text-sm">
                      No users found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Warehouses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Warehouses</h3>
                <button onClick={() => setIsAddingWh(true)} className="btn-primary-gradient flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Warehouse
                </button>
              </div>

              {isAddingWh && (
                <GlassCard className="p-5" style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
                  <div className="space-y-3">
                    <input autoFocus placeholder="Warehouse Name" value={newWhName} onChange={e => setNewWhName(e.target.value)} className="glass-input w-full text-sm" />
                    <input placeholder="Address" value={newWhAddress} onChange={e => setNewWhAddress(e.target.value)} className="glass-input w-full text-sm" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setIsAddingWh(false)} className="btn-ghost-dark text-xs">Cancel</button>
                      <button onClick={() => { if(newWhName) addWhMutation.mutate({ name: newWhName, address: newWhAddress }); }} className="btn-primary-gradient px-4 py-1.5 text-xs rounded-lg">Save</button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {warehousesLoading ? (
                <div className="flex items-center justify-center p-12">
                   <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {warehouses?.map((w: any) => (
                    <GlassCard key={w._id} className="p-5" hover>
                      {editWhId === w._id ? (
                        <div className="space-y-3">
                          <input autoFocus value={editWhName} onChange={e => setEditWhName(e.target.value)} className="glass-input w-full text-sm" />
                          <input value={editWhAddress} onChange={e => setEditWhAddress(e.target.value)} className="glass-input w-full text-sm" />
                          <div className="flex gap-2 justify-end mt-2">
                             <button onClick={() => setEditWhId(null)} className="p-1.5 bg-white/5 rounded-md hover:bg-white/10"><X className="w-4 h-4" /></button>
                             <button onClick={() => editWhMutation.mutate({ id: w._id, payload: { name: editWhName, address: editWhAddress }})} className="p-1.5 bg-primary/20 text-primary rounded-md hover:bg-primary/30"><Check className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{w.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {w.address || 'No address'}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
                                {w.locations?.length || 0} locations
                              </span>
                              {w.isDefault && <span className="text-xs px-2 py-0.5 rounded-full status-done">Default</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                             <button onClick={() => { setEditWhId(w._id); setEditWhName(w.name); setEditWhAddress(w.address || ''); }} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                             {!w.isDefault && <button onClick={() => { if(confirm('Are you sure?')) deleteWhMutation.mutate(w._id); }} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Categories</h3>
                <button onClick={() => setIsAddingCat(true)} className="btn-primary-gradient flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              {isAddingCat && (
                <GlassCard className="p-5" style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
                  <div className="space-y-3 max-w-sm w-full">
                    <input autoFocus placeholder="Category Name" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="glass-input w-full text-sm" />
                    <input placeholder="Description" value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} className="glass-input w-full text-sm" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setIsAddingCat(false)} className="btn-ghost-dark text-xs">Cancel</button>
                      <button onClick={() => { if(newCatName) addCatMutation.mutate({ name: newCatName, description: newCatDesc }); }} className="btn-primary-gradient px-4 py-1.5 text-xs rounded-lg">Save</button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {categoriesLoading ? (
                <div className="flex items-center justify-center p-12">
                   <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories?.map((c: any) => (
                    <GlassCard key={c._id} className="p-4 flex flex-col justify-between" hover>
                      {editCatId === c._id ? (
                         <div className="space-y-3 w-full">
                           <input autoFocus value={editCatName} onChange={e => setEditCatName(e.target.value)} className="glass-input w-full text-sm" />
                           <input value={editCatDesc} onChange={e => setEditCatDesc(e.target.value)} className="glass-input w-full text-sm" placeholder="Desc" />
                           <div className="flex gap-2 justify-end mt-2">
                              <button onClick={() => setEditCatId(null)} className="p-1.5 bg-white/5 rounded-md hover:bg-white/10"><X className="w-4 h-4" /></button>
                              <button onClick={() => editCatMutation.mutate({ id: c._id, payload: { name: editCatName, description: editCatDesc }})} className="p-1.5 bg-primary/20 text-primary rounded-md hover:bg-primary/30"><Check className="w-4 h-4" /></button>
                           </div>
                         </div>
                      ) : (
                        <>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{c.name}</div>
                            <div className="text-xs text-muted-foreground mt-1 min-h-[16px]">{c.description || 'No description'}</div>
                          </div>
                          <div className="flex justify-end gap-1 mt-4 border-t border-white/5 pt-2">
                             <button onClick={() => { setEditCatId(c._id); setEditCatName(c.name); setEditCatDesc(c.description || ''); }} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                             <button onClick={() => { if(confirm('Are you sure?')) deleteCatMutation.mutate(c._id); }} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </>
                      )}
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
