'use client';

import React from "react";
import { cn } from "@/lib/utils/helpers";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Alert = ({
  variant = "info",
  title,
  description,
  onClose,
  className,
  children,
}: AlertProps) => {
  const variants = {
    info: "bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200",
    success:
      "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200",
    warning:
      "bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200",
    error:
      "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200",
  };

  const icons = {
    info: "ℹ",
    success: "✓",
    warning: "⚠",
    error: "✕",
  };

  return (
    <div className={cn("rounded-lg p-4", variants[variant], className)}>
      <div className="flex items-start">
        <span className="mr-3 text-lg">{icons[variant]}</span>
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {description && <p className="text-sm">{description}</p>}
          {children && <div className="text-sm">{children}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-lg opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
