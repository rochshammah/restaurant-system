'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils/helpers";
import { UserRole } from "@/lib/types";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "📊",
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITER],
  },
  {
    href: "/orders",
    label: "Orders",
    icon: "📋",
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITER],
  },
  {
    href: "/kitchen",
    label: "Kitchen Display",
    icon: "👨‍🍳",
    roles: [UserRole.KITCHEN],
  },
  {
    href: "/menu",
    label: "Menu Management",
    icon: "🍽️",
    roles: [UserRole.ADMIN],
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: "📈",
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "⚙️",
    roles: [UserRole.ADMIN],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user.role as UserRole)
  );

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Menu
        </h2>
      </div>

      <nav className="space-y-1 px-3">
        {filteredItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors dark:text-gray-300 dark:hover:bg-gray-700",
              pathname.startsWith(item.href) &&
                "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
