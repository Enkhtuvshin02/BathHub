import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetail } from "@/components/product-detail";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: PageProps<"/product/[id]">) {
  const { id } = await params;
  const raw = await db.product.findUnique({ where: { id } });
  if (!raw) notFound();

  const product: Product = {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    oldPrice: raw.oldPrice ?? undefined,
    image: raw.image,
    categorySlug: raw.categorySlug,
    rating: raw.rating,
    stock: raw.stock,
    isNew: raw.isNew,
    isFeatured: raw.isFeatured,
    unit: raw.unit ?? undefined,
  };

  return <ProductDetail product={product} />;
}
