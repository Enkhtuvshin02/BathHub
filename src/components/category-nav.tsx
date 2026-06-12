"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, LayoutGrid, Truck } from "lucide-react";
import { categories } from "@/lib/data";

export function CategoryNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(categories[0].slug);

  return (
    <nav className="border-b border-border-subtle bg-background">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-1 px-4">
        {/* Ангилал mega-menu trigger */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen((v) => !v)}
            className="my-2 flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LayoutGrid className="size-4 text-brand" />
            Ангилал
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          {open && (
            <div className="absolute left-0 top-full z-40 flex w-[760px] overflow-hidden rounded-xl border border-border-subtle bg-background shadow-xl">
              {/* left: category list */}
              <ul className="scrollbar-thin max-h-[420px] w-64 shrink-0 overflow-y-auto border-r border-border-subtle py-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/product?category=${c.slug}`}
                      onMouseEnter={() => setActive(c.slug)}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                        active === c.slug
                          ? "bg-muted font-medium text-brand"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      {c.name}
                      <ChevronDown className="size-3.5 -rotate-90 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
              {/* right: subcategory panel */}
              <div className="flex-1 p-6">
                <h3 className="mb-2 text-base font-semibold">
                  {categories.find((c) => c.slug === active)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Энэ ангилалд дэд ангилал байхгүй байна.
                </p>
                <Link
                  href={`/product?category=${active}`}
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
                >
                  Бүгдийг харах →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* trust signal (not a nav tab) */}
        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Truck className="size-4 text-brand" />
          Улаанбаатар хотод 24-48 цагт хүргэнэ
        </span>
      </div>
    </nav>
  );
}
