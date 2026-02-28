import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../types";

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Create order (Waiter)
router.post(
  "/",
  authorize(UserRole.WAITER, UserRole.ADMIN),
  orderController.createOrder
);

// Get all orders
router.get("/", orderController.getAllOrders);

// Get order by ID
router.get("/:id", orderController.getOrderById);

// Update order status (Kitchen staff, Waiter, Admin)
router.put(
  "/:id/status",
  authorize(UserRole.KITCHEN, UserRole.WAITER, UserRole.ADMIN),
  orderController.updateOrderStatus
);

// Cancel order
router.put(
  "/:id/cancel",
  authorize(UserRole.WAITER, UserRole.ADMIN),
  orderController.cancelOrder
);

// Get orders by table
router.get("/table/:tableId", orderController.getOrdersByTable);

export default router;
