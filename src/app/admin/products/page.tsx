"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  category: { name: string };
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" бүтээгдэхүүнийг устгах уу?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Бүтээгдэхүүн</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          + Шинэ бүтээгдэхүүн
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Уншиж байна...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Нэр</th>
                <th className="px-4 py-3 font-medium text-gray-500">Ангилал</th>
                <th className="px-4 py-3 font-medium text-gray-500">Үнэ</th>
                <th className="px-4 py-3 font-medium text-gray-500">Нөөц</th>
                <th className="px-4 py-3 font-medium text-gray-500">Шинэ</th>
                <th className="px-4 py-3 font-medium text-gray-500">Онцлох</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    ₮{p.price.toLocaleString()}
                    {p.oldPrice && (
                      <span className="line-through text-gray-400 ml-1 text-xs">
                        ₮{p.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${p.isNew ? "bg-green-500" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${p.isFeatured ? "bg-blue-500" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3 flex gap-3 justify-end">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Засах
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-red-500 hover:underline"
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">Бүтээгдэхүүн олдсонгүй.</p>
          )}
        </div>
      )}
    </div>
  );
}
