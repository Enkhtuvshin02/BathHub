"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { generateOrderId, type Order } from "@/lib/checkout";

type OrderDraft = Omit<Order, "id" | "createdAt" | "status">;

type OrdersState = {
  orders: Order[];
  hydrated: boolean;
  placeOrder: (draft: OrderDraft) => Order;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  markPaid: (id: string) => void;
};

const OrdersContext = createContext<OrdersState | null>(null);
const STORAGE_KEY = "bathmall-orders";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  const placeOrder: OrdersState["placeOrder"] = (draft) => {
    const order: Order = {
      ...draft,
      id: generateOrderId(),
      createdAt: Date.now(),
      status: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const setStatus = (id: string, status: Order["status"]) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  return (
    <OrdersContext.Provider
      value={{
        orders,
        hydrated,
        placeOrder,
        getOrder: (id) => orders.find((o) => o.id === id),
        cancelOrder: (id) => setStatus(id, "cancelled"),
        markPaid: (id) => setStatus(id, "paid"),
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
