"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  custFirstName: string;
  custLastName: string;
  custPhone: string;
  paymentMethod: string | null;
  user: { email: string };
  items: { qty: number; product: { name: string } }[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  paid: "Төлөгдсөн",
  cancelled: "Цуцлагдсан",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrdersTable() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") ?? "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : "/api/admin/orders";
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, [statusFilter]);

  useEffect(load, [load]);

  const changeStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Захиалга</h1>
        <div className="flex gap-2 ml-4">
          {["", "pending", "paid", "cancelled"].map((s) => (
            <a
              key={s}
              href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s ? STATUS_LABELS[s] : "Бүгд"}
            </a>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Уншиж байна...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Захиалга №</th>
                <th className="px-4 py-3 font-medium text-gray-500">Хэрэглэгч</th>
                <th className="px-4 py-3 font-medium text-gray-500">Барааны тоо</th>
                <th className="px-4 py-3 font-medium text-gray-500">Нийт дүн</th>
                <th className="px-4 py-3 font-medium text-gray-500">Огноо</th>
                <th className="px-4 py-3 font-medium text-gray-500">Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{o.custLastName} {o.custFirstName}</div>
                    <div className="text-xs text-gray-400">{o.custPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {o.items.reduce((sum, i) => sum + i.qty, 0)} ш
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ₮{o.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      disabled={updating === o.id}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      <option value="pending">Хүлээгдэж буй</option>
                      <option value="paid">Төлөгдсөн</option>
                      <option value="cancelled">Цуцлагдсан</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">Захиалга олдсонгүй.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <OrdersTable />
    </Suspense>
  );
}
