"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { useCart } from "./cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-border-subtle bg-background transition-shadow hover:shadow-md">
      <Link href={`/product/${product.id}`} className="relative block aspect-square bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-sale px-1.5 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute right-2 top-2 rounded-md bg-success px-1.5 py-0.5 text-xs font-bold text-white">
            Шинэ
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium hover:text-brand"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-end justify-between">
          <div>
            {product.oldPrice && (
              <span className="block text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-base font-bold">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={() => add(product)}
            aria-label="Сагсанд хийх"
            className="grid size-9 place-items-center rounded-lg bg-muted text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
