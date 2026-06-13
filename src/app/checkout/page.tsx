"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, FileText, MapPin, Pencil, Plus, User } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useAccount } from "@/components/account-context";
import { useOrders } from "@/components/orders-context";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentMethodsModal } from "@/components/checkout/payment-methods-modal";
import { BankTransferModal } from "@/components/checkout/bank-transfer-modal";
import { AddressFields } from "@/components/address-fields";
import { formatPrice } from "@/lib/data";
import { computeTotals, type Address, type Customer } from "@/lib/checkout";

const field = "h-11 w-full rounded-lg border border-border-subtle px-3 text-sm outline-none focus:border-brand";
const lbl = "mb-1 block text-sm font-medium";
const req = <span className="text-sale">*</span>;

// field/lbl/req still used for the customer info section below

type SavedAddr = { id: string; label: string; city: string; district: string; khoroo: string; detail: string; isDefault: boolean };

const BLANK_ADDR: Address = { label: "", city: "", district: "", khoroo: "", detail: "", otherRecipient: false };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, total, clear } = useCart();
  const { user } = useAccount();
  const { placeOrder } = useOrders();

  const [step, setStep] = useState<"address" | "review">("address");
  const [showMethods, setShowMethods] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [placing, setPlacing] = useState(false);

  const [savedAddrs, setSavedAddrs] = useState<SavedAddr[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const [address, setAddress] = useState<Address>(BLANK_ADDR);
  const [customer, setCustomer] = useState<Customer>({
    firstName: "", lastName: "", phone: "", email: "", receiptType: "personal",
  });

  useEffect(() => {
    if (user) setCustomer((c) => ({ ...c, firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? "", email: user.email }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/addresses").then((r) => r.json()).then((data: SavedAddr[]) => {
      setSavedAddrs(data);
      const def = data.find((a) => a.isDefault) ?? data[0];
      if (def) {
        setSelectedId(def.id);
        setAddress({ label: def.label, city: def.city, district: def.district, khoroo: def.khoroo, detail: def.detail, otherRecipient: false });
        setShowNewForm(false);
      } else {
        setShowNewForm(true);
      }
    }).catch(() => setShowNewForm(true));
  }, [user]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && lines.length === 0) router.replace("/cart");
  }, [mounted, lines.length, router]);

  const selectSaved = (a: SavedAddr) => {
    setSelectedId(a.id);
    setAddress({ label: a.label, city: a.city, district: a.district, khoroo: a.khoroo, detail: a.detail, otherRecipient: false });
    setShowNewForm(false);
  };

  const openNewForm = () => {
    setSelectedId(null);
    setAddress(BLANK_ADDR);
    setShowNewForm(true);
  };

  const addressValid =
    address.city.trim() && address.detail.trim() && customer.firstName.trim() && customer.phone.trim();

  const { delivery, ecoBag, total: grandTotal } = computeTotals(total);

  const openBankTransfer = () => {
    setShowMethods(false);
    setShowBankTransfer(true);
  };

  const confirmOrder = async () => {
    if (placing) return;
    setPlacing(true);
    try {
      if (user && showNewForm) {
        await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...address, isDefault: savedAddrs.length === 0 }),
        });
      }
      const placed = await placeOrder({
        items: lines, address, customer, subtotal: total, discount: 0, delivery, ecoBag, total: grandTotal, paymentMethod: "bank",
      });
      clear();
      router.push(`/orders/${placed.id}`);
    } catch {
      setPlacing(false);
    }
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

                {/* Saved addresses */}
                {savedAddrs.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {savedAddrs.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => selectSaved(a)}
                        className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                          selectedId === a.id && !showNewForm
                            ? "border-brand bg-brand/5"
                            : "border-border-subtle hover:border-brand/50 hover:bg-muted/40"
                        }`}
                      >
                        <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2 ${
                          selectedId === a.id && !showNewForm ? "border-brand bg-brand" : "border-border-subtle"
                        }`}>
                          {selectedId === a.id && !showNewForm && <Check className="size-2.5 text-white" />}
                        </span>
                        <span className="flex-1 text-sm">
                          <span className="font-semibold">{a.label || "Хаяг"}</span>
                          {a.isDefault && <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">Үндсэн</span>}
                          <span className="mt-0.5 block text-muted-foreground">
                            {[a.city, a.district, a.khoroo].filter(Boolean).join(", ")}
                          </span>
                          <span className="block text-muted-foreground">{a.detail}</span>
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={openNewForm}
                      className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                        showNewForm ? "border-brand bg-brand/5 text-brand" : "border-dashed border-border-subtle hover:border-brand/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Plus className="size-4" /> Шинэ хаяг нэмэх
                    </button>
                  </div>
                )}

                {/* New / edit form */}
                {(showNewForm || savedAddrs.length === 0) && (
                  <AddressFields value={address} onChange={setAddress} />
                )}

                {/* Inline edit of selected saved address */}
                {!showNewForm && selectedId && (
                  <button
                    onClick={() => {
                      setShowNewForm(true);
                      setSelectedId(null);
                    }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-brand hover:underline"
                  >
                    <Pencil className="size-3.5" /> Хаяг засварлах
                  </button>
                )}
              </section>

              <section className="rounded-card border border-border-subtle p-5">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <User className="size-5 text-brand" /> Захиалагчийн мэдээлэл
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className={lbl}>Нэр {req}</span>
                    <input className={field} value={customer.firstName} onChange={set(setCustomer, "firstName")} />
                  </div>
                  <div>
                    <span className={lbl}>Овог</span>
                    <input className={field} value={customer.lastName} onChange={set(setCustomer, "lastName")} />
                  </div>
                  <div>
                    <span className={lbl}>Утасны дугаар {req}</span>
                    <input className={field} value={customer.phone} onChange={set(setCustomer, "phone")} />
                  </div>
                  <div>
                    <span className={lbl}>И-Мэйл хаяг</span>
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
        <PaymentMethodsModal onSelectBank={openBankTransfer} onClose={() => setShowMethods(false)} />
      )}
      {showBankTransfer && (
        <BankTransferModal
          amount={grandTotal}
          onConfirm={confirmOrder}
          onClose={() => setShowBankTransfer(false)}
          placing={placing}
        />
      )}
    </div>
  );
}
