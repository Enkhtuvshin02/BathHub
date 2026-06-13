"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../../ProductForm";

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  categorySlug: string;
  stock: number;
  unit: string | null;
  isNew: boolean;
  isFeatured: boolean;
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) {
    return <p className="text-gray-400 text-sm">Уншиж байна...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Бүтээгдэхүүн засах</h1>
      <ProductForm
        productId={product.id}
        initial={{
          name: product.name,
          price: String(product.price),
          oldPrice: product.oldPrice ? String(product.oldPrice) : "",
          image: product.image,
          categorySlug: product.categorySlug,
          stock: String(product.stock),
          unit: product.unit ?? "",
          isNew: product.isNew,
          isFeatured: product.isFeatured,
        }}
      />
    </div>
  );
}
