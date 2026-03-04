'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { getStatusLabel } from "@/lib/utils/helpers";

export default function KitchenPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  // Mock active orders for KDS
  const activeOrders = [
    {
      id: "1",
      orderNumber: "ORD-000123",
      items: [
        { name: "Chicken Parmesan", quantity: 2, specialNotes: "Extra cheese" },
        { name: "Spaghetti Carbonara", quantity: 1, specialNotes: "" },
      ],
      status: "PREPARING",
      createdAt: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "2",
      orderNumber: "ORD-000124",
      items: [
        { name: "Bruschetta", quantity: 3, specialNotes: "" },
        { name: "Calamari Fritti", quantity: 2, specialNotes: "No lemon" },
      ],
      status: "PENDING",
      createdAt: new Date(Date.now() - 2 * 60000),
    },
  ];

  const getTimeDisplay = (createdAt: Date) => {
    const minutes = Math.floor(
      (Date.now() - createdAt.getTime()) / 1000 / 60
    );
    return `${minutes} min`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      READY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[status] || "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kitchen Display System
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>

        {/* Active Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeOrders.map((order) => (
            <Card key={order.id} className="border-2 border-gray-300 dark:border-gray-600">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </h2>
                  <div className="text-right">
                    <Badge variant={order.status === "PENDING" ? "warning" : "primary"}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {getTimeDisplay(order.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-primary-600 pl-4 py-2"
                    >
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {item.quantity}x {item.name}
                      </h3>
                      {item.specialNotes && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                          📝 {item.specialNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  {order.status === "PENDING" && (
                    <Button variant="primary" className="flex-1">
                      Start Preparing
                    </Button>
                  )}
                  {order.status === "PREPARING" && (
                    <Button variant="primary" className="flex-1">
                      Mark as Ready
                    </Button>
                  )}
                  <Button variant="danger" className="flex-1">
                    Cancel Order
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {activeOrders.length === 0 && (
          <Card>
            <CardBody className="text-center py-16">
              <p className="text-2xl text-gray-600 dark:text-gray-400">
                ✨ No active orders
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                All caught up!
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
