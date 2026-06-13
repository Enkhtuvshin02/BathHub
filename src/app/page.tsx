import { CategoryShowcase } from "@/components/category-showcase";
import { ProductSection } from "@/components/product-section";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const toProduct = (p: { id: string; name: string; price: number; oldPrice: number | null; image: string; categorySlug: string; rating: number; stock: number; isNew: boolean; isFeatured: boolean; unit: string | null }) => ({
    ...p,
    oldPrice: p.oldPrice ?? undefined,
    unit: p.unit ?? undefined,
  });

  const [newestRaw, featuredRaw] = await Promise.all([
    db.product.findMany({ where: { isNew: true }, take: 8 }),
    db.product.findMany({ where: { isFeatured: true }, take: 8 }),
  ]);
  const newest = newestRaw.map(toProduct);
  const featured = featuredRaw.map(toProduct);

  return (
    <>
      <CategoryShowcase />
      <ProductSection
        title="Шинэ бүтээгдэхүүн"
        subtitle="Шинээр нэмэгдсэн сантехникийн бүтээгдэхүүнүүд"
        products={newest}
        href="/product?filter=new"
      />
      <ProductSection
        title="Онцлох бүтээгдэхүүн"
        subtitle="Хамгийн их эрэлттэй угаалгын өрөөний бараанууд"
        products={featured}
        href="/product?filter=featured"
      />
    </>
  );
}
