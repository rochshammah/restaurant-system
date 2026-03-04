import axios, { AxiosInstance } from "axios";
import { ApiResponse, AuthResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error.response?.data || error);
      }
    );

    // Load token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  // ============================================================================
  // AUTH ENDPOINTS
  // ============================================================================

  async register(email: string, password: string, name: string) {
    return this.client.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      { email, password, name }
    );
  }

  async login(email: string, password: string) {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      { email, password }
    );
    if (response.data?.data?.token) {
      this.setToken(response.data.data.token);
    }
    return response;
  }

  async getMe() {
    return this.client.get<ApiResponse>("/api/auth/me");
  }

  async getAllUsers(limit = 50, offset = 0) {
    return this.client.get<ApiResponse>("/api/auth/users", {
      params: { limit, offset },
    });
  }

  async updateUser(id: string, data: any) {
    return this.client.put<ApiResponse>(`/api/auth/users/${id}`, data);
  }

  async deleteUser(id: string) {
    return this.client.delete<ApiResponse>(`/api/auth/users/${id}`);
  }

  // ============================================================================
  // MENU ENDPOINTS
  // ============================================================================

  async getFullMenu() {
    return this.client.get<ApiResponse>("/api/menu/full");
  }

  async getCategories() {
    return this.client.get<ApiResponse>("/api/menu/categories");
  }

  async getCategoryById(id: string) {
    return this.client.get<ApiResponse>(`/api/menu/categories/${id}`);
  }

  async createCategory(name: string, description?: string, image?: string) {
    return this.client.post<ApiResponse>("/api/menu/categories", {
      name,
      description,
      image,
    });
  }

  async updateCategory(
    id: string,
    name?: string,
    description?: string,
    image?: string,
    position?: number,
    isActive?: boolean
  ) {
    return this.client.put<ApiResponse>(`/api/menu/categories/${id}`, {
      name,
      description,
      image,
      position,
      isActive,
    });
  }

  async deleteCategory(id: string) {
    return this.client.delete<ApiResponse>(`/api/menu/categories/${id}`);
  }

  async getMenuItems(categoryId?: string) {
    return this.client.get<ApiResponse>("/api/menu/items", {
      params: { categoryId },
    });
  }

  async getMenuItemById(id: string) {
    return this.client.get<ApiResponse>(`/api/menu/items/${id}`);
  }

  async createMenuItem(
    name: string,
    price: number,
    categoryId: string,
    description?: string,
    image?: string,
    preparationTime?: number
  ) {
    return this.client.post<ApiResponse>("/api/menu/items", {
      name,
      price,
      categoryId,
      description,
      image,
      preparationTime,
    });
  }

  async updateMenuItem(
    id: string,
    name?: string,
    price?: number,
    description?: string,
    image?: string,
    preparationTime?: number,
    isAvailable?: boolean
  ) {
    return this.client.put<ApiResponse>(`/api/menu/items/${id}`, {
      name,
      price,
      description,
      image,
      preparationTime,
      isAvailable,
    });
  }

  async deleteMenuItem(id: string) {
    return this.client.delete<ApiResponse>(`/api/menu/items/${id}`);
  }

  async searchMenuItems(query: string) {
    return this.client.get<ApiResponse>("/api/menu/search", {
      params: { q: query },
    });
  }

  // ============================================================================
  // ORDER ENDPOINTS
  // ============================================================================

  async createOrder(data: {
    type: string;
    tableId?: string;
    items: any[];
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    deliveryAddress?: string;
    specialInstructions?: string;
  }) {
    return this.client.post<ApiResponse>("/api/orders", data);
  }

  async getOrderById(id: string) {
    return this.client.get<ApiResponse>(`/api/orders/${id}`);
  }

  async getAllOrders(
    status?: string,
    type?: string,
    tableId?: string,
    limit = 50,
    offset = 0
  ) {
    return this.client.get<ApiResponse>("/api/orders", {
      params: { status, type, tableId, limit, offset },
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    notes?: string
  ) {
    return this.client.put<ApiResponse>(`/api/orders/${id}/status`, {
      status,
      notes,
    });
  }

  async cancelOrder(id: string, reason?: string) {
    return this.client.put<ApiResponse>(`/api/orders/${id}/cancel`, {
      reason,
    });
  }

  async getOrdersByTable(tableId: string) {
    return this.client.get<ApiResponse>(`/api/orders/table/${tableId}`);
  }
}

export const apiClient = new ApiClient();
