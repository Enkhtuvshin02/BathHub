"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type Order } from "@/lib/checkout";
import { useAccount } from "@/components/account-context";

type OrderDraft = Omit<Order, "id" | "createdAt" | "status">;

type OrdersState = {
  orders: Order[];
  hydrated: boolean;
  placeOrder: (draft: OrderDraft) => Promise<Order>;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersState | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, hydrated: accountHydrated } = useAccount();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user) { setOrders([]); setHydrated(true); return; }
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } catch { /* ignore */ }
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (accountHydrated) refreshOrders();
  }, [accountHydrated, refreshOrders]);

  const placeOrder = async (draft: OrderDraft): Promise<Order> => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) throw new Error("Захиалга үүсгэхэд алдаа гарлаа.");
    const order: Order = await res.json();
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateStatus = async (id: string, status: Order["status"]) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        hydrated,
        placeOrder,
        getOrder: (id) => orders.find((o) => o.id === id),
        cancelOrder: (id) => updateStatus(id, "cancelled"),
        markPaid: (id) => updateStatus(id, "paid"),
        refreshOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
