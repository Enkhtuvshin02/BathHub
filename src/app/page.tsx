import { Hero } from "@/components/hero";
import { CategoryShowcase } from "@/components/category-showcase";
import { ProductSection } from "@/components/product-section";
import { products } from "@/lib/data";

export default function Home() {
  const newest = products.filter((p) => p.isNew);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ProductSection
        title="Шинэ бүтээгдэхүүн"
        subtitle="Шинээр нэмэгдсэн сантехникийн бүтээгдэхүүнүүд"
        products={newest.length ? newest : products.slice(0, 5)}
        href="/product?filter=new"
      />
      <ProductSection
        title="Онцлох бүтээгдэхүүн"
        subtitle="Хамгийн их эрэлттэй угаалгын өрөөний бараанууд"
        products={featured.length ? featured : products.slice(0, 5)}
        href="/product?filter=featured"
      />
    </>
  );
}
