"use client";

import { useState } from "react";
import { Check, Copy, Landmark, X } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { BANK_ACCOUNTS } from "@/lib/checkout";

export function BankTransferModal({
  amount,
  orderId,
  onConfirm,
  onClose,
  placing,
}: {
  amount: number;
  orderId?: string;
  onConfirm: () => void;
  onClose: () => void;
  placing?: boolean;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v).catch(() => {});
    setCopied(v);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-6 py-4">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Landmark className="size-5 text-brand" /> Банкны шилжүүлэг
          </h3>
          <button onClick={onClose} aria-label="Хаах" className="rounded-full p-1 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <p className="text-sm text-muted-foreground">
            Доорх дансны аль нэгэнд захиалгын дүнг шилжүүлнэ үү.
          </p>

          {BANK_ACCOUNTS.map((b) => {
            const rows = [
              { label: "Банк", value: b.bank },
              { label: "Данс", value: b.account },
              { label: "Хүлээн авагч", value: b.name },
            ];
            return (
              <div key={b.bank} className="rounded-xl border border-border-subtle p-4">
                <p className="mb-3 text-sm font-semibold">{b.bank}</p>
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
            );
          })}

          <div className="rounded-lg bg-muted/60 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Нийт төлөх дүн</span>
              <span className="text-lg font-bold">{formatPrice(amount)}</span>
            </div>
            {orderId && (
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Гүйлгээний утга</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{orderId}</span>
                  <button onClick={() => copy(orderId)} className="rounded p-1 hover:bg-background">
                    {copied === orderId ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Шилжүүлэг хийсний дараа таны захиалга баталгаажихад 1–2 цаг шаардагдаж болно.
            Гүйлгээний утга дээр захиалгын дугаараа заавал оруулна уу.
          </p>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-border-subtle px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-lg border border-border-subtle py-2.5 text-sm font-medium hover:bg-muted">
            Буцах
          </button>
          <button
            onClick={onConfirm}
            disabled={placing}
            className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover disabled:opacity-60"
          >
            {placing ? "Хадгалж байна…" : "Захиалга баталгаажуулах"}
          </button>
        </div>
      </div>
    </div>
  );
}
