"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutGrid, Truck } from "lucide-react";
import { categories } from "@/lib/data";

export function CategoryNav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-border-subtle bg-background">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-1 px-4">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="my-2 flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LayoutGrid className="size-4 text-brand" />
            Ангилал
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <ul className="absolute left-0 top-full z-40 mt-1 w-64 overflow-hidden rounded-xl border border-border-subtle bg-background py-2 shadow-xl">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/product?category=${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Truck className="size-4 text-brand" />
          Улаанбаатар хотод 24-48 цагт хүргэнэ
        </span>
      </div>
    </nav>
  );
}