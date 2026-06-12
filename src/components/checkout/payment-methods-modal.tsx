"use client";

import { ChevronRight, CreditCard, QrCode, Smartphone, Wallet, X } from "lucide-react";

type Method = { id: string; name: string; desc: string };

const groups: { title: string; icon: React.ElementType; methods: Method[] }[] = [
  {
    title: "Банк / Карт",
    icon: QrCode,
    methods: [
      { id: "qr", name: "Дансаар шилжүүлэх эсвэл QR кодоор төлөх", desc: "Аль ч банкны аппликейшн ашиглан уншуулж болно" },
      { id: "mbank", name: "М банк", desc: "Мобайл апп-аар төлөх" },
      { id: "card", name: "International Card Payment", desc: "Visa, Master, Amex" },
    ],
  },
  {
    title: "Хувааж төлөх нөхцөл",
    icon: CreditCard,
    methods: [
      { id: "storepay", name: "Storepay", desc: "Одоо аваад, дараа төл" },
      { id: "pocket", name: "Pocket", desc: "апп-р төлөх" },
      { id: "ardpay", name: "Ard Pay", desc: "Ard Pay ашиглан төлөх" },
      { id: "simple", name: "Simple", desc: "Simple-ээр төлөх" },
    ],
  },
  {
    title: "Цахим хэтэвчээр төлөх",
    icon: Wallet,
    methods: [
      { id: "socialpay", name: "Social pay", desc: "Social pay ашиглан төлөх" },
      { id: "toki", name: "Toki", desc: "апп-р төлөх" },
      { id: "hipay", name: "Hipay", desc: "Hipay хэтэвчээр төлөх" },
      { id: "wechat", name: "WeChat", desc: "WeChat payment" },
      { id: "happypay", name: "HappyPay", desc: "HappyPay app" },
      { id: "lenddy", name: "LendDy", desc: "LendDy" },
    ],
  },
];

export function PaymentMethodsModal({
  onSelectQr,
  onClose,
}: {
  onSelectQr: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[65] grid place-items-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h3 className="text-lg font-bold">Төлбөрийн төрлөө сонгоно уу</h3>
          <button onClick={onClose} aria-label="Хаах" className="rounded-full p-1 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <g.icon className="size-4" /> {g.title}
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {g.methods.map((m) => {
                  const enabled = m.id === "qr";
                  return (
                    <button
                      key={m.id}
                      onClick={enabled ? onSelectQr : undefined}
                      disabled={!enabled}
                      className={`flex items-center justify-between gap-2 rounded-lg border border-border-subtle px-3 py-3 text-left transition-colors ${
                        enabled ? "hover:border-brand hover:bg-brand/5" : "opacity-55"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Smartphone className="size-5 shrink-0 text-muted-foreground" />
                        <span>
                          <span className="block text-sm font-medium leading-tight">{m.name}</span>
                          <span className="block text-xs text-muted-foreground">{m.desc}</span>
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground">
            * Энэхүү жишээ дэлгүүрт зөвхөн QR / дансаар төлөх горим идэвхтэй.
          </p>
        </div>
      </div>
    </div>
  );
}
