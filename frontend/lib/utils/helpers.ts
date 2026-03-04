export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

/* =========================================
   Currency & Date
========================================= */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =========================================
   Status Types
========================================= */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "gray";

/* =========================================
   Tailwind Color Classes (Keep Existing)
========================================= */

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PREPARING: "bg-purple-100 text-purple-800",
    READY: "bg-green-100 text-green-800",
    SERVED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
};

/* =========================================
   STRICT Badge Variant Mapping (NEW)
========================================= */

export const getBadgeVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "CONFIRMED":
      return "primary";
    case "PREPARING":
      return "primary";
    case "READY":
      return "success";
    case "SERVED":
      return "gray";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "gray";
  }
};

/* =========================================
   Labels
========================================= */

export const getOrderTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    DINE_IN: "Dine In",
    TAKEAWAY: "Takeaway",
    DELIVERY: "Delivery",
  };
  return labels[type] || type;
};

export const getStatusLabel = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};
