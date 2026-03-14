import { Product, Warehouse, Supplier, Customer, Receipt, Delivery, Transfer, Adjustment, MoveHistory, Notification, Category, AuditLog } from '@/types';

export const categories: Category[] = [
  { _id: 'cat001000000000000000001', name: 'Raw Materials', color: '#00D4AA', productCount: 4 },
  { _id: 'cat002000000000000000002', name: 'Finished Goods', color: '#00BCD4', productCount: 2 },
  { _id: 'cat003000000000000000003', name: 'Packaging', color: '#8B5CF6', productCount: 2 },
  { _id: 'cat004000000000000000004', name: 'Spare Parts', color: '#FFB020', productCount: 1 },
  { _id: 'cat005000000000000000005', name: 'Chemicals', color: '#FF4444', productCount: 1 },
];

export const warehouses: Warehouse[] = [
  { _id: 'wh0010000000000000000001', name: 'Main Warehouse', address: '123 Industrial Area, Mumbai', isDefault: true, locations: [
    { _id: 'loc001000000000000000001', name: 'Rack A', warehouseId: 'wh0010000000000000000001' },
    { _id: 'loc002000000000000000002', name: 'Rack B', warehouseId: 'wh0010000000000000000001' },
    { _id: 'loc003000000000000000003', name: 'Shelf C1', warehouseId: 'wh0010000000000000000001' },
    { _id: 'loc004000000000000000004', name: 'Shelf C2', warehouseId: 'wh0010000000000000000001' },
  ]},
  { _id: 'wh0020000000000000000002', name: 'Production Floor', address: '456 Factory Lane, Pune', isDefault: false, locations: [
    { _id: 'loc005000000000000000005', name: 'Production Rack 1', warehouseId: 'wh0020000000000000000002' },
  ]},
  { _id: 'wh0030000000000000000003', name: 'Cold Storage', address: '789 Cold Zone, Delhi', isDefault: false, locations: [
    { _id: 'loc006000000000000000006', name: 'Cold Room A', warehouseId: 'wh0030000000000000000003' },
  ]},
];

export const suppliers: Supplier[] = [
  { _id: 'sup001000000000000000001', name: 'Steel Corp India', email: 'contact@steelcorp.in', phone: '+91-9876543210' },
  { _id: 'sup002000000000000000002', name: 'Global Supplies Ltd', email: 'info@globalsupplies.com', phone: '+91-9876543211' },
  { _id: 'sup003000000000000000003', name: 'Metro Packaging Co', email: 'sales@metropack.in', phone: '+91-9876543212' },
  { _id: 'sup004000000000000000004', name: 'Allied Materials', email: 'order@alliedmat.com', phone: '+91-9876543213' },
];

export const customers: Customer[] = [
  { _id: 'cust01000000000000000001', name: 'Tata Manufacturing', email: 'procurement@tata.com', phone: '+91-9876543220' },
  { _id: 'cust02000000000000000002', name: 'Reliance Industries', email: 'supply@reliance.com', phone: '+91-9876543221' },
  { _id: 'cust03000000000000000003', name: 'Mahindra Group', email: 'orders@mahindra.com', phone: '+91-9876543222' },
  { _id: 'cust04000000000000000004', name: 'Local Dealer Co.', email: 'info@localdealer.in', phone: '+91-9876543223' },
];

export const products: Product[] = [
  { _id: 'prod01000000000000000001', name: 'Steel Rods', sku: 'STL-001', category: 'Raw Materials', unit: 'kg', stock: 450, costPrice: 85, sellingPrice: 120, reorderLevel: 100, isActive: true, createdAt: '2024-01-15', updatedAt: '2024-03-10' },
  { _id: 'prod02000000000000000002', name: 'Office Chairs', sku: 'CHR-001', category: 'Finished Goods', unit: 'pcs', stock: 4, costPrice: 4500, sellingPrice: 7500, reorderLevel: 10, isActive: true, createdAt: '2024-01-20', updatedAt: '2024-03-08' },
  { _id: 'prod03000000000000000003', name: 'Cardboard Boxes', sku: 'PKG-001', category: 'Packaging', unit: 'pcs', stock: 0, costPrice: 25, sellingPrice: 45, reorderLevel: 200, isActive: true, createdAt: '2024-02-01', updatedAt: '2024-03-12' },
  { _id: 'prod04000000000000000004', name: 'Aluminum Sheets', sku: 'ALM-001', category: 'Raw Materials', unit: 'kg', stock: 230, costPrice: 210, sellingPrice: 290, reorderLevel: 50, isActive: true, createdAt: '2024-02-05', updatedAt: '2024-03-11' },
  { _id: 'prod05000000000000000005', name: 'Ball Bearings', sku: 'SPR-001', category: 'Spare Parts', unit: 'pcs', stock: 89, costPrice: 150, sellingPrice: 220, reorderLevel: 30, isActive: true, createdAt: '2024-02-10', updatedAt: '2024-03-09' },
  { _id: 'prod06000000000000000006', name: 'Copper Wire', sku: 'COP-001', category: 'Raw Materials', unit: 'kg', stock: 120, costPrice: 650, sellingPrice: 850, reorderLevel: 25, isActive: true, createdAt: '2024-02-12', updatedAt: '2024-03-07' },
  { _id: 'prod07000000000000000007', name: 'Bubble Wrap', sku: 'PKG-002', category: 'Packaging', unit: 'meters', stock: 8, costPrice: 15, sellingPrice: 28, reorderLevel: 50, isActive: true, createdAt: '2024-02-15', updatedAt: '2024-03-06' },
  { _id: 'prod08000000000000000008', name: 'Industrial Solvent', sku: 'CHM-001', category: 'Chemicals', unit: 'liters', stock: 35, costPrice: 320, sellingPrice: 480, reorderLevel: 10, isActive: false, createdAt: '2024-02-18', updatedAt: '2024-03-05' },
  { _id: 'prod09000000000000000009', name: 'Standing Desks', sku: 'DSK-001', category: 'Finished Goods', unit: 'pcs', stock: 15, costPrice: 12000, sellingPrice: 18500, reorderLevel: 5, isActive: true, createdAt: '2024-02-20', updatedAt: '2024-03-04' },
  { _id: 'prod10000000000000000010', name: 'Iron Bolts', sku: 'BLT-001', category: 'Raw Materials', unit: 'pcs', stock: 2500, costPrice: 3, sellingPrice: 6, reorderLevel: 500, isActive: true, createdAt: '2024-02-22', updatedAt: '2024-03-03' },
];

export const receipts: Receipt[] = [
  { _id: 'rec001000000000000000001', receiptNo: 'REC-001', supplierId: 'sup001000000000000000001', supplierName: 'Steel Corp India', status: 'done', expectedDate: '2024-03-05', reference: 'PO-2024-001', lines: [
    { _id: 'rl001', productId: 'prod01000000000000000001', productName: 'Steel Rods', locationId: 'loc001000000000000000001', locationName: 'Rack A', expectedQty: 200, receivedQty: 200, unit: 'kg', unitPrice: 85 },
  ], createdAt: '2024-03-01', createdBy: 'Admin' },
  { _id: 'rec002000000000000000002', receiptNo: 'REC-002', supplierId: 'sup002000000000000000002', supplierName: 'Global Supplies Ltd', status: 'confirmed', expectedDate: '2024-03-15', lines: [
    { _id: 'rl002', productId: 'prod04000000000000000004', productName: 'Aluminum Sheets', locationId: 'loc002000000000000000002', locationName: 'Rack B', expectedQty: 100, unit: 'kg', unitPrice: 210 },
    { _id: 'rl003', productId: 'prod06000000000000000006', productName: 'Copper Wire', locationId: 'loc001000000000000000001', locationName: 'Rack A', expectedQty: 50, unit: 'kg', unitPrice: 650 },
  ], createdAt: '2024-03-08', createdBy: 'Admin' },
  { _id: 'rec003000000000000000003', receiptNo: 'REC-003', supplierId: 'sup003000000000000000003', supplierName: 'Metro Packaging Co', status: 'draft', expectedDate: '2024-03-20', lines: [
    { _id: 'rl004', productId: 'prod03000000000000000003', productName: 'Cardboard Boxes', locationId: 'loc003000000000000000003', locationName: 'Shelf C1', expectedQty: 500, unit: 'pcs', unitPrice: 25 },
  ], createdAt: '2024-03-10', createdBy: 'Admin' },
  { _id: 'rec004000000000000000004', receiptNo: 'REC-004', supplierId: 'sup001000000000000000001', supplierName: 'Steel Corp India', status: 'draft', expectedDate: '2024-03-22', lines: [
    { _id: 'rl005', productId: 'prod01000000000000000001', productName: 'Steel Rods', locationId: 'loc001000000000000000001', locationName: 'Rack A', expectedQty: 300, unit: 'kg', unitPrice: 85 },
  ], createdAt: '2024-03-12', createdBy: 'Admin' },
  { _id: 'rec005000000000000000005', receiptNo: 'REC-005', supplierId: 'sup004000000000000000004', supplierName: 'Allied Materials', status: 'confirmed', expectedDate: '2024-03-18', lines: [
    { _id: 'rl006', productId: 'prod05000000000000000005', productName: 'Ball Bearings', locationId: 'loc002000000000000000002', locationName: 'Rack B', expectedQty: 200, unit: 'pcs', unitPrice: 150 },
  ], createdAt: '2024-03-09', createdBy: 'Admin' },
  { _id: 'rec006000000000000000006', receiptNo: 'REC-006', supplierId: 'sup002000000000000000002', supplierName: 'Global Supplies Ltd', status: 'validated', expectedDate: '2024-03-14', lines: [
    { _id: 'rl007', productId: 'prod09000000000000000009', productName: 'Standing Desks', locationId: 'loc005000000000000000005', locationName: 'Production Rack 1', expectedQty: 10, receivedQty: 10, unit: 'pcs', unitPrice: 12000 },
  ], createdAt: '2024-03-07', createdBy: 'Admin' },
  { _id: 'rec007000000000000000007', receiptNo: 'REC-007', supplierId: 'sup003000000000000000003', supplierName: 'Metro Packaging Co', status: 'draft', expectedDate: '2024-03-25', lines: [
    { _id: 'rl008', productId: 'prod07000000000000000007', productName: 'Bubble Wrap', locationId: 'loc003000000000000000003', locationName: 'Shelf C1', expectedQty: 100, unit: 'meters', unitPrice: 15 },
  ], createdAt: '2024-03-13', createdBy: 'Admin' },
];

export const deliveries: Delivery[] = [
  { _id: 'del001000000000000000001', deliveryNo: 'DEL-001', customerId: 'cust01000000000000000001', customerName: 'Tata Manufacturing', status: 'done', deliveryDate: '2024-03-06', lines: [
    { _id: 'dl001', productId: 'prod01000000000000000001', productName: 'Steel Rods', locationId: 'loc001000000000000000001', locationName: 'Rack A', requestedQty: 100, pickedQty: 100, unit: 'kg', unitPrice: 120 },
  ], createdAt: '2024-03-04', createdBy: 'Admin' },
  { _id: 'del002000000000000000002', deliveryNo: 'DEL-002', customerId: 'cust02000000000000000002', customerName: 'Reliance Industries', status: 'ready', deliveryDate: '2024-03-15', lines: [
    { _id: 'dl002', productId: 'prod04000000000000000004', productName: 'Aluminum Sheets', locationId: 'loc002000000000000000002', locationName: 'Rack B', requestedQty: 50, unit: 'kg', unitPrice: 290 },
    { _id: 'dl003', productId: 'prod05000000000000000005', productName: 'Ball Bearings', locationId: 'loc002000000000000000002', locationName: 'Rack B', requestedQty: 30, unit: 'pcs', unitPrice: 220 },
  ], createdAt: '2024-03-10', createdBy: 'Admin' },
  { _id: 'del003000000000000000003', deliveryNo: 'DEL-003', customerId: 'cust03000000000000000003', customerName: 'Mahindra Group', status: 'draft', deliveryDate: '2024-03-20', lines: [
    { _id: 'dl004', productId: 'prod09000000000000000009', productName: 'Standing Desks', locationId: 'loc005000000000000000005', locationName: 'Production Rack 1', requestedQty: 5, unit: 'pcs', unitPrice: 18500 },
  ], createdAt: '2024-03-12', createdBy: 'Admin' },
  { _id: 'del004000000000000000004', deliveryNo: 'DEL-004', customerId: 'cust04000000000000000004', customerName: 'Local Dealer Co.', status: 'picked', deliveryDate: '2024-03-16', lines: [
    { _id: 'dl005', productId: 'prod10000000000000000010', productName: 'Iron Bolts', locationId: 'loc001000000000000000001', locationName: 'Rack A', requestedQty: 500, pickedQty: 500, unit: 'pcs', unitPrice: 6 },
  ], createdAt: '2024-03-11', createdBy: 'Admin' },
];

export const transfers: Transfer[] = [
  { _id: 'trf001000000000000000001', transferNo: 'TRF-001', fromWarehouse: 'Main Warehouse', fromLocation: 'Rack A', toWarehouse: 'Production Floor', toLocation: 'Production Rack 1', status: 'done', lines: [
    { _id: 'tl001', productId: 'prod01000000000000000001', productName: 'Steel Rods', qty: 50, unit: 'kg' },
  ], createdAt: '2024-03-05', createdBy: 'Admin' },
  { _id: 'trf002000000000000000002', transferNo: 'TRF-002', fromWarehouse: 'Main Warehouse', fromLocation: 'Rack B', toWarehouse: 'Cold Storage', toLocation: 'Cold Room A', status: 'ready', lines: [
    { _id: 'tl002', productId: 'prod08000000000000000008', productName: 'Industrial Solvent', qty: 10, unit: 'liters' },
  ], createdAt: '2024-03-09', createdBy: 'Admin' },
  { _id: 'trf003000000000000000003', transferNo: 'TRF-003', fromWarehouse: 'Production Floor', fromLocation: 'Production Rack 1', toWarehouse: 'Main Warehouse', toLocation: 'Shelf C2', status: 'draft', lines: [
    { _id: 'tl003', productId: 'prod09000000000000000009', productName: 'Standing Desks', qty: 3, unit: 'pcs' },
  ], createdAt: '2024-03-12', createdBy: 'Admin' },
];

export const adjustments: Adjustment[] = [
  { _id: 'adj001000000000000000001', adjustmentNo: 'ADJ-001', productId: 'prod02000000000000000002', productName: 'Office Chairs', locationId: 'loc002000000000000000002', locationName: 'Rack B', systemQty: 8, countedQty: 4, difference: -4, reason: 'Damaged', status: 'validated', createdAt: '2024-03-06', createdBy: 'Admin' },
  { _id: 'adj002000000000000000002', adjustmentNo: 'ADJ-002', productId: 'prod07000000000000000007', productName: 'Bubble Wrap', locationId: 'loc003000000000000000003', locationName: 'Shelf C1', systemQty: 50, countedQty: 8, difference: -42, reason: 'Lost', status: 'draft', createdAt: '2024-03-10', createdBy: 'Admin' },
];

export const moveHistory: MoveHistory[] = [
  { _id: 'mv001', type: 'receipt', productId: 'prod01000000000000000001', productName: 'Steel Rods', from: 'Supplier', to: 'Main Warehouse → Rack A', change: 200, reference: 'REC-001', createdBy: 'Admin', createdAt: '2024-03-05T14:30:00Z' },
  { _id: 'mv002', type: 'delivery', productId: 'prod01000000000000000001', productName: 'Steel Rods', from: 'Main Warehouse → Rack A', to: 'Tata Manufacturing', change: -100, reference: 'DEL-001', createdBy: 'Admin', createdAt: '2024-03-06T10:15:00Z' },
  { _id: 'mv003', type: 'transfer', productId: 'prod01000000000000000001', productName: 'Steel Rods', from: 'Main Warehouse → Rack A', to: 'Production Floor → Production Rack 1', change: -50, reference: 'TRF-001', createdBy: 'Admin', createdAt: '2024-03-07T09:00:00Z' },
  { _id: 'mv004', type: 'adjustment', productId: 'prod02000000000000000002', productName: 'Office Chairs', from: 'Rack B', to: 'Rack B', change: -4, reference: 'ADJ-001', createdBy: 'Admin', createdAt: '2024-03-08T11:30:00Z', notes: 'Damaged chairs removed' },
  { _id: 'mv005', type: 'receipt', productId: 'prod09000000000000000009', productName: 'Standing Desks', from: 'Supplier', to: 'Production Floor → Production Rack 1', change: 10, reference: 'REC-006', createdBy: 'Admin', createdAt: '2024-03-09T15:00:00Z' },
  { _id: 'mv006', type: 'delivery', productId: 'prod10000000000000000010', productName: 'Iron Bolts', from: 'Main Warehouse → Rack A', to: 'Local Dealer Co.', change: -500, reference: 'DEL-004', createdBy: 'Admin', createdAt: '2024-03-10T08:45:00Z' },
];

export const notifications: Notification[] = [
  { _id: 'n001', type: 'low_stock', title: 'Low Stock Alert', message: 'Office Chairs is low (4 remaining)', isRead: false, createdAt: '2024-03-12T10:00:00Z', link: '/products/prod02000000000000000002' },
  { _id: 'n002', type: 'receipt_validated', title: 'Receipt Validated', message: 'REC-006 has been validated', isRead: false, createdAt: '2024-03-11T14:30:00Z', link: '/receipts/rec006000000000000000006' },
  { _id: 'n003', type: 'delivery_done', title: 'Delivery Completed', message: 'DEL-001 has been delivered', isRead: true, createdAt: '2024-03-10T16:00:00Z', link: '/deliveries/del001000000000000000001' },
  { _id: 'n004', type: 'low_stock', title: 'Out of Stock', message: 'Cardboard Boxes is out of stock', isRead: false, createdAt: '2024-03-10T09:00:00Z', link: '/products/prod03000000000000000003' },
  { _id: 'n005', type: 'transfer_complete', title: 'Transfer Complete', message: 'TRF-001 has been completed', isRead: true, createdAt: '2024-03-09T12:00:00Z', link: '/transfers/trf001000000000000000001' },
];

export const auditLogs: AuditLog[] = [
  { _id: 'al001', user: 'Admin', action: 'created', module: 'Products', recordId: 'prod01000000000000000001', createdAt: '2024-01-15T10:00:00Z' },
  { _id: 'al002', user: 'Admin', action: 'validated', module: 'Receipts', recordId: 'rec001000000000000000001', changes: 'Status: confirmed → validated', createdAt: '2024-03-05T14:30:00Z' },
  { _id: 'al003', user: 'Admin', action: 'updated', module: 'Products', recordId: 'prod02000000000000000002', changes: 'Stock: 8 → 4', createdAt: '2024-03-08T11:30:00Z' },
  { _id: 'al004', user: 'Admin', action: 'created', module: 'Deliveries', recordId: 'del003000000000000000003', createdAt: '2024-03-12T09:00:00Z' },
  { _id: 'al005', user: 'Admin', action: 'deleted', module: 'Products', recordId: 'prod_deleted', createdAt: '2024-03-11T16:00:00Z' },
];

export const chartData = {
  stockMovement: [
    { day: 'Mon', incoming: 120, outgoing: 80 },
    { day: 'Tue', incoming: 90, outgoing: 110 },
    { day: 'Wed', incoming: 200, outgoing: 60 },
    { day: 'Thu', incoming: 50, outgoing: 140 },
    { day: 'Fri', incoming: 180, outgoing: 90 },
    { day: 'Sat', incoming: 60, outgoing: 30 },
    { day: 'Sun', incoming: 40, outgoing: 20 },
  ],
  stockByCategory: [
    { name: 'Raw Materials', value: 3300, color: '#00D4AA' },
    { name: 'Finished Goods', value: 19, color: '#00BCD4' },
    { name: 'Packaging', value: 8, color: '#8B5CF6' },
    { name: 'Spare Parts', value: 89, color: '#FFB020' },
    { name: 'Chemicals', value: 35, color: '#FF4444' },
  ],
  inventoryValue: [
    { date: 'Feb 14', value: 2100000 },
    { date: 'Feb 21', value: 2250000 },
    { date: 'Feb 28', value: 2180000 },
    { date: 'Mar 07', value: 2350000 },
    { date: 'Mar 14', value: 2485000 },
  ],
};
