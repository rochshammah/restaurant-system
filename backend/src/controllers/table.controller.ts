import { Request, Response } from "express";
import tableService from "../services/table.service";
import { asyncHandler } from "../utils/errors";

export const getAllTables = asyncHandler(async (req: Request, res: Response) => {
  const tables = await tableService.getAllTables();
  res.json({ success: true, data: tables });
});

export const getTableById = asyncHandler(async (req: Request, res: Response) => {
  const table = await tableService.getTableById(req.params.id);
  res.json({ success: true, data: table });
});

export const updateTableStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const table = await tableService.updateTableStatus(req.params.id, status);
    res.json({ success: true, data: table });
  }
);

export const assignOrderToTable = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const table = await tableService.assignOrderToTable(req.params.id, orderId);
    res.json({ success: true, data: table });
  }
);

export const releaseTable = asyncHandler(async (req: Request, res: Response) => {
  const table = await tableService.releaseTable(req.params.id);
  res.json({ success: true, data: table });
});

export const getTablesByStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query;
    const tables = await tableService.getTablesByStatus(status as string);
    res.json({ success: true, data: tables });
  }
);
