import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export class MenuService {
  // Category operations
  async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
  }) {
    const category = await prisma.menuCategory.create({
      data,
    });

    return category;
  }

  async getCategories() {
    return prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isAvailable: true },
        },
      },
      orderBy: { position: "asc" },
    });
  }

  async getCategoryById(id: string) {
    const category = await prisma.menuCategory.findUnique({
      where: { id },
      include: {
        items: {
          where: { isAvailable: true },
        },
      },
    });

    if (!category) {
      throw new ApiError(404, "Category not found", "CATEGORY_NOT_FOUND");
    }

    return category;
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      position?: number;
      isActive?: boolean;
    }
  ) {
    const category = await prisma.menuCategory.update({
      where: { id },
      data,
    });

    return category;
  }

  async deleteCategory(id: string) {
    await prisma.menuCategory.delete({
      where: { id },
    });

    return { message: "Category deleted successfully" };
  }

  // Menu item operations
  async createMenuItem(data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    image?: string;
    preparationTime?: number;
  }) {
    // Verify category exists
    const category = await prisma.menuCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError(404, "Category not found", "CATEGORY_NOT_FOUND");
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image,
        preparationTime: data.preparationTime || 15,
      },
    });

    return menuItem;
  }

  async getMenuItems(categoryId?: string) {
    return prisma.menuItem.findMany({
      where: {
        ...(categoryId && { categoryId }),
        isAvailable: true,
      },
      include: {
        category: true,
        variants: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async getMenuItemById(id: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!item) {
      throw new ApiError(404, "Menu item not found", "ITEM_NOT_FOUND");
    }

    return item;
  }

  async updateMenuItem(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      preparationTime?: number;
      isAvailable?: boolean;
    }
  ) {
    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: true,
      },
    });

    return item;
  }

  async deleteMenuItem(id: string) {
    await prisma.menuItem.delete({
      where: { id },
    });

    return { message: "Menu item deleted successfully" };
  }

  // Variant operations
  async createVariant(data: {
    name: string;
    value: string;
    priceModifier?: number;
    menuItemId: string;
  }) {
    // Verify menu item exists
    const item = await prisma.menuItem.findUnique({
      where: { id: data.menuItemId },
    });

    if (!item) {
      throw new ApiError(404, "Menu item not found", "ITEM_NOT_FOUND");
    }

    const variant = await prisma.menuVariant.create({
      data: {
        name: data.name,
        value: data.value,
        priceModifier: data.priceModifier || 0,
        menuItemId: data.menuItemId,
      },
    });

    return variant;
  }

  async getVariantsByItem(menuItemId: string) {
    return prisma.menuVariant.findMany({
      where: { menuItemId },
    });
  }

  async deleteVariant(id: string) {
    await prisma.menuVariant.delete({
      where: { id },
    });

    return { message: "Variant deleted successfully" };
  }

  // Full menu retrieval (for POS/customers)
  async getFullMenu() {
    return prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isAvailable: true },
          include: {
            variants: true,
          },
        },
      },
      orderBy: { position: "asc" },
    });
  }

  // Search menu items
  async searchMenuItems(query: string) {
    return prisma.menuItem.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        isAvailable: true,
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }
}

export default new MenuService();
