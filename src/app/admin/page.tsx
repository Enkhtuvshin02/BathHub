"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  products: number;
  orders: number;
  pending: number;
  paid: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]).then(([products, orders]) => {
      setStats({
        products: products.length,
        orders: orders.length,
        pending: orders.filter((o: { status: string }) => o.status === "pending").length,
        paid: orders.filter((o: { status: string }) => o.status === "paid").length,
      });
    });
  }, []);

  const cards = [
    { label: "Нийт бүтээгдэхүүн", value: stats?.products, href: "/admin/products", color: "bg-blue-50 text-blue-700" },
    { label: "Нийт захиалга", value: stats?.orders, href: "/admin/orders", color: "bg-gray-50 text-gray-700" },
    { label: "Хүлээгдэж буй", value: stats?.pending, href: "/admin/orders?status=pending", color: "bg-yellow-50 text-yellow-700" },
    { label: "Төлөгдсөн", value: stats?.paid, href: "/admin/orders?status=paid", color: "bg-green-50 text-green-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`rounded-xl p-5 ${card.color} hover:opacity-80 transition-opacity`}
          >
            <div className="text-3xl font-bold mb-1">
              {stats === null ? "—" : card.value}
            </div>
            <div className="text-sm font-medium">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
