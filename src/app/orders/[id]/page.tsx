"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, FileDown, Package, XCircle } from "lucide-react";
import { useOrders } from "@/components/orders-context";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { QrPaymentModal } from "@/components/checkout/qr-payment-modal";
import { formatPrice } from "@/lib/data";

const PAY_WINDOW_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

function fmtDate(ts: number) {
  const d = new Date(ts);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function Countdown({ deadline }: { deadline: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, deadline - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  return (
    <span className="font-bold">
      {days.toString().padStart(2, "0")} өдөр : {hours.toString().padStart(2, "0")} цаг : {mins.toString().padStart(2, "0")} минут
    </span>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, hydrated, cancelOrder, markPaid } = useOrders();
  const [showQr, setShowQr] = useState(false);
  const order = getOrder(id);

  if (!hydrated) {
    return <div className="mx-auto max-w-[1000px] px-4 py-16 text-center text-muted-foreground">Уншиж байна…</div>;
  }
  if (!order) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-20 text-center">
        <p className="mb-4 text-lg font-medium">Захиалга олдсонгүй</p>
        <Link href="/orders" className="text-brand hover:underline">Миний захиалгууд руу буцах</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <CheckoutSteps active={3} />

      {/* status card */}
      <div className="mb-4 rounded-card border border-border-subtle p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="text-lg font-bold">Захиалгын мэдээлэл</h1>
          {order.status === "pending" && (
            <div className="text-right text-sm">
              <p className="text-muted-foreground">Төлбөр төлөх хугацаа</p>
              <Countdown deadline={order.createdAt + PAY_WINDOW_MS} />
            </div>
          )}
        </div>

        {order.status === "pending" && (
          <>
            <p className="mb-3 text-center text-2xl font-bold">Төлбөр хүлээгдэж байна</p>
            <div className="mb-4 rounded-lg bg-rating/10 px-4 py-3 text-sm text-foreground/80">
              Төлбөр төлөгдсөний дараа таны захиалга баталгаажихыг анхаарна уу! Дээрх хугацаанд төлбөрөө
              төлөөгүй тохиолдолд таны захиалга автоматаар цуцлагдана.
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => cancelOrder(order.id)} className="rounded-lg border border-border-subtle px-5 py-2.5 text-sm font-medium hover:bg-muted">
                Захиалга цуцлах
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-5 py-2.5 text-sm font-medium hover:bg-muted">
                <FileDown className="size-4" /> Нэхэмжлэх татах
              </button>
              <button onClick={() => setShowQr(true)} className="ml-auto rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">
                Төлбөр төлөх
              </button>
            </div>
          </>
        )}

        {order.status === "paid" && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 className="size-12 text-success" />
            <p className="text-xl font-bold">Төлбөр амжилттай төлөгдлөө</p>
            <p className="text-sm text-muted-foreground">Таны захиалга баталгаажиж, удахгүй хүргэгдэнэ.</p>
          </div>
        )}

        {order.status === "cancelled" && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <XCircle className="size-12 text-sale" />
            <p className="text-xl font-bold">Захиалга цуцлагдсан</p>
          </div>
        )}
      </div>

      {/* breakdown */}
      <div className="mb-4 rounded-card border border-border-subtle p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Захиалгын дугаар</p>
            <p className="font-bold">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Захиалга хийсэн огноо</p>
            <p className="font-medium">{fmtDate(order.createdAt)}</p>
          </div>
        </div>
        <dl className="space-y-1.5 border-t border-border-subtle pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Бараа дүн</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-sale"><dt>Хөнгөлөлт</dt><dd>-{formatPrice(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted-foreground">Дотоодын хүргэлт</dt><dd>{formatPrice(order.delivery)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Хүргэлтийн эко уут</dt><dd>{formatPrice(order.ecoBag)}</dd></div>
          <div className="flex justify-between border-t border-border-subtle pt-2 text-base font-bold"><dt>Нийт төлөх дүн</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </div>

      {/* delivery group + items */}
      <div className="overflow-hidden rounded-card border border-border-subtle">
        <div className="flex items-center gap-2 border-b border-border-subtle bg-muted/40 px-4 py-3">
          <Package className="size-5 text-brand" />
          <div>
            <p className="text-sm font-semibold">BathHub хүргэлт</p>
            <p className="text-xs text-muted-foreground">24-48 цагийн хооронд хүргэгдэнэ.</p>
          </div>
        </div>
        <ul>
          {order.items.map(({ product, qty }) => (
            <li key={product.id} className="flex items-center gap-3 border-b border-border-subtle p-4 last:border-0">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
              </div>
              <span className="line-clamp-2 flex-1 text-sm">{product.name}</span>
              <span className="text-sm text-muted-foreground">x{qty}</span>
              <span className="w-28 text-right text-sm font-semibold">{formatPrice(product.price * qty)}</span>
            </li>
          ))}
        </ul>
      </div>

      {showQr && (
        <QrPaymentModal
          amount={order.total}
          orderId={order.id}
          onConfirm={() => { markPaid(order.id); setShowQr(false); }}
          onClose={() => setShowQr(false)}
        />
      )}
    </div>
  );
}
