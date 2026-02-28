# API DOCUMENTATION

## Base URL

```
Production: https://restaurant-system-api.onrender.com
Development: http://localhost:5000
```

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/register` require JWT token in header:

```
Authorization: Bearer <token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-02-28T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "ERROR_CODE",
  "timestamp": "2024-02-28T10:00:00Z"
}
```

---

## Authentication Endpoints

### Register User
```
POST /api/auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "WAITER"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### Login
```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "xxx",
    "email": "admin@restaurant.com",
    "name": "Admin User",
    "role": "ADMIN"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Get All Users (Admin only)
```
GET /api/auth/users?limit=50&offset=0
Headers: Authorization: Bearer <token>
```

### Update User (Admin only)
```
PUT /api/auth/users/:id
Headers: Authorization: Bearer <token>

Body:
{
  "name": "Updated Name",
  "email": "new@example.com",
  "avatar": "url"
}
```

### Delete User (Admin only)
```
DELETE /api/auth/users/:id
Headers: Authorization: Bearer <token>
```

---

## Menu Endpoints

### Get Full Menu
```
GET /api/menu/full
```

**Response:**
```json
[
  {
    "id": "cat-xxx",
    "name": "Appetizers",
    "items": [
      {
        "id": "item-xxx",
        "name": "Bruschetta",
        "price": 8.99,
        "description": "...",
        "variants": [
          {
            "id": "var-xxx",
            "name": "Size",
            "value": "Large",
            "priceModifier": 2.00
          }
        ]
      }
    ]
  }
]
```

### Get Categories
```
GET /api/menu/categories
```

### Create Category (Admin only)
```
POST /api/menu/categories
Headers: Authorization: Bearer <token>

Body:
{
  "name": "Desserts",
  "description": "Sweet treats",
  "image": "url"
}
```

### Update Category (Admin only)
```
PUT /api/menu/categories/:id
Headers: Authorization: Bearer <token>

Body:
{
  "name": "Updated Name",
  "position": 2,
  "isActive": true
}
```

### Delete Category (Admin only)
```
DELETE /api/menu/categories/:id
Headers: Authorization: Bearer <token>
```

### Get Menu Items
```
GET /api/menu/items?categoryId=xxx
```

### Create Menu Item (Admin only)
```
POST /api/menu/items
Headers: Authorization: Bearer <token>

Body:
{
  "name": "Chicken Parmesan",
  "price": 18.99,
  "categoryId": "cat-xxx",
  "description": "...",
  "preparationTime": 20,
  "image": "url"
}
```

### Update Menu Item (Admin only)
```
PUT /api/menu/items/:id
Headers: Authorization: Bearer <token>

Body:
{
  "price": 19.99,
  "isAvailable": true,
  "preparationTime": 18
}
```

### Delete Menu Item (Admin only)
```
DELETE /api/menu/items/:id
Headers: Authorization: Bearer <token>
```

### Search Menu Items
```
GET /api/menu/search?q=chicken
```

### Create Variant (Admin only)
```
POST /api/menu/variants
Headers: Authorization: Bearer <token>

Body:
{
  "name": "Size",
  "value": "Large",
  "priceModifier": 2.50,
  "menuItemId": "item-xxx"
}
```

### Get Variants for Item
```
GET /api/menu/variants/:menuItemId
```

---

## Order Endpoints

### Create Order
```
POST /api/orders
Headers: Authorization: Bearer <token>

Body:
{
  "type": "DINE_IN",
  "tableId": "table-xxx",
  "items": [
    {
      "menuItemId": "item-xxx",
      "quantity": 2,
      "specialNotes": "Extra cheese",
      "variants": ["var-xxx"]
    }
  ],
  "specialInstructions": "No onions"
}
```

**Response:**
```json
{
  "id": "order-xxx",
  "orderNumber": "ORD-000001",
  "type": "DINE_IN",
  "status": "PENDING",
  "totalAmount": 45.98,
  "items": [...],
  "createdAt": "2024-02-28T10:00:00Z"
}
```

### Get All Orders
```
GET /api/orders?status=PENDING&type=DINE_IN&limit=50&offset=0
Headers: Authorization: Bearer <token>
```

### Get Order by ID
```
GET /api/orders/:id
Headers: Authorization: Bearer <token>
```

### Update Order Status
```
PUT /api/orders/:id/status
Headers: Authorization: Bearer <token>

Body:
{
  "status": "PREPARING",
  "notes": "Started cooking"
}
```

### Cancel Order
```
PUT /api/orders/:id/cancel
Headers: Authorization: Bearer <token>

Body:
{
  "reason": "Customer requested"
}
```

### Get Orders by Table
```
GET /api/orders/table/:tableId
Headers: Authorization: Bearer <token>
```

---

## WebSocket Events

### Connection
```javascript
const socket = io("http://localhost:5000");
socket.emit("authenticate", {
  id: "user-xxx",
  email: "user@example.com",
  role: "KITCHEN"
});
```

### Events to Listen

**New Order (Kitchen)**
```javascript
socket.on("order:new", (order) => {
  // Display on kitchen display system
});
```

**Order Status Updated (Waiters)**
```javascript
socket.on("order:updated", (data) => {
  // data = { orderId, status, timestamp }
  // Update waiter dashboard
});
```

**Table Updated**
```javascript
socket.on("table:changed", (table) => {
  // Update table status
});
```

**Payment Completed**
```javascript
socket.on("payment:success", (payment) => {
  // Close order
});
```

### Join Room
```javascript
socket.emit("join:room", "kitchen");   // For kitchen staff
socket.emit("join:room", "waiters");   // For waiters
socket.emit("join:room", "managers");  // For managers
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| NOT_AUTHENTICATED | 401 | Token not provided |
| INVALID_TOKEN | 401 | Invalid or expired token |
| INSUFFICIENT_PERMISSIONS | 403 | User role not allowed |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE | 409 | Resource already exists |
| VALIDATION_ERROR | 400 | Invalid request data |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

- Limit: 100 requests per 15 minutes per IP
- Returns 429 (Too Many Requests) when exceeded

---

## Pagination

For list endpoints:
- `limit`: Items per page (default: 50)
- `offset`: Starting position (default: 0)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "pages": 25
  }
}
```

---

## Examples

### Complete Order Flow

```bash
# 1. Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "DINE_IN",
    "tableId": "table-1",
    "items": [{
      "menuItemId": "item-123",
      "quantity": 2
    }]
  }'

# Response: { "id": "order-abc", "status": "PENDING" }

# 2. Update to preparing
curl -X PUT http://localhost:5000/api/orders/order-abc/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PREPARING"}'

# 3. Update to ready
curl -X PUT http://localhost:5000/api/orders/order-abc/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "READY"}'

# 4. Get order details
curl http://localhost:5000/api/orders/order-abc \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Collection

Import this collection URL:
```
https://www.postman.com/collections/restaurant-system
```

Or create manually from endpoints above.
