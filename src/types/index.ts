export type Status = 'draft' | 'confirmed' | 'validated' | 'done' | 'canceled' | 'ready' | 'waiting' | 'picked' | 'packed';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  stock: number;
  costPrice: number;
  sellingPrice?: number;
  reorderLevel: number;
  isActive: boolean;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  address: string;
  isDefault: boolean;
  locations: Location[];
}

export interface Location {
  _id: string;
  name: string;
  warehouseId: string;
}

export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ReceiptLine {
  _id: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  expectedQty: number;
  receivedQty?: number;
  unit: string;
  unitPrice: number;
}

export interface Receipt {
  _id: string;
  receiptNo: string;
  supplierId: string;
  supplierName: string;
  status: Status;
  expectedDate: string;
  reference?: string;
  notes?: string;
  lines: ReceiptLine[];
  createdAt: string;
  createdBy: string;
}

export interface DeliveryLine {
  _id: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  requestedQty: number;
  pickedQty?: number;
  unit: string;
  unitPrice: number;
}

export interface Delivery {
  _id: string;
  deliveryNo: string;
  customerId: string;
  customerName: string;
  status: Status;
  deliveryDate: string;
  lines: DeliveryLine[];
  createdAt: string;
  createdBy: string;
}

export interface Transfer {
  _id: string;
  transferNo: string;
  fromWarehouse: string;
  fromLocation: string;
  toWarehouse: string;
  toLocation: string;
  status: Status;
  lines: TransferLine[];
  createdAt: string;
  createdBy: string;
}

export interface TransferLine {
  _id: string;
  productId: string;
  productName: string;
  qty: number;
  unit: string;
}

export interface Adjustment {
  _id: string;
  adjustmentNo: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  systemQty: number;
  countedQty: number;
  difference: number;
  reason: string;
  status: Status;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface MoveHistory {
  _id: string;
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  productId: string;
  productName: string;
  from: string;
  to: string;
  change: number;
  reference: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface Notification {
  _id: string;
  type: 'low_stock' | 'receipt_validated' | 'delivery_done' | 'transfer_complete';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  _id: string;
  user: string;
  action: 'created' | 'updated' | 'deleted' | 'validated';
  module: string;
  recordId: string;
  changes?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  productCount: number;
}
