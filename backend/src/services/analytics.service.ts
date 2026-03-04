import { PrismaClient, Prisma } from "@prisma/client";
import { OrderStatus } from "../types";

const prisma = new PrismaClient();

export class AnalyticsService {
  async getDashboardStats() {
    // Total orders
    const totalOrders = await prisma.order.count();

    // Completed orders today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completedToday = await prisma.order.count({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Revenue calculations
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todayRevenue = payments.reduce(
      (sum: number, p: any) => sum + Number(p.amount) - Number(p.refundedAmount),
      0
    );

    // Active orders
    const activeOrders = await prisma.order.count({
      where: {
        status: {
          in: [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
          ],
        },
      },
    });

    return {
      totalOrders,
      completedToday,
      todayRevenue,
      activeOrders,
    };
  }

  async getPopularItems(limit = 10) {
    const items = await prisma.menuItem.findMany({
      include: {
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    const ranked = items
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        orders: item.orderItems.length,
        totalQuantity: item.orderItems.reduce((sum: number, oi: any) => sum + oi.quantity, 0),
        revenue: Number(item.price) *
          item.orderItems.reduce((sum: number, oi: any) => sum + oi.quantity, 0),
      }))
      .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);

    return ranked;
  }

  async getOrdersPerHour() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const hourly: Record<number, number> = {};

    for (let i = 0; i < 24; i++) {
      hourly[i] = 0;
    }

    orders.forEach((order: any) => {
      const hour = new Date(order.createdAt).getHours();
      hourly[hour]++;
    });

    return Object.entries(hourly).map(([hour, count]) => ({
      hour: `${String(hour).padStart(2, "0")}:00`,
      orders: count,
    }));
  }

  async getRevenueByDay(days = 7) {
    const data: Record<string, number> = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const payments = await prisma.payment.findMany({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      const revenue = payments.reduce(
        (sum: number, p: any) => sum + Number(p.amount) - Number(p.refundedAmount),
        0
      );

      const dateStr = date.toISOString().split("T")[0];
      data[dateStr] = revenue;
    }

    return Object.entries(data).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  async getOrdersByType() {
    const dineIn = await prisma.order.count({
      where: { type: "DINE_IN" },
    });

    const takeaway = await prisma.order.count({
      where: { type: "TAKEAWAY" },
    });

    const delivery = await prisma.order.count({
      where: { type: "DELIVERY" },
    });

    return {
      dineIn,
      takeaway,
      delivery,
    };
  }

  async getAverageOrderValue() {
    const payments = await prisma.payment.findMany({
      where: {
        status: "COMPLETED",
      },
    });

    if (payments.length === 0) return 0;

    const total = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    return total / payments.length;
  }

  async getOrderCompletionRate() {
    const totalOrders = await prisma.order.count();
    const completedOrders = await prisma.order.count({
      where: { status: OrderStatus.COMPLETED },
    });

    if (totalOrders === 0) return 0;
    return (completedOrders / totalOrders) * 100;
  }
}

export default new AnalyticsService();
