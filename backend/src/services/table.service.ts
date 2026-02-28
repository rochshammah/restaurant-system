import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export class TableService {
  async getAllTables() {
    return prisma.table.findMany({
      include: {
        currentOrder: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { tableNumber: "asc" },
    });
  }

  async getTableById(id: string) {
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        currentOrder: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!table) {
      throw new ApiError(404, "Table not found", "TABLE_NOT_FOUND");
    }

    return table;
  }

  async updateTableStatus(id: string, status: string) {
    const table = await prisma.table.update({
      where: { id },
      data: { status },
      include: {
        currentOrder: true,
      },
    });

    return table;
  }

  async assignOrderToTable(tableId: string, orderId: string) {
    const [table, order] = await Promise.all([
      prisma.table.findUnique({ where: { id: tableId } }),
      prisma.order.findUnique({ where: { id: orderId } }),
    ]);

    if (!table) {
      throw new ApiError(404, "Table not found", "TABLE_NOT_FOUND");
    }

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    await prisma.table.update({
      where: { id: tableId },
      data: {
        currentOrderId: orderId,
        status: "OCCUPIED",
      },
    });

    return table;
  }

  async releaseTable(tableId: string) {
    return prisma.table.update({
      where: { id: tableId },
      data: {
        currentOrderId: null,
        status: "AVAILABLE",
      },
    });
  }

  async getTablesByStatus(status: string) {
    return prisma.table.findMany({
      where: { status },
      include: {
        currentOrder: true,
      },
    });
  }
}

export default new TableService();
