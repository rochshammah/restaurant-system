import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../types";
import * as analyticsController from "../controllers/analytics.controller";

const router = Router();

// All routes require authentication and manager+ role
router.use(authenticate);
router.use(authorize(UserRole.MANAGER, UserRole.ADMIN));

// Dashboard metrics
router.get("/dashboard/stats", analyticsController.getDashboardStats);

// Popular items
router.get("/items/popular", analyticsController.getPopularItems);

// Orders per hour
router.get("/orders/hourly", analyticsController.getOrdersPerHour);

// Revenue by day
router.get("/revenue/daily", analyticsController.getRevenueByDay);

// Orders by type (dine-in, takeaway, delivery)
router.get("/orders/by-type", analyticsController.getOrdersByType);

// Average order value
router.get("/metrics/aov", analyticsController.getAverageOrderValue);

// Order completion rate
router.get("/metrics/completion-rate", analyticsController.getOrderCompletionRate);

export default router;
