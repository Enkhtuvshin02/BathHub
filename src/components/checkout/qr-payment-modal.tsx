"use client";

import { useState } from "react";
import { Check, Copy, QrCode, X } from "lucide-react";
import { formatPrice } from "@/lib/data";

const banks = [
  { id: "khan", name: "Хаан банк", account: "5000 1234 5678" },
  { id: "m", name: "М банк", account: "2500 3900 9006" },
];

export function QrPaymentModal({
  amount,
  orderId,
  onConfirm,
  onClose,
}: {
  amount: number;
  orderId: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [bank, setBank] = useState(banks[0].id);
  const [copied, setCopied] = useState<string | null>(null);
  const active = banks.find((b) => b.id === bank)!;

  const rows = [
    { label: "Хүлээн авах данс", value: active.account },
    { label: "Хүлээн авагч", value: "BathHub ХХК" },
    { label: "Захиалгын дүн", value: formatPrice(amount) },
    { label: "Гүйлгээний утга", value: orderId },
  ];

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v).catch(() => {});
    setCopied(v);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <QrCode className="size-5 text-brand" /> Данс эсвэл QR кодоор төлөх
          </h3>
          <button onClick={onClose} aria-label="Хаах" className="rounded-full p-1 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          {/* QR */}
          <div className="flex flex-col items-center">
            <p className="mb-3 text-sm font-medium">QR код уншуулах</p>
            <div className="size-44 rounded-lg border border-border-subtle bg-[length:14px_14px] bg-[repeating-conic-gradient(#18181b_0_25%,#fff_0_50%)]" />
            <p className="mt-3 text-xs text-muted-foreground">Захиалгын дүн</p>
            <p className="text-xl font-bold">{formatPrice(amount)}</p>
          </div>

          {/* transfer details */}
          <div>
            <p className="mb-3 text-sm font-medium">Дансаар шилжүүлэх</p>
            <div className="mb-3 flex gap-2">
              {banks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBank(b.id)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                    bank === b.id ? "border-brand bg-brand/10 text-brand" : "border-border-subtle hover:bg-muted"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.label} className="rounded-lg bg-muted/60 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className="text-sm font-semibold">{r.value}</p>
                    </div>
                    <button onClick={() => copy(r.value)} aria-label="Хуулах" className="rounded-md p-1.5 hover:bg-background">
                      {copied === r.value ? <Check className="size-4 text-success" /> : <Copy className="size-4 text-muted-foreground" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-6 mb-4 rounded-lg bg-rating/10 px-4 py-3 text-xs text-foreground/80">
          Төлбөр төлөгдсөний дараа таны захиалга идэвхжихийг анхаарна уу! Гүйлгээний утга дээр захиалгын
          дугаар <span className="font-semibold">{orderId}</span>-г бичнэ үү.
        </div>

        <div className="flex gap-3 border-t border-border-subtle px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-lg border border-border-subtle py-2.5 text-sm font-medium hover:bg-muted">
            Буцах
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">
            Төлбөр баталгаажуулах (demo)
          </button>
        </div>
      </div>
    </div>
  );
}
