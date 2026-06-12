import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/data";
import { ProductDetail } from "@/components/product-detail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
