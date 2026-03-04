import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../types";
import * as tableController from "../controllers/table.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all tables
router.get("/", tableController.getAllTables);

// Get tables by status
router.get("/status", tableController.getTablesByStatus);

// Get specific table
router.get("/:id", tableController.getTableById);

// Update table status (Waiter, Admin)
router.patch("/:id/status", authorize(UserRole.WAITER, UserRole.ADMIN), tableController.updateTableStatus);

// Assign order to table (Waiter, Admin)
router.post("/:id/assign-order", authorize(UserRole.WAITER, UserRole.ADMIN), tableController.assignOrderToTable);

// Release table (Waiter, Admin)
router.post("/:id/release", authorize(UserRole.WAITER, UserRole.ADMIN), tableController.releaseTable);

export default router;
