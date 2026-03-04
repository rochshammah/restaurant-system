'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useGetFullMenu } from "@/lib/hooks/useApi";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardBody } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { CardSkeleton } from "@/components/common/Skeleton";
import { formatCurrency } from "@/lib/utils/helpers";

export default function MenuPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: menuData, isLoading } = useGetFullMenu();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <CardSkeleton key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const categories = menuData?.data || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Menu Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage menu items and categories
            </p>
          </div>
          <Button variant="primary">Add Item</Button>
        </div>

        {categories.map((category: any) => (
          <div key={category.id}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items?.map((item: any) => (
                <Card key={item.id}>
                  {item.image && (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardBody>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {formatCurrency(Number(item.price))}
                      </span>
                      <Badge variant={item.isAvailable ? "success" : "danger"}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      ⏱ {item.preparationTime}m prep time
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
