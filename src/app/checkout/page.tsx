"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, MapPin, User } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useAccount } from "@/components/account-context";
import { useOrders } from "@/components/orders-context";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentMethodsModal } from "@/components/checkout/payment-methods-modal";
import { QrPaymentModal } from "@/components/checkout/qr-payment-modal";
import { formatPrice } from "@/lib/data";
import { computeTotals, type Address, type Customer, type Order } from "@/lib/checkout";

const field = "h-11 w-full rounded-lg border border-border-subtle px-3 text-sm outline-none focus:border-brand";
const label = "mb-1 block text-sm font-medium";
const req = <span className="text-sale">*</span>;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, total, clear } = useCart();
  const { user } = useAccount();
  const { placeOrder, markPaid } = useOrders();

  const [step, setStep] = useState<"address" | "review">("address");
  const [showMethods, setShowMethods] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState<Address>({
    label: "", city: "", district: "", khoroo: "", detail: "", otherRecipient: false,
  });
  const [customer, setCustomer] = useState<Customer>({
    firstName: "", lastName: "", phone: "", email: "", receiptType: "personal",
  });

  // Prefill customer from the signed-in demo user.
  useEffect(() => {
    if (user) setCustomer((c) => ({ ...c, firstName: user.firstName, lastName: user.lastName, phone: user.phone, email: user.email }));
  }, [user]);

  // Guard: empty cart (and not mid-payment) → back to cart.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && lines.length === 0 && !order) router.replace("/cart");
  }, [mounted, lines.length, order, router]);

  const addressValid =
    address.city.trim() && address.detail.trim() && customer.firstName.trim() && customer.phone.trim();

  const { delivery, ecoBag, total: grandTotal } = computeTotals(total);

  // Place the order (snapshot of the cart) and open the QR modal. The cart is
  // cleared only when leaving for the order page, so amounts stay correct here.
  const startPayment = () => {
    const placed = placeOrder({
      items: lines,
      address,
      customer,
      subtotal: total,
      discount: 0,
      delivery,
      ecoBag,
      total: grandTotal,
      paymentMethod: "qr",
    });
    setOrder(placed);
    setShowMethods(false);
  };

  const finishToOrder = (id: string) => {
    clear();
    router.push(`/orders/${id}`);
  };

  const set = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <CheckoutSteps active={step === "address" ? 1 : 2} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          {step === "address" ? (
            <>
              <section className="rounded-card border border-border-subtle p-5">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <MapPin className="size-5 text-brand" /> Хүргэлтийн хаяг
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className={label}>Хаягийн нэр {req}</span>
                    <input className={field} placeholder="Гэр, Ажил" value={address.label} onChange={set(setAddress, "label")} />
                  </div>
                  <div>
                    <span className={label}>Хот / Аймаг {req}</span>
                    <input className={field} placeholder="Хот/Аймаг сонгох" value={address.city} onChange={set(setAddress, "city")} />
                  </div>
                  <div>
                    <span className={label}>Дүүрэг {req}</span>
                    <input className={field} value={address.district} onChange={set(setAddress, "district")} />
                  </div>
                  <div>
                    <span className={label}>Хороо {req}</span>
                    <input className={field} value={address.khoroo} onChange={set(setAddress, "khoroo")} />
                  </div>
                </div>
                <label className="mt-3 flex w-fit items-center gap-2 text-sm">
                  <input type="checkbox" checked={address.otherRecipient} onChange={(e) => setAddress((a) => ({ ...a, otherRecipient: e.target.checked }))} className="size-4 accent-[var(--brand)]" />
                  Өөр хүн хүлээн авна
                </label>
                <div className="mt-4">
                  <span className={label}>Дэлгэрэнгүй хаяг {req}</span>
                  <textarea
                    className="min-h-24 w-full rounded-lg border border-border-subtle p-3 text-sm outline-none focus:border-brand"
                    placeholder="Та хаягаа зөв дэлгэрэнгүй оруулна уу. Тодорхой бус хаягаас үүдэн хүргэлт удааширч болзошгүй."
                    value={address.detail}
                    onChange={set(setAddress, "detail")}
                  />
                </div>
              </section>

              <section className="rounded-card border border-border-subtle p-5">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <User className="size-5 text-brand" /> Захиалагчийн мэдээлэл
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className={label}>Нэр {req}</span>
                    <input className={field} value={customer.firstName} onChange={set(setCustomer, "firstName")} />
                  </div>
                  <div>
                    <span className={label}>Овог</span>
                    <input className={field} value={customer.lastName} onChange={set(setCustomer, "lastName")} />
                  </div>
                  <div>
                    <span className={label}>Утасны дугаар {req}</span>
                    <input className={field} value={customer.phone} onChange={set(setCustomer, "phone")} />
                  </div>
                  <div>
                    <span className={label}>И-Мэйл хаяг</span>
                    <input className={field} value={customer.email} onChange={set(setCustomer, "email")} />
                  </div>
                </div>
              </section>

              <section className="rounded-card border border-border-subtle p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                  <FileText className="size-5 text-brand" /> И-Баримт
                </h2>
                <div className="flex gap-2">
                  {([["personal", "Хувь хүн"], ["company", "Байгууллага"]] as const).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setCustomer((c) => ({ ...c, receiptType: v }))}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                        customer.receiptType === v ? "border-brand bg-brand/10 text-brand" : "border-border-subtle hover:bg-muted"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-card border border-border-subtle p-5">
              <h2 className="mb-4 text-lg font-bold">Захиалга баталгаажуулах</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-1 font-semibold">Хүргэлтийн хаяг</p>
                  <p className="text-muted-foreground">
                    {[address.label, address.city, address.district, address.khoroo].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-muted-foreground">{address.detail}</p>
                </div>
                <div className="border-t border-border-subtle pt-4">
                  <p className="mb-1 font-semibold">Захиалагч</p>
                  <p className="text-muted-foreground">{customer.firstName} {customer.lastName} · {customer.phone}</p>
                  <p className="text-muted-foreground">{customer.email}</p>
                </div>
                <div className="border-t border-border-subtle pt-4">
                  <p className="mb-2 font-semibold">Бүтээгдэхүүн</p>
                  <ul className="space-y-1">
                    {lines.map(({ product, qty }) => (
                      <li key={product.id} className="flex justify-between">
                        <span className="text-muted-foreground">{product.name} <span className="text-xs">x{qty}</span></span>
                        <span>{formatPrice(product.price * qty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="w-full lg:w-80">
          <div className="lg:sticky lg:top-4">
            <OrderSummary
              lines={step === "review" ? lines : undefined}
              subtotal={total}
              showFees
              cta={
                step === "address"
                  ? { label: "Үргэлжлүүлэх", onClick: () => setStep("review"), disabled: !addressValid }
                  : { label: "Төлбөр төлөх", onClick: () => setShowMethods(true) }
              }
              secondary={
                step === "address"
                  ? { label: "Сагс руу буцах", href: "/cart" }
                  : { label: "Өмнөх алхам руу буцах", onClick: () => setStep("address") }
              }
            />
          </div>
        </div>
      </div>

      {showMethods && (
        <PaymentMethodsModal onSelectQr={startPayment} onClose={() => setShowMethods(false)} />
      )}
      {order && (
        <QrPaymentModal
          amount={order.total}
          orderId={order.id}
          onConfirm={() => { markPaid(order.id); finishToOrder(order.id); }}
          onClose={() => finishToOrder(order.id)}
        />
      )}
    </div>
  );
}
