import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";
import { OrderStatus } from "../types";

const prisma = new PrismaClient();

export class PaymentService {
  async createPayment(data: {
    orderId: string;
    amount: number;
    method: string;
    processedByUserId: string;
    transactionId?: string;
  }) {
    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Check payment doesn't already exist
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: data.orderId },
    });

    if (existingPayment) {
      throw new ApiError(400, "Payment already exists for this order", "PAYMENT_EXISTS");
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: "COMPLETED",
        processedByUserId: data.processedByUserId,
        transactionId: data.transactionId,
        receiptNumber: `REC-${Date.now()}`,
      },
      include: {
        processedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Update order status to COMPLETED
    await prisma.order.update({
      where: { id: data.orderId },
      data: { status: OrderStatus.COMPLETED },
    });

    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: {
        processedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return payment;
  }

  async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        processedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!payment) {
      throw new ApiError(404, "Payment not found", "PAYMENT_NOT_FOUND");
    }

    return payment;
  }

  async getAllPayments(limit = 50, offset = 0) {
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip: offset,
        take: limit,
        include: {
          processedByUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.count(),
    ]);

    return { payments, total, limit, offset };
  }

  async refundPayment(id: string, refundAmount: number, reason: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new ApiError(404, "Payment not found", "PAYMENT_NOT_FOUND");
    }

    if (refundAmount > payment.amount) {
      throw new ApiError(
        400,
        "Refund amount exceeds payment amount",
        "INVALID_REFUND_AMOUNT"
      );
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: refundAmount === payment.amount ? "REFUNDED" : "COMPLETED",
        refundedAmount: payment.refundedAmount + refundAmount,
        refundReason: reason,
      },
      include: {
        processedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updatedPayment;
  }

  async getDailyRevenue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const payments = await prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const totalRefunds = payments.reduce((sum: number, p: any) => sum + Number(p.refundedAmount), 0);

    return {
      totalRevenue: totalRevenue - totalRefunds,
      totalTransactions: payments.length,
      totalRefunds,
      date: today.toISOString().split("T")[0],
    };
  }
}

export default new PaymentService();
