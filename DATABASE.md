# DATABASE SCHEMA DOCUMENTATION

## Overview

The Restaurant Order Management System uses PostgreSQL with Prisma ORM. This document describes the complete database schema.

---

## Core Tables

### 1. Users

Stores team members and staff.

```sql
CREATE TABLE "User" (
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  phone     String?
  role      UserRole  @default(WAITER)
  avatar    String?
  isActive  Boolean   @default(true)
  lastLogin DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
)
```

**Roles**: ADMIN, MANAGER, WAITER, KITCHEN, DELIVERY_STAFF, CUSTOMER

**Indexes**: email, role, isActive

---

### 2. MenuCategory

Organizes menu items into categories.

```sql
CREATE TABLE "MenuCategory" (
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  image       String?
  position    Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
)
```

**Indexes**: isActive, position

---

### 3. MenuItem

Individual food/beverage items.

```sql
CREATE TABLE "MenuItem" (
  id              String        @id @default(cuid())
  name            String
  description     String?
  price           Decimal(10,2)
  image           String?
  categoryId      String
  isAvailable     Boolean       @default(true)
  preparationTime Int           @default(15)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

**Relationships**: 
- `categoryId` → MenuCategory
- `variants` → MenuVariant (1:many)
- `orderItems` → OrderItem (1:many)

**Indexes**: categoryId, isAvailable, name

---

### 4. MenuVariant

Variations of menu items (size, topping, etc.).

```sql
CREATE TABLE "MenuVariant" (
  id            String        @id @default(cuid())
  name          String
  value         String
  priceModifier Decimal(10,2) @default(0)
  menuItemId    String
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  @@unique([menuItemId, name, value])
}
```

**Relationships**: `menuItemId` → MenuItem

**Indexes**: menuItemId

---

### 5. Table

Physical dining tables in restaurant.

```sql
CREATE TABLE "Table" (
  id             String       @id @default(cuid())
  tableNumber    Int          @unique
  capacity       Int
  location       String?
  status         TableStatus  @default(AVAILABLE)
  qrCode         String?
  currentOrderId String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}
```

**Statuses**: AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE

**Relationships**: `currentOrderId` → Order

**Indexes**: status, currentOrderId

---

### 6. Order

Main order record.

```sql
CREATE TABLE "Order" {
  id                     String       @id @default(cuid())
  orderNumber            String       @unique
  type                   OrderType
  status                 OrderStatus  @default(PENDING)
  tableId                String?
  customerName           String?
  customerPhone          String?
  customerEmail          String?
  deliveryAddress        String?
  items                  OrderItem[]
  subtotal               Decimal(10,2) @default(0)
  taxAmount              Decimal(10,2) @default(0)
  serviceCharge          Decimal(10,2) @default(0)
  totalAmount            Decimal(10,2) @default(0)
  specialInstructions    String?
  createdByUserId        String
  updatedByUserId        String?
  payment                Payment?
  timeline               OrderTimeline[]
  estimatedReadyTime     DateTime?
  actualReadyTime        DateTime?
  servedAt               DateTime?
  createdAt              DateTime     @default(now())
  updatedAt              DateTime     @updatedAt
}
```

**Order Types**: DINE_IN, TAKEAWAY, DELIVERY

**Order Statuses**: PENDING, CONFIRMED, PREPARING, READY, SERVED, COMPLETED, CANCELLED

**Relationships**:
- `tableId` → Table (optional)
- `createdByUserId` → User
- `updatedByUserId` → User (optional)
- `items` → OrderItem (1:many)
- `payment` → Payment (1:1)
- `timeline` → OrderTimeline (1:many)

**Indexes**: orderNumber, status, tableId, type, createdAt, createdByUserId

---

### 7. OrderItem

Individual items within an order.

```sql
CREATE TABLE "OrderItem" {
  id            String  @id @default(cuid())
  quantity      Int
  price         Decimal(10,2)
  specialNotes  String?
  orderId       String
  menuItemId    String
  variants      OrderItemVariant[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Relationships**:
- `orderId` → Order (onDelete: CASCADE)
- `menuItemId` → MenuItem
- `variants` → OrderItemVariant (1:many)

**Indexes**: orderId, menuItemId

---

### 8. OrderItemVariant

Links variants to order items.

```sql
CREATE TABLE "OrderItemVariant" {
  id           String   @id @default(cuid())
  orderItemId  String
  variantId    String
  orderItem    OrderItem @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  variant      MenuVariant @relation(fields: [variantId], references: [id])
  createdAt    DateTime  @default(now())
  
  @@unique([orderItemId, variantId])
}
```

**Indexes**: orderItemId

---

### 9. OrderTimeline

Audit trail of order status changes.

```sql
CREATE TABLE "OrderTimeline" {
  id                String        @id @default(cuid())
  orderId           String
  oldStatus         OrderStatus?
  newStatus         OrderStatus
  changedByUserId   String
  notes             String?
  createdAt         DateTime      @default(now())
}
```

**Relationships**:
- `orderId` → Order (onDelete: CASCADE)
- `changedByUserId` → User

**Indexes**: orderId, newStatus

---

### 10. Payment

Payment records for orders.

```sql
CREATE TABLE "Payment" {
  id                String         @id @default(cuid())
  orderId           String         @unique
  amount            Decimal(10,2)
  method            PaymentMethod
  status            PaymentStatus  @default(PENDING)
  transactionId     String?
  receiptNumber     String?
  processedByUserId String
  refundedAmount    Decimal(10,2)  @default(0)
  refundReason      String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}
```

**Payment Methods**: CASH, CARD, MOBILE, CHEQUE

**Payment Statuses**: PENDING, COMPLETED, FAILED, REFUNDED

**Relationships**:
- `orderId` → Order (onDelete: CASCADE)
- `processedByUserId` → User

**Indexes**: orderId, status, createdAt

---

### 11. RestaurantSettings

Configuration for the restaurant.

```sql
CREATE TABLE "RestaurantSettings" {
  id                        String   @id @default(cuid())
  restaurantName            String
  description               String?
  logo                      String?
  favicon                   String?
  operatingHours            String?
  taxPercentage             Decimal(5,2)  @default(0)
  serviceChargePercentage   Decimal(5,2)  @default(0)
  enableDelivery            Boolean       @default(false)
  enableTakeaway            Boolean       @default(true)
  enableDineIn              Boolean       @default(true)
  enableAdvanceOrder        Boolean       @default(false)
  kitchenSoundAlert         Boolean       @default(true)
  createdAt                 DateTime      @default(now())
  updatedAt                 DateTime      @updatedAt
}
```

---

## Relationships Diagram

```
User (1) ──► (many) Order
User (1) ──► (many) OrderTimeline
User (1) ──► (many) Payment

MenuCategory (1) ──► (many) MenuItem
MenuItem (1) ──► (many) MenuVariant
MenuItem (1) ──► (many) OrderItem

Table (1) ──► (0..1) Order (currentOrder)

Order (1) ──► (many) OrderItem
Order (1) ──► (many) OrderTimeline
Order (1) ──► (0..1) Payment

OrderItem (1) ──► (many) OrderItemVariant
MenuVariant (1) ──► (many) OrderItemVariant
```

---

## Indexes for Performance

### Primary Performance Indexes

```sql
-- Fast order lookups by status
CREATE INDEX idx_order_status ON Order(status);

-- Fast user lookups by email/role
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_role ON User(role);

-- Fast menu item lookups
CREATE INDEX idx_menu_item_category ON MenuItem(categoryId);
CREATE INDEX idx_menu_item_available ON MenuItem(isAvailable);

-- Fast order retrieval by table
CREATE INDEX idx_order_table ON Order(tableId);

-- Fast order item lookups
CREATE INDEX idx_order_item_order ON OrderItem(orderId);
CREATE INDEX idx_order_item_menu ON OrderItem(menuItemId);

-- Payment lookups
CREATE INDEX idx_payment_order ON Payment(orderId);
CREATE INDEX idx_payment_status ON Payment(status);

-- Timeline lookups
CREATE INDEX idx_timeline_order ON OrderTimeline(orderId);
```

---

## Data Growth Projections

### Estimated Table Sizes (1M orders/month):

| Table | Monthly Growth | Storage |
|-------|--------|---------|
| Order | 1M | ~500MB |
| OrderItem | 4M* | ~1GB |
| OrderTimeline | 8M* | ~2GB |
| User | 50-100 | ~1MB |
| MenuItem | 200-500 | ~50MB |
| Payment | 1M | ~500MB |

*Assuming 4 items per order, 8 timeline entries per order

---

## Backup Strategy

- **Neon Automatic Backups**: Daily snapshots (7-day retention)
- **Manual Backups**: Weekly full backups to S3
- **Point-in-time Recovery**: Available up to 7 days back

---

## Query Performance Tips

1. Always use indexes for WHERE clauses
2. Eager load relationships when needed
3. Paginate large result sets
4. Use database-level aggregations
5. Archive old orders (>180 days) quarterly

---

## Migrations

All schema changes tracked in `prisma/migrations/`:

```bash
# View migration history
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name feature_name

# Deploy migrations to production
npx prisma migrate deploy
```
