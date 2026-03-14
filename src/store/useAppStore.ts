import { create } from 'zustand';
import {
  products as mockProducts,
  receipts as mockReceipts,
  deliveries as mockDeliveries,
  transfers as mockTransfers,
  adjustments as mockAdjustments,
  moveHistory as mockMoveHistory,
  suppliers as mockSuppliers,
  customers as mockCustomers,
  warehouses as mockWarehouses,
  categories as mockCategories,
  notifications as mockNotifications,
  chartData as mockChartData,
} from '@/mock/data';
import type {
  Product, Receipt, Delivery, Transfer,
  Adjustment, MoveHistory, Supplier, Customer,
  Warehouse, Category, Notification,
} from '@/types';

interface AuthUser {
  name: string; email: string; password: string;
  role: string; initials: string; createdAt: string;
}

const getInitials = (n: string) =>
  n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const loadUsers = (): AuthUser[] => {
  try {
    const s = localStorage.getItem('ci_users');
    if (s) return JSON.parse(s);
  } catch {}
  return [
    { name:'Rajesh Kumar', email:'admin@coreinventory.com',
      password:'password123', role:'Admin', initials:'RK',
      createdAt:'2024-01-01T00:00:00Z' },
    { name:'Priya Sharma', email:'manager@coreinventory.com',
      password:'password123', role:'Manager', initials:'PS',
      createdAt:'2024-01-01T00:00:00Z' },
  ];
};
const saveUsers = (u: AuthUser[]) =>
  localStorage.setItem('ci_users', JSON.stringify(u));
const loadSession = (): AuthUser | null => {
  try {
    const s = localStorage.getItem('ci_session');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
if (!localStorage.getItem('ci_users')) saveUsers(loadUsers());

const newId = () =>
  Date.now().toString(16) + Math.random().toString(16).slice(2, 10);

const nextNo = (prefix: string, items: any[], field: string) => {
  const nums = items.map(i =>
    parseInt((i[field] || '').replace(prefix + '-', '')) || 0);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, '0')}`;
};

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (v: boolean) => void;
  isLoggedIn: boolean;
  currentUser: AuthUser;
  login: (token: string, user: any) => void;
  logout: () => void;
  products: Product[];
  receipts: Receipt[];
  deliveries: Delivery[];
  transfers: Transfer[];
  adjustments: Adjustment[];
  moveHistory: MoveHistory[];
  suppliers: Supplier[];
  customers: Customer[];
  warehouses: Warehouse[];
  categories: Category[];
  notifications: Notification[];
  chartData: typeof mockChartData;
  addProduct: (p: Omit<Product, '_id'|'createdAt'|'updatedAt'>) => Product;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReceipt: (r: Omit<Receipt, '_id'|'receiptNo'|'createdAt'|'createdBy'>) => Receipt;
  updateReceiptStatus: (id: string,
    status: 'confirmed'|'validated'|'done'|'canceled',
    receivedQtys?: Record<string, number>) => void;
  addDelivery: (d: Omit<Delivery, '_id'|'deliveryNo'|'createdAt'|'createdBy'>) => Delivery;
  updateDeliveryStatus: (id: string,
    status: 'ready'|'picked'|'packed'|'done'|'canceled',
    pickedQtys?: Record<string, number>) => void;
  addTransfer: (t: Omit<Transfer, '_id'|'transferNo'|'createdAt'|'createdBy'>) => Transfer;
  updateTransferStatus: (id: string, status: 'ready'|'done'|'canceled') => void;
  addAdjustment: (a: Omit<Adjustment, '_id'|'adjustmentNo'|'createdAt'|'createdBy'|'difference'>) => Adjustment;
  validateAdjustment: (id: string) => void;
  addSupplier: (s: Omit<Supplier, '_id'>) => Supplier;
  addCustomer: (c: Omit<Customer, '_id'>) => Customer;
  addCategory: (name: string, color: string) => Category;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, '_id'|'createdAt'|'isRead'>) => void;
}

const session = loadSession();

export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  globalSearchOpen: false,
  setGlobalSearchOpen: v => set({ globalSearchOpen: v }),

  isLoggedIn: !!session,
  currentUser: session || {
    name: 'Rajesh Kumar', email: 'admin@coreinventory.com',
    password: 'password123', role: 'Admin',
    initials: 'RK', createdAt: '',
  },

  login: (token, user) => {
    localStorage.setItem('ci_token', token);
    const mappedUser = {
      name: user.full_name || user.name,
      email: user.email,
      password: '',
      role: user.role || 'Staff',
      initials: getInitials(user.full_name || user.name || 'User'),
      createdAt: user.createdAt || new Date().toISOString(),
    };
    saveUsers([mappedUser]); // Replace mock users array for now, or just save session
    localStorage.setItem('ci_session', JSON.stringify(mappedUser));
    set({ isLoggedIn: true, currentUser: mappedUser });
  },

  logout: () => {
    localStorage.removeItem('ci_session');
    localStorage.removeItem('ci_token');
    set({
      isLoggedIn: false,
      currentUser: {
        name: 'Rajesh Kumar',
        email: 'admin@coreinventory.com',
        password: 'password123', role: 'Admin',
        initials: 'RK', createdAt: '',
      },
    });
  },

  // All mock data loaded as initial state
  products: [...mockProducts],
  receipts: [...mockReceipts],
  deliveries: [...mockDeliveries],
  transfers: [...mockTransfers],
  adjustments: [...mockAdjustments],
  moveHistory: [...mockMoveHistory],
  suppliers: [...mockSuppliers],
  customers: [...mockCustomers],
  warehouses: [...mockWarehouses],
  categories: [...mockCategories],
  notifications: [...mockNotifications],
  chartData: mockChartData,

  addProduct: (p) => {
    const np: Product = {
      ...p, _id: newId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(s => ({ products: [np, ...s.products] }));
    return np;
  },
  updateProduct: (id, p) =>
    set(s => ({
      products: s.products.map(x =>
        x._id === id
          ? { ...x, ...p, updatedAt: new Date().toISOString() }
          : x)
    })),
  deleteProduct: (id) =>
    set(s => ({ products: s.products.filter(x => x._id !== id) })),

  addReceipt: (r) => {
    const { receipts, currentUser } = get();
    const nr: Receipt = {
      ...r, _id: newId(),
      receiptNo: nextNo('REC', receipts, 'receiptNo'),
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };
    set(s => ({ receipts: [nr, ...s.receipts] }));
    return nr;
  },
  updateReceiptStatus: (id, status, receivedQtys) => {
    const { receipts, products, currentUser } = get();
    const receipt = receipts.find(r => r._id === id);
    if (!receipt) return;
    if (status === 'validated' && receivedQtys) {
      const updatedProducts = [...products];
      const newMoves: MoveHistory[] = [];
      receipt.lines.forEach(line => {
        const qty = receivedQtys[line._id] ?? line.expectedQty;
        const pi = updatedProducts.findIndex(p => p._id === line.productId);
        if (pi >= 0) {
          updatedProducts[pi] = {
            ...updatedProducts[pi],
            stock: updatedProducts[pi].stock + qty,
            updatedAt: new Date().toISOString(),
          };
        }
        newMoves.push({
          _id: newId(), type: 'receipt',
          productId: line.productId,
          productName: line.productName,
          from: 'Supplier', to: line.locationName,
          change: qty,
          reference: receipt.receiptNo,
          createdBy: currentUser.name,
          createdAt: new Date().toISOString(),
        });
      });
      set(s => ({
        receipts: s.receipts.map(r =>
          r._id === id ? { ...r, status } : r),
        products: updatedProducts,
        moveHistory: [...newMoves, ...s.moveHistory],
      }));
      return;
    }
    set(s => ({
      receipts: s.receipts.map(r =>
        r._id === id ? { ...r, status } : r)
    }));
  },

  addDelivery: (d) => {
    const { deliveries, currentUser } = get();
    const nd: Delivery = {
      ...d, _id: newId(),
      deliveryNo: nextNo('DEL', deliveries, 'deliveryNo'),
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };
    set(s => ({ deliveries: [nd, ...s.deliveries] }));
    return nd;
  },
  updateDeliveryStatus: (id, status, pickedQtys) => {
    const { deliveries, products, currentUser } = get();
    const delivery = deliveries.find(d => d._id === id);
    if (!delivery) return;
    if (status === 'done') {
      const updatedProducts = [...products];
      const newMoves: MoveHistory[] = [];
      delivery.lines.forEach(line => {
        const qty = line.pickedQty ?? line.requestedQty;
        const pi = updatedProducts.findIndex(p => p._id === line.productId);
        if (pi >= 0) {
          updatedProducts[pi] = {
            ...updatedProducts[pi],
            stock: Math.max(0, updatedProducts[pi].stock - qty),
            updatedAt: new Date().toISOString(),
          };
        }
        newMoves.push({
          _id: newId(), type: 'delivery',
          productId: line.productId,
          productName: line.productName,
          from: line.locationName,
          to: delivery.customerName,
          change: -qty,
          reference: delivery.deliveryNo,
          createdBy: currentUser.name,
          createdAt: new Date().toISOString(),
        });
      });
      set(s => ({
        deliveries: s.deliveries.map(d =>
          d._id === id ? { ...d, status } : d),
        products: updatedProducts,
        moveHistory: [...newMoves, ...s.moveHistory],
      }));
      return;
    }
    if (status === 'picked' && pickedQtys) {
      set(s => ({
        deliveries: s.deliveries.map(d =>
          d._id === id ? {
            ...d, status,
            lines: d.lines.map(l => ({
              ...l,
              pickedQty: pickedQtys[l._id] ?? l.requestedQty
            }))
          } : d)
      }));
      return;
    }
    set(s => ({
      deliveries: s.deliveries.map(d =>
        d._id === id ? { ...d, status } : d)
    }));
  },

  addTransfer: (t) => {
    const { transfers, currentUser } = get();
    const nt: Transfer = {
      ...t, _id: newId(),
      transferNo: nextNo('TRF', transfers, 'transferNo'),
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };
    set(s => ({ transfers: [nt, ...s.transfers] }));
    return nt;
  },
  updateTransferStatus: (id, status) => {
    const { transfers, currentUser } = get();
    const transfer = transfers.find(t => t._id === id);
    if (!transfer) return;
    if (status === 'done') {
      const newMoves: MoveHistory[] = transfer.lines.map(line => ({
        _id: newId(), type: 'transfer' as const,
        productId: line.productId,
        productName: line.productName,
        from: `${transfer.fromWarehouse} → ${transfer.fromLocation}`,
        to: `${transfer.toWarehouse} → ${transfer.toLocation}`,
        change: line.qty,
        reference: transfer.transferNo,
        createdBy: currentUser.name,
        createdAt: new Date().toISOString(),
      }));
      set(s => ({
        transfers: s.transfers.map(t =>
          t._id === id ? { ...t, status } : t),
        moveHistory: [...newMoves, ...s.moveHistory],
      }));
      return;
    }
    set(s => ({
      transfers: s.transfers.map(t =>
        t._id === id ? { ...t, status } : t)
    }));
  },

  addAdjustment: (a) => {
    const { adjustments, currentUser } = get();
    const diff = a.countedQty - a.systemQty;
    const na: Adjustment = {
      ...a, _id: newId(),
      adjustmentNo: nextNo('ADJ', adjustments, 'adjustmentNo'),
      difference: diff,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };
    set(s => ({ adjustments: [na, ...s.adjustments] }));
    return na;
  },
  validateAdjustment: (id) => {
    const { adjustments, products, currentUser } = get();
    const adj = adjustments.find(a => a._id === id);
    if (!adj || adj.status === 'validated') return;
    const move: MoveHistory = {
      _id: newId(), type: 'adjustment',
      productId: adj.productId,
      productName: adj.productName,
      from: adj.locationName, to: adj.locationName,
      change: adj.difference,
      reference: adj.adjustmentNo,
      notes: adj.reason,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    set(s => ({
      adjustments: s.adjustments.map(a =>
        a._id === id ? { ...a, status: 'validated' } : a),
      products: s.products.map(p =>
        p._id === adj.productId
          ? { ...p, stock: adj.countedQty,
              updatedAt: new Date().toISOString() }
          : p),
      moveHistory: [move, ...s.moveHistory],
    }));
  },

  addSupplier: (s) => {
    const ns: Supplier = { ...s, _id: newId() };
    set(st => ({ suppliers: [ns, ...st.suppliers] }));
    return ns;
  },
  addCustomer: (c) => {
    const nc: Customer = { ...c, _id: newId() };
    set(st => ({ customers: [nc, ...st.customers] }));
    return nc;
  },
  addCategory: (name, color) => {
    const nc: Category = {
      _id: newId(), name, color, productCount: 0
    };
    set(s => ({ categories: [nc, ...s.categories] }));
    return nc;
  },

  markNotificationRead: (id) =>
    set(s => ({
      notifications: s.notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n)
    })),
  markAllNotificationsRead: () =>
    set(s => ({
      notifications: s.notifications.map(n =>
        ({ ...n, isRead: true }))
    })),
  addNotification: (n) => {
    const nn: Notification = {
      ...n, _id: newId(), isRead: false,
      createdAt: new Date().toISOString(),
    };
    set(s => ({
      notifications: [nn, ...s.notifications].slice(0, 20)
    }));
  },
}));
