import { Request, Response } from "express";
import MenuService from "../services/menu.service";
import { asyncHandler, sendSuccess, ApiError } from "../utils/errors";

export const menuController = {
  // Category operations
  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const { name, description, image } = req.body;

    if (!name) {
      throw new ApiError(400, "Category name is required", "MISSING_NAME");
    }

    const category = await MenuService.createCategory({
      name,
      description,
      image,
    });

    sendSuccess(res, 201, "Category created successfully", category);
  }),

  getCategories: asyncHandler(async (req: Request, res: Response) => {
    const categories = await MenuService.getCategories();
    sendSuccess(res, 200, "Categories fetched successfully", categories);
  }),

  getCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await MenuService.getCategoryById(id);

    sendSuccess(res, 200, "Category fetched successfully", category);
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, image, position, isActive } = req.body;

    const category = await MenuService.updateCategory(id, {
      name,
      description,
      image,
      position,
      isActive,
    });

    sendSuccess(res, 200, "Category updated successfully", category);
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MenuService.deleteCategory(id);

    sendSuccess(res, 200, result.message, null);
  }),

  // Menu item operations
  createMenuItem: asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, categoryId, image, preparationTime } =
      req.body;

    if (!name || !price || !categoryId) {
      throw new ApiError(
        400,
        "Missing required fields",
        "MISSING_FIELDS"
      );
    }

    const item = await MenuService.createMenuItem({
      name,
      description,
      price: parseFloat(price),
      categoryId,
      image,
      preparationTime,
    });

    sendSuccess(res, 201, "Menu item created successfully", item);
  }),

  getMenuItems: asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.query;
    const items = await MenuService.getMenuItems(categoryId as string);

    sendSuccess(res, 200, "Menu items fetched successfully", items);
  }),

  getFullMenu: asyncHandler(async (req: Request, res: Response) => {
    const menu = await MenuService.getFullMenu();
    sendSuccess(res, 200, "Full menu fetched successfully", menu);
  }),

  getMenuItemById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await MenuService.getMenuItemById(id);

    sendSuccess(res, 200, "Menu item fetched successfully", item);
  }),

  updateMenuItem: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, image, preparationTime, isAvailable } =
      req.body;

    const item = await MenuService.updateMenuItem(id, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      image,
      preparationTime,
      isAvailable,
    });

    sendSuccess(res, 200, "Menu item updated successfully", item);
  }),

  deleteMenuItem: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MenuService.deleteMenuItem(id);

    sendSuccess(res, 200, result.message, null);
  }),

  searchMenuItems: asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      throw new ApiError(400, "Search query is required", "MISSING_QUERY");
    }

    const items = await MenuService.searchMenuItems(q as string);
    sendSuccess(res, 200, "Search results", items);
  }),

  // Variant operations
  createVariant: asyncHandler(async (req: Request, res: Response) => {
    const { name, value, priceModifier, menuItemId } = req.body;

    if (!name || !value || !menuItemId) {
      throw new ApiError(400, "Missing required fields", "MISSING_FIELDS");
    }

    const variant = await MenuService.createVariant({
      name,
      value,
      priceModifier: priceModifier ? parseFloat(priceModifier) : 0,
      menuItemId,
    });

    sendSuccess(res, 201, "Variant created successfully", variant);
  }),

  getVariantsByItem: asyncHandler(async (req: Request, res: Response) => {
    const { menuItemId } = req.params;
    const variants = await MenuService.getVariantsByItem(menuItemId);

    sendSuccess(res, 200, "Variants fetched successfully", variants);
  }),

  deleteVariant: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MenuService.deleteVariant(id);

    sendSuccess(res, 200, result.message, null);
  }),
};
