"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "ТАНЫ УГААЛГЫН\nӨРӨӨГ ШИНЭЧИЛЬЕ",
    subtitle: "Суултуур, угаалтуур, биде, шүршүүр — чанартай сантехник, шуурхай хүргэлт",
    cta: "Дэлгүүр хэсэх",
    bg: "from-[#0a4d7a] via-[#0e7fd1] to-[#3aa0e0]",
  },
  {
    title: "ОРЧИН ҮЕИЙН\nСАНТЕХНИК",
    subtitle: "Дэлхийн шилдэг брэндүүдийн бүтээгдэхүүн боломжийн үнээр",
    cta: "Шинэ бараа",
    bg: "from-[#0b6e6e] via-[#0fa3a3] to-[#3fc6c6]",
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  const slide = slides[i];
  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-4">
      <div className={`relative overflow-hidden rounded-card bg-gradient-to-r ${slide.bg}`}>
        <div className="relative z-10 flex min-h-[220px] flex-col justify-center gap-4 px-8 py-10 sm:min-h-[300px] sm:px-14">
          <h2 className="whitespace-pre-line font-serif text-3xl font-bold leading-tight text-white sm:text-5xl" style={{ fontFamily: "Georgia, serif" }}>
            {slide.title}
          </h2>
          <p className="max-w-md text-sm text-white/85 sm:text-base">{slide.subtitle}</p>
          <Link
            href="/product"
            className="w-fit rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            {slide.cta}
          </Link>
        </div>

        {/* decorative pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_80%_20%,white,transparent_45%)]" />

        <button onClick={() => go(-1)} aria-label="Өмнөх" className="absolute left-3 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur hover:bg-white/40">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={() => go(1)} aria-label="Дараах" className="absolute right-3 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur hover:bg-white/40">
          <ChevronRight className="size-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Слайд ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
