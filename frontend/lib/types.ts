// Shared type definitions for frontend

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  WAITER = "WAITER",
  KITCHEN = "KITCHEN",
  DELIVERY_STAFF = "DELIVERY_STAFF",
  CUSTOMER = "CUSTOMER",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  SERVED = "SERVED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKEAWAY = "TAKEAWAY",
  DELIVERY = "DELIVERY",
}

export enum TableStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  MAINTENANCE = "MAINTENANCE",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  category?: MenuCategory;
  isAvailable: boolean;
  preparationTime: number;
  variants?: MenuVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  position: number;
  isActive: boolean;
  items?: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  menuItemId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  location?: string;
  status: TableStatus;
  qrCode?: string;
  currentOrderId?: string;
  currentOrder?: Order;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  tableId?: string;
  table?: Table;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  totalAmount: number;
  specialInstructions?: string;
  createdByUserId: string;
  createdByUser: User;
  updatedByUserId?: string;
  updatedByUser?: User;
  payment?: Payment;
  timeline?: OrderTimeline[];
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  servedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  specialNotes?: string;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
  variants?: OrderItemVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemVariant {
  id: string;
  orderItemId: string;
  variantId: string;
  variant: MenuVariant;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: "CASH" | "CARD" | "MOBILE";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  transactionId?: string;
  receiptNumber?: string;
  processedByUserId: string;
  processedByUser: User;
  refundedAmount: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderTimeline {
  id: string;
  orderId: string;
  oldStatus?: OrderStatus;
  newStatus: OrderStatus;
  changedByUserId: string;
  changedByUser: User;
  notes?: string;
  createdAt: Date;
}

export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  description?: string;
  logo?: string;
  favicon?: string;
  operatingHours?: string;
  taxPercentage: number;
  serviceChargePercentage: number;
  enableDelivery: boolean;
  enableTakeaway: boolean;
  enableDineIn: boolean;
  enableAdvanceOrder: boolean;
  kitchenSoundAlert: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
