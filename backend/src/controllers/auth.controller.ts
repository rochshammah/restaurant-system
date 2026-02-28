import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { asyncHandler, sendSuccess, ApiError } from "../utils/errors";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new ApiError(400, "Missing required fields", "MISSING_FIELDS");
    }

    const result = await AuthService.register(email, password, name);
    sendSuccess(res, 201, "User registered successfully", result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Missing email or password", "MISSING_FIELDS");
    }

    const result = await AuthService.login(email, password);
    sendSuccess(res, 200, "Login successful", result);
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
    }

    const user = await AuthService.getUserById(req.user.id);
    sendSuccess(res, 200, "User fetched successfully", user);
  }),

  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;
    const result = await AuthService.getAllUsers(
      parseInt(limit as string),
      parseInt(offset as string)
    );

    sendSuccess(res, 200, "Users fetched successfully", result);
  }),

  updateUser: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, avatar, role } = req.body;

    const user = await AuthService.updateUser(id, {
      name,
      email,
      avatar,
      role,
    });

    sendSuccess(res, 200, "User updated successfully", user);
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AuthService.deleteUser(id);

    sendSuccess(res, 200, result.message, null);
  }),
};
