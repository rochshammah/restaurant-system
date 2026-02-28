import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Restaurant System",
  description: "Complete Restaurant Order Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
