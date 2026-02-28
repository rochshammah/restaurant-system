import { Request, Response } from "express";
import analyticsService from "../services/analytics.service";
import { asyncHandler } from "../utils/errors";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await analyticsService.getDashboardStats();
    res.json({ success: true, data: stats });
  }
);

export const getPopularItems = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const items = await analyticsService.getPopularItems(limit);
    res.json({ success: true, data: items });
  }
);

export const getOrdersPerHour = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await analyticsService.getOrdersPerHour();
    res.json({ success: true, data });
  }
);

export const getRevenueByDay = asyncHandler(
  async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 7;
    const data = await analyticsService.getRevenueByDay(days);
    res.json({ success: true, data });
  }
);

export const getOrdersByType = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await analyticsService.getOrdersByType();
    res.json({ success: true, data });
  }
);

export const getAverageOrderValue = asyncHandler(
  async (req: Request, res: Response) => {
    const aov = await analyticsService.getAverageOrderValue();
    res.json({ success: true, data: { averageOrderValue: aov } });
  }
);

export const getOrderCompletionRate = asyncHandler(
  async (req: Request, res: Response) => {
    const rate = await analyticsService.getOrderCompletionRate();
    res.json({ success: true, data: { completionRate: rate } });
  }
);
