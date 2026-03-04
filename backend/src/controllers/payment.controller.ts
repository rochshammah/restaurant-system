import { Request, Response } from "express";
import PaymentService from "../services/payment.service";
import { asyncHandler, sendSuccess, ApiError } from "../utils/errors";

export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, amount, method, transactionId } = req.body;

    const payment = await PaymentService.createPayment({
      orderId,
      amount,
      method,
      transactionId,
      processedByUserId: req.user!.id,
    });

    res.status(201).json({ success: true, data: payment });
  }
);

export const getPaymentByOrderId = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await PaymentService.getPaymentByOrderId(req.params.orderId);
    res.json({ success: true, data: payment });
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await PaymentService.getPaymentById(req.params.id);
    res.json({ success: true, data: payment });
  }
);

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await PaymentService.getAllPayments(limit, offset);
    res.json({ success: true, data: result });
  }
);

export const refundPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { refundAmount, reason } = req.body;
    const payment = await PaymentService.refundPayment(
      req.params.id,
      refundAmount,
      reason
    );
    res.json({ success: true, data: payment });
  }
);

export const getDailyRevenue = asyncHandler(
  async (req: Request, res: Response) => {
    const revenue = await paymentService.getDailyRevenue();
    res.json({ success: true, data: revenue });
  }
);
