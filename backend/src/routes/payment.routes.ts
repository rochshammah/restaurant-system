import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import * as paymentController from "../controllers/payment.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get dashboard stats - daily revenue (Manager, Admin)
router.get("/daily-revenue", authorize(["MANAGER", "ADMIN"]), paymentController.getDailyRevenue);

// Get all payments (Manager, Admin)
router.get("/", authorize(["MANAGER", "ADMIN"]), paymentController.getAllPayments);

// Create payment (Waiter, Manager, Admin)
router.post("/", authorize(["WAITER", "MANAGER", "ADMIN"]), paymentController.createPayment);

// Get payment by order ID
router.get("/order/:orderId", paymentController.getPaymentByOrderId);

// Get payment by ID
router.get("/:id", paymentController.getPaymentById);

// Refund payment (Manager, Admin)
router.post("/:id/refund", authorize(["MANAGER", "ADMIN"]), paymentController.refundPayment);

export default router;
