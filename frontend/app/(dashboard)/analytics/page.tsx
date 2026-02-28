'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardBody, CardHeader } from "@/components/common/Card";

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Reporting
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View business metrics and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                $12,450
              </p>
              <p className="text-sm text-green-600 mt-2">↑ 15% from last week</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                342
              </p>
              <p className="text-sm text-green-600 mt-2">↑ 8% from last week</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Order Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                $36.40
              </p>
              <p className="text-sm text-green-600 mt-2">↑ 3% from last week</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                98.5%
              </p>
              <p className="text-sm text-green-600 mt-2">↑ 2% from last week</p>
            </CardBody>
          </Card>
        </div>

        {/* Charts Coming Soon */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Trend
            </h2>
          </CardHeader>
          <CardBody className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Chart will be displayed here</p>
          </CardBody>
        </Card>

        {/* Popular Items */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Items
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { name: "Chicken Parmesan", orders: 124, revenue: "$1,857" },
                { name: "Spaghetti Carbonara", orders: 98, revenue: "$1,568" },
                { name: "Bruschetta", orders: 87, revenue: "$783" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.orders} orders
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.revenue}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
