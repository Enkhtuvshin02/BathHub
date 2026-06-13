"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

const CATEGORIES = [
  { slug: "unitaz", name: "Суултуур" },
  { slug: "ugaaltuur", name: "Угаалтуур" },
  { slug: "bide", name: "Биде" },
  { slug: "shurshuur", name: "Шүршүүр" },
  { slug: "combo", name: "Иж бүрдэл" },
];

type FormValues = {
  name: string;
  price: string;
  oldPrice: string;
  image: string;
  categorySlug: string;
  stock: string;
  unit: string;
  isNew: boolean;
  isFeatured: boolean;
};

type Props = {
  productId?: string;
  initial?: Partial<FormValues>;
};

const empty: FormValues = {
  name: "",
  price: "",
  oldPrice: "",
  image: "",
  categorySlug: "unitaz",
  stock: "0",
  unit: "1ш",
  isNew: false,
  isFeatured: false,
};

export default function ProductForm({ productId, initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormValues, value: string | boolean) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        price: values.price,
        oldPrice: values.oldPrice || null,
        image: values.image,
        categorySlug: values.categorySlug,
        stock: values.stock,
        unit: values.unit || null,
        isNew: values.isNew,
        isFeatured: values.isFeatured,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Алдаа гарлаа.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl space-y-4">
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <Field label="Нэр *">
        <input
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Бүтээгдэхүүний нэр"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Үнэ (₮) *">
          <input
            required
            type="number"
            min="0"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="320000"
          />
        </Field>
        <Field label="Хуучин үнэ (₮)">
          <input
            type="number"
            min="0"
            value={values.oldPrice}
            onChange={(e) => set("oldPrice", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Хоосон = хямдрал байхгүй"
          />
        </Field>
      </div>

      <Field label="Зураг *">
        <div className="space-y-2">
          {values.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.image}
              alt="preview"
              className="w-full h-40 object-contain rounded-lg border border-gray-200 bg-gray-50"
            />
          )}
          <CldUploadWidget
            uploadPreset={undefined}
            signatureEndpoint="/api/admin/sign-upload"
            onSuccess={(result) => {
              const info = result.info as { secure_url: string };
              if (info?.secure_url) set("image", info.secure_url);
            }}
            options={{ maxFiles: 1, resourceType: "image", folder: "bathhub/products" }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                {values.image ? "Зураг солих" : "Зураг оруулах"}
              </button>
            )}
          </CldUploadWidget>
          <input
            value={values.image}
            onChange={(e) => set("image", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Эсвэл URL оруулах: /products/toilet1.jpg"
          />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ангилал *">
          <select
            required
            value={values.categorySlug}
            onChange={(e) => set("categorySlug", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Нэгж">
          <input
            value={values.unit}
            onChange={(e) => set("unit", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="1ш"
          />
        </Field>
      </div>

      <Field label="Нөөц">
        <input
          type="number"
          min="0"
          value={values.stock}
          onChange={(e) => set("stock", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={values.isNew}
            onChange={(e) => set("isNew", e.target.checked)}
            className="rounded"
          />
          Шинэ бүтээгдэхүүн
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
            className="rounded"
          />
          Онцлох
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Хадгалж байна..." : productId ? "Шинэчлэх" : "Үүсгэх"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Цуцлах
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
