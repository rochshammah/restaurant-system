import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api";

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => apiClient.register(email, password, name),
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.getMe(),
  });
};

// Menu hooks
export const useGetFullMenu = () => {
  return useQuery({
    queryKey: ["menu", "full"],
    queryFn: () => apiClient.getFullMenu(),
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["menu", "categories"],
    queryFn: () => apiClient.getCategories(),
  });
};

export const useGetMenuItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ["menu", "items", categoryId],
    queryFn: () => apiClient.getMenuItems(categoryId),
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient.createMenuItem(
        data.name,
        data.price,
        data.categoryId,
        data.description,
        data.image,
        data.preparationTime
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });
};

// Order hooks
export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.getAllOrders(),
  });
};

export const useGetOrderById = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => apiClient.getOrderById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.updateOrderStatus(data.id, data.status, data.notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
