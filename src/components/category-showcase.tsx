import Image from "next/image";
import Link from "next/link";
import { categories, products } from "@/lib/data";

// A few headline categories shown as image tiles on the homepage.
const featuredSlugs = ["unitaz", "ugaaltuur", "shurshuur", "bide", "combo"];

export function CategoryShowcase() {
  const tiles = featuredSlugs
    .map((slug) => {
      const cat = categories.find((c) => c.slug === slug);
      const image = products.find((p) => p.categorySlug === slug)?.image;
      return cat && image ? { ...cat, image } : null;
    })
    .filter((t): t is { slug: string; name: string; image: string } => t !== null);

  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-8">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">Ангиллаар дэлгүүр хэсэх</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {tiles.map((t) => (
          <Link
            key={t.slug}
            href={`/product?category=${t.slug}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-card border border-border-subtle bg-muted">
              <Image
                src={t.image}
                alt={t.name}
                fill
                sizes="(max-width:640px) 33vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-center text-xs font-medium group-hover:text-brand sm:text-sm">
              {t.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
