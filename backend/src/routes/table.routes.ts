import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
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
router.patch("/:id/status", authorize(["WAITER", "ADMIN"]), tableController.updateTableStatus);

// Assign order to table (Waiter, Admin)
router.post("/:id/assign-order", authorize(["WAITER", "ADMIN"]), tableController.assignOrderToTable);

// Release table (Waiter, Admin)
router.post("/:id/release", authorize(["WAITER", "ADMIN"]), tableController.releaseTable);

export default router;
