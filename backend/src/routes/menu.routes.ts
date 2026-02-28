import { Router } from "express";
import { menuController } from "../controllers/menu.controller";
import { authenticate, isAdmin } from "../middlewares/auth";

const router = Router();

// Public menu routes
router.get("/full", menuController.getFullMenu);
router.get("/search", menuController.searchMenuItems);

// Protected admin routes for management
// Categories
router.post(
  "/categories",
  authenticate,
  isAdmin,
  menuController.createCategory
);
router.get("/categories", menuController.getCategories);
router.get("/categories/:id", menuController.getCategoryById);
router.put(
  "/categories/:id",
  authenticate,
  isAdmin,
  menuController.updateCategory
);
router.delete(
  "/categories/:id",
  authenticate,
  isAdmin,
  menuController.deleteCategory
);

// Menu items
router.post("/items", authenticate, isAdmin, menuController.createMenuItem);
router.get("/items", menuController.getMenuItems);
router.get("/items/:id", menuController.getMenuItemById);
router.put("/items/:id", authenticate, isAdmin, menuController.updateMenuItem);
router.delete("/items/:id", authenticate, isAdmin, menuController.deleteMenuItem);

// Variants
router.post(
  "/variants",
  authenticate,
  isAdmin,
  menuController.createVariant
);
router.get("/variants/:menuItemId", menuController.getVariantsByItem);
router.delete(
  "/variants/:id",
  authenticate,
  isAdmin,
  menuController.deleteVariant
);

export default router;
