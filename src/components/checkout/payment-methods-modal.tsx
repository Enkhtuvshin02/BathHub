"use client";

import { ChevronRight, Landmark, Smartphone, X } from "lucide-react";

export function PaymentMethodsModal({
  onSelectBank,
  onClose,
}: {
  onSelectBank: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[65] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h3 className="text-lg font-bold">Төлбөрийн төрлөө сонгоно уу</h3>
          <button onClick={onClose} aria-label="Хаах" className="rounded-full p-1 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-3 p-6">
          {/* Bank transfer — enabled */}
          <button
            onClick={onSelectBank}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-border-subtle px-4 py-4 text-left transition-colors hover:border-brand hover:bg-brand/5"
          >
            <span className="flex items-center gap-3">
              <Landmark className="size-5 shrink-0 text-brand" />
              <span>
                <span className="block text-sm font-semibold">Банкны шилжүүлэг</span>
                <span className="block text-xs text-muted-foreground">Хаан банк, М банк данс руу шилжүүлэх</span>
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>

          {/* QPay — disabled */}
          <button
            disabled
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-border-subtle px-4 py-4 text-left opacity-50"
          >
            <span className="flex items-center gap-3">
              <Smartphone className="size-5 shrink-0 text-muted-foreground" />
              <span>
                <span className="block text-sm font-semibold">QPay</span>
                <span className="block text-xs text-muted-foreground">Удахгүй нэмэгдэнэ</span>
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
