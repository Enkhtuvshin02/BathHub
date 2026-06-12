"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useOrders } from "@/components/orders-context";
import { useAccount } from "@/components/account-context";
import { SignInPrompt } from "@/components/auth/sign-in-prompt";
import { formatPrice } from "@/lib/data";
import { type Order } from "@/lib/checkout";

const statusLabel: Record<Order["status"], { text: string; cls: string }> = {
  pending: { text: "Төлбөр хүлээгдэж байна", cls: "bg-rating/15 text-rating" },
  paid: { text: "Төлбөр төлөгдсөн", cls: "bg-success/15 text-success" },
  cancelled: { text: "Цуцлагдсан", cls: "bg-sale/15 text-sale" },
};

function fmtDate(ts: number) {
  const d = new Date(ts);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function OrdersPage() {
  const { orders, hydrated } = useOrders();
  const { user, hydrated: accountHydrated } = useAccount();

  if (accountHydrated && !user) return <SignInPrompt redirect="/orders" />;

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Package className="size-6 text-brand" /> Миний захиалгууд
      </h1>

      {!hydrated || !accountHydrated ? (
        <p className="py-16 text-center text-muted-foreground">Уншиж байна…</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-card border border-border-subtle py-20 text-center">
          <Package className="size-12 text-muted-foreground" />
          <p className="text-lg font-medium">Танд захиалга алга байна</p>
          <Link href="/product" className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-brand-foreground hover:bg-brand-hover">
            Дэлгүүр хэсэх
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const s = statusLabel[o.status];
            return (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center justify-between gap-4 rounded-card border border-border-subtle p-4 hover:border-brand">
                  <div>
                    <p className="font-semibold">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(o.createdAt)} · {o.items.length} бараа</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>{s.text}</span>
                    <span className="font-bold">{formatPrice(o.total)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
