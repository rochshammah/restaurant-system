import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import { asyncHandler } from "../utils/errors";
import { IAuthRequest } from "../types";

export const createPayment = asyncHandler(
  async (req: IAuthRequest, res: Response) => {
    const { orderId, amount, method, transactionId } = req.body;

    const payment = await paymentService.createPayment({
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
    const payment = await paymentService.getPaymentByOrderId(req.params.orderId);
    res.json({ success: true, data: payment });
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json({ success: true, data: payment });
  }
);

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await paymentService.getAllPayments(limit, offset);
    res.json({ success: true, data: result });
  }
);

export const refundPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { refundAmount, reason } = req.body;
    const payment = await paymentService.refundPayment(
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
