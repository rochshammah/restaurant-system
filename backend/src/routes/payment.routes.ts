import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../types";
import * as paymentController from "../controllers/payment.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get dashboard stats - daily revenue (Manager, Admin)
router.get("/daily-revenue", authorize(UserRole.MANAGER, UserRole.ADMIN), paymentController.getDailyRevenue);

// Get all payments (Manager, Admin)
router.get("/", authorize(UserRole.MANAGER, UserRole.ADMIN), paymentController.getAllPayments);

// Create payment (Waiter, Manager, Admin)
router.post("/", authorize(UserRole.WAITER, UserRole.MANAGER, UserRole.ADMIN), paymentController.createPayment);

// Get payment by order ID
router.get("/order/:orderId", paymentController.getPaymentByOrderId);

// Get payment by ID
router.get("/:id", paymentController.getPaymentById);

// Refund payment (Manager, Admin)
router.post("/:id/refund", authorize(UserRole.MANAGER, UserRole.ADMIN), paymentController.refundPayment);

export default router;
