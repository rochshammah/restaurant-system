import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate, authorize, isAdmin } from "../middlewares/auth";
import { UserRole } from "../types";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", authenticate, authController.getMe);

// Admin routes
router.get("/users", authenticate, isAdmin, authController.getAllUsers);
router.put("/users/:id", authenticate, isAdmin, authController.updateUser);
router.delete("/users/:id", authenticate, isAdmin, authController.deleteUser);

export default router;
