'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/lib/hooks/useApi";
import { useAuthStore } from "@/lib/store";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import { CardSkeleton } from "@/components/common/Skeleton";
import { formatCurrency } from "@/lib/utils/helpers";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { data: userData, isLoading } = useGetMe();

  useEffect(() => {
    if (userData?.data) {
      setUser(userData.data);
    }
  }, [userData, setUser]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                1,234
              </div>
              <div className="text-sm text-green-600 mt-2">
                ↑ 12% from last month
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Revenue Today
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(3450.50)}
              </div>
              <div className="text-sm text-green-600 mt-2">
                ↑ 8% from yesterday
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Orders
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                12
              </div>
              <div className="text-sm text-blue-600 mt-2">
                2 preparing, 5 ready
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Order Time
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                18m
              </div>
              <div className="text-sm text-green-600 mt-2">
                ↓ 2m from target
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8 text-gray-500">
              No recent orders to display
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
