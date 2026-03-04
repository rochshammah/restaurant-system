'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useGetAllOrders } from "@/lib/hooks/useApi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardBody } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { CardSkeleton } from "@/components/common/Skeleton";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils/helpers";

/* =========================
   Type Definitions
========================= */

type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
}

interface OrdersResponse {
  data?: {
    orders?: Order[];
  };
}

/* =========================
   Component
========================= */

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, isLoading } = useGetAllOrders() as {
    data?: OrdersResponse;
    isLoading: boolean;
  };

  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const orders: Order[] = data?.data?.orders ?? [];

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all orders
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === null
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            All ({orders.length})
          </button>

          {(["PENDING", "PREPARING", "READY", "COMPLETED"] as OrderStatus[]).map(
            (status) => {
              const count = orders.filter(
                (order) => order.status === status
              ).length;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {getStatusLabel(status)} ({count})
                </button>
              );
            }
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8 text-gray-500">
                No orders found
              </CardBody>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Order Number */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Order Number
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </p>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Amount
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    {/* Status (Dynamic Color) */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </p>
                      <Badge
                        variant={getStatusColor(order.status)}
                        className="mt-1"
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>

                    {/* Items Count */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Items
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.items?.length ?? 0}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
