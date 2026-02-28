'use client';

import { cn } from "@/lib/utils/helpers";

interface BadgeProps {
  variant?: "primary" | "success" | "warning" | "danger" | "gray";
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({
  variant = "primary",
  children,
  className,
}: BadgeProps) => {
  const variants = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
    success: "bg-success-50 text-success-700 dark:bg-success-900 dark:text-success-200",
    warning: "bg-warning-50 text-warning-700 dark:bg-warning-900 dark:text-warning-200",
    danger: "bg-danger-50 text-danger-700 dark:bg-danger-900 dark:text-danger-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
