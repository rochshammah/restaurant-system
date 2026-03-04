import { PrismaClient, Prisma } from "@prisma/client";
import { ApiError } from "../utils/errors";
import { OrderStatus, OrderType } from "../types";

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(data: {
    type: OrderType;
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    deliveryAddress?: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      specialNotes?: string;
      variants?: string[];
    }>;
    specialInstructions?: string;
    createdByUserId: string;
  }) {
    // Generate order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });

    const nextNumber = lastOrder
      ? parseInt(lastOrder.orderNumber.split("-")[1]) + 1
      : 1;
    const orderNumber = `ORD-${String(nextNumber).padStart(6, "0")}`;

    // Validate table if dine-in
    if (data.type === OrderType.DINE_IN && data.tableId) {
      const table = await prisma.table.findUnique({
        where: { id: data.tableId },
      });

      if (!table) {
        throw new ApiError(404, "Table not found", "TABLE_NOT_FOUND");
      }
    }

    // Calculate totals
    let subtotal = 0;

    // Fetch menu items to calculate price
    const menuItemIds = data.items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      include: { variants: true },
    });

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        type: data.type,
        tableId: data.tableId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        deliveryAddress: data.deliveryAddress,
        specialInstructions: data.specialInstructions,
        createdByUserId: data.createdByUserId,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map((item: any) => {
            const menuItem = menuItems.find((m: any) => m.id === item.menuItemId);
            if (!menuItem) {
              throw new ApiError(404, "Menu item not found", "ITEM_NOT_FOUND");
            }

            const itemTotal = Number(menuItem.price) * item.quantity;
            subtotal += itemTotal;

            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: menuItem.price,
              specialNotes: item.specialNotes,
              variants: {
                create: item.variants
                  ? item.variants.map((variantId) => ({
                      variantId,
                    }))
                  : [],
              },
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
            variants: { include: { variant: true } },
          },
        },
        createdByUser: true,
        table: true,
      },
    });

    // Calculate tax and total (assuming 10% tax)
    const taxAmount = subtotal * 0.1;
    const totalAmount = subtotal + taxAmount;

    // Update order with calculated amounts
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        subtotal: subtotal,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
      },
      include: {
        items: {
          include: {
            menuItem: true,
            variants: { include: { variant: true } },
          },
        },
        table: true,
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updatedOrder;
  }

  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
            variants: { include: { variant: true } },
          },
        },
        table: true,
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
        updatedByUser: {
          select: { id: true, name: true, email: true },
        },
        timeline: {
          include: {
            changedByUser: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    return order;
  }

  async getAllOrders(
    filters?: {
      status?: OrderStatus;
      type?: OrderType;
      tableId?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type as any;
    if (filters?.tableId) where.tableId = filters.tableId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          table: true,
          createdByUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      limit,
      offset,
    };
  }

  async updateOrderStatus(
    id: string,
    newStatus: OrderStatus,
    changedByUserId: string,
    notes?: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Create timeline entry
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        oldStatus: order.status,
        newStatus,
        changedByUserId,
        notes,
      },
    });

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
        updatedByUserId: changedByUserId,
        ...(newStatus === OrderStatus.READY && {
          actualReadyTime: new Date(),
        }),
        ...(newStatus === OrderStatus.SERVED && {
          servedAt: new Date(),
        }),
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        timeline: {
          include: {
            changedByUser: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return updatedOrder;
  }

  async cancelOrder(id: string, changedByUserId: string, reason?: string) {
    return this.updateOrderStatus(
      id,
      OrderStatus.CANCELLED,
      changedByUserId,
      reason
    );
  }

  async getOrdersByTable(tableId: string) {
    return prisma.order.findMany({
      where: {
        tableId,
        status: {
          notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }
}

export default new OrderService();
