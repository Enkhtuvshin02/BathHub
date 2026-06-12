import type { CartLine } from "@/components/cart-context";

export const DELIVERY_FEE = 6600; // Дотоодын хүргэлт
export const ECO_BAG_FEE = 380; // Хүргэлтийн эко уут

// Single demo promo code: 10% off the product subtotal.
export const PROMO_CODE = "BATH10";
export const PROMO_RATE = 0.1;

export type Address = {
  label: string; // Хаягийн нэр (Гэр / Ажил)
  city: string; // Хот / Аймаг
  district: string; // Дүүрэг
  khoroo: string; // Хороо
  detail: string; // Дэлгэрэнгүй хаяг
  otherRecipient: boolean; // Өөр хүн хүлээн авна
};

export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  receiptType: "personal" | "company"; // И-Баримт
};

export type OrderStatus = "pending" | "paid" | "cancelled";

export type Order = {
  id: string; // R + 9 digits
  createdAt: number;
  items: CartLine[];
  address: Address;
  customer: Customer;
  subtotal: number;
  discount: number;
  delivery: number;
  ecoBag: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: string;
};

export function computeTotals(subtotal: number, discount = 0) {
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const ecoBag = subtotal > 0 ? ECO_BAG_FEE : 0;
  const total = Math.max(0, subtotal - discount) + delivery + ecoBag;
  return { delivery, ecoBag, total };
}

export function generateOrderId() {
  return "R" + Math.floor(100000000 + Math.random() * 900000000).toString();
}
