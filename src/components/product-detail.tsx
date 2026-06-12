"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { categoryName, formatPrice } from "@/lib/data";
import { useCart } from "./cart-context";

export function ProductDetail({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      {/* breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-brand">Нүүр</Link>
        <span>/</span>
        <Link href="/product" className="hover:text-brand">Бүтээгдэхүүн</Link>
        <span>/</span>
        <Link href={`/product?category=${product.categorySlug}`} className="hover:text-brand">{categoryName(product.categorySlug)}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* gallery */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((n) => (
              <div key={n} className={`relative size-16 overflow-hidden rounded-lg border bg-muted ${n === 0 ? "border-brand" : "border-border-subtle"}`}>
                <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="relative flex-1 overflow-hidden rounded-card border border-border-subtle bg-muted">
            <Image src={product.image} alt={product.name} width={700} height={700} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <button aria-label="Хадгалах" className="grid size-10 shrink-0 place-items-center rounded-full border border-border-subtle hover:bg-muted">
              <Heart className="size-5" />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-4 fill-rating text-rating" /> {product.rating}
          </div>

          <div className="mt-4 flex items-end gap-3">
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          </div>

          {/* quantity */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium">Тоо хэмжээ</span>
            <div className="flex items-center rounded-lg border border-border-subtle">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-9 place-items-center hover:bg-muted" aria-label="Хасах">
                <Minus className="size-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid size-9 place-items-center hover:bg-muted" aria-label="Нэмэх">
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">Үлдэгдэл {product.stock}</p>

          {/* actions */}
          <div className="mt-5 space-y-2.5">
            <button
              onClick={() => add(product, qty)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-muted py-3 text-sm font-medium transition-colors hover:bg-zinc-200"
            >
              <ShoppingCart className="size-4" />
              Сагсанд хийх · {formatPrice(product.price * qty)}
            </button>
            <button
              onClick={() => { add(product, qty); openCart(); }}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
            >
              Худалдаж авах
            </button>
          </div>

          {/* details */}
          <div className="mt-8 border-t border-border-subtle pt-5">
            <h3 className="mb-3 font-semibold">Бүтээгдэхүүний дэлгэрэнгүй</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border-subtle/60 pb-2">
                <dt className="text-muted-foreground">Ангилал</dt>
                <dd>{categoryName(product.categorySlug)}</dd>
              </div>
              {product.unit && (
                <div className="flex justify-between border-b border-border-subtle/60 pb-2">
                  <dt className="text-muted-foreground">Хэмжих нэгж</dt>
                  <dd>{product.unit}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Нөөц</dt>
                <dd className="text-success">Бэлэн ({product.stock})</dd>
              </div>
            </dl>
          </div>

          {/* payment */}
          <div className="mt-6 rounded-card border border-border-subtle p-4">
            <h4 className="mb-2 text-sm font-semibold">Төлбөрийн боломжууд</h4>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-md bg-[#00c758] text-sm font-bold text-white">Q</span>
              <span className="text-sm">QPay-ээр төлөх боломжтой</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
