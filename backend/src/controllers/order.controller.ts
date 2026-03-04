import { Request, Response } from "express";
import OrderService from "../services/order.service";
import { asyncHandler, sendSuccess, ApiError } from "../utils/errors";
import { OrderStatus, OrderType } from "../types";

export const orderController = {
  createOrder: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
    }

    const { type, tableId, items, customerName, customerPhone, customerEmail, deliveryAddress, specialInstructions } =
      req.body;

    if (!type || !items || items.length === 0) {
      throw new ApiError(400, "Invalid order data", "INVALID_ORDER");
    }

    const order = await OrderService.createOrder({
      type,
      tableId,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items,
      specialInstructions,
      createdByUserId: req.user.id,
    });

    sendSuccess(res, 201, "Order created successfully", order);
  }),

  getOrderById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);

    sendSuccess(res, 200, "Order fetched successfully", order);
  }),

  getAllOrders: asyncHandler(async (req: Request, res: Response) => {
    const { status, type, tableId, limit = 50, offset = 0 } = req.query;

    const filters: any = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    };

    if (status) filters.status = status as OrderStatus;
    if (type) filters.type = type as OrderType;
    if (tableId) filters.tableId = tableId as string;

    const result = await OrderService.getAllOrders(filters);
    sendSuccess(res, 200, "Orders fetched successfully", result);
  }),

  updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      throw new ApiError(400, "Status is required", "MISSING_STATUS");
    }

    const order = await OrderService.updateOrderStatus(
      id,
      status as OrderStatus,
      req.user.id,
      notes
    );

    sendSuccess(res, 200, "Order status updated successfully", order);
  }),

  cancelOrder: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
    }

    const { id } = req.params;
    const { reason } = req.body;

    const order = await OrderService.cancelOrder(id, req.user.id, reason);
    sendSuccess(res, 200, "Order cancelled successfully", order);
  }),

  getOrdersByTable: asyncHandler(async (req: Request, res: Response) => {
    const { tableId } = req.params;
    const orders = await OrderService.getOrdersByTable(tableId);

    sendSuccess(res, 200, "Orders fetched successfully", orders);
  }),
};
