import type { Category, Product } from "./types";

// BathHub — bathroom & sanitaryware categories (Mongolian).
export const categories: Category[] = [
  { slug: "unitaz", name: "Суултуур" },
  { slug: "ugaaltuur", name: "Угаалтуур" },
  { slug: "bide", name: "Биде" },
  { slug: "shurshuur", name: "Шүршүүр" },
  { slug: "combo", name: "Иж бүрдэл" },
];

const img = (name: string) => `/products/${name}`;

export const products: Product[] = [
  // Суултуур
  { id: "bh-1001", name: "Шалны суултуур", price: 320000, image: img("toilet1.jpg"), categorySlug: "unitaz", rating: 0, stock: 40, unit: "1ш" },
  { id: "bh-1002", name: "Ханан суултуур", price: 450000, oldPrice: 520000, image: img("toilet2.jpeg"), categorySlug: "unitaz", rating: 0, stock: 65, unit: "1ш", isFeatured: true },
  { id: "bh-1003", name: "Хана дүүжин суултуур", price: 580000, image: img("toilet3.jpeg"), categorySlug: "unitaz", rating: 0, stock: 30, unit: "1ш", isNew: true },
  { id: "bh-1004", name: "Компакт суултуур", price: 280000, image: img("toilet4.jpeg"), categorySlug: "unitaz", rating: 0, stock: 55, unit: "1ш" },

  // Угаалтуур
  { id: "bh-2001", name: "Угаалтуур алтан цорготой", price: 420000, oldPrice: 480000, image: img("sink1.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 20, unit: "1ш", isFeatured: true },
  { id: "bh-2002", name: "Угаалтуур цагаан шкафтай", price: 185000, image: img("sink2.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 45, unit: "1ш" },
  { id: "bh-2003", name: "Хос угаалтуур модон шкафтай", price: 680000, oldPrice: 750000, image: img("sink3.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 15, unit: "1ш", isFeatured: true },
  { id: "bh-2004", name: "Дугуй угаалтуур", price: 145000, image: img("sink4.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 60, unit: "1ш", isNew: true },
  { id: "bh-2005", name: "Зууван угаалтуур", price: 320000, image: img("sink5.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 35, unit: "1ш" },
  { id: "bh-2006", name: "Угаалтуур налуун модон шкафтай", price: 480000, image: img("sink6.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 18, unit: "1ш", isNew: true },
  { id: "bh-2007", name: "Чулуун угаалтуур", price: 195000, image: img("sink7.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 40, unit: "1ш" },
  { id: "bh-2008", name: "Тэгш өнцөгт угаалтуур", price: 120000, image: img("sink8.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 70, unit: "1ш" },
  { id: "bh-2009", name: "Хос угаалтуур цагаан шкафтай", price: 540000, oldPrice: 600000, image: img("sink9.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 12, unit: "1ш", isFeatured: true },
  { id: "bh-2010", name: "Угаалтуур гантиг тавцантай", price: 260000, image: img("sink10.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 30, unit: "1ш" },
  { id: "bh-2011", name: "Угаалтуур модон тавцантай", price: 240000, image: img("sink11.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 25, unit: "1ш", isNew: true },
  { id: "bh-2012", name: "Урт угаалтуур модон шкафтай", price: 380000, image: img("sink12.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 20, unit: "1ш" },
  { id: "bh-2013", name: "Угаалтуур ногоон шкафтай", price: 520000, oldPrice: 580000, image: img("sink13.jpg"), categorySlug: "ugaaltuur", rating: 0, stock: 10, unit: "1ш", isNew: true },

  // Биде
  { id: "bh-3001", name: "Электрон биде суудал", price: 890000, image: img("bidet1.jpg"), categorySlug: "bide", rating: 0, stock: 15, unit: "1ш", isFeatured: true, isNew: true },

  // Шүршүүр
  { id: "bh-4001", name: "Шүршүүрийн багана хром", price: 285000, oldPrice: 320000, image: img("shower1.jpg"), categorySlug: "shurshuur", rating: 0, stock: 50, unit: "1ш", isFeatured: true },
  { id: "bh-4002", name: "Гар шүршүүр", price: 65000, image: img("shower2.jpg"), categorySlug: "shurshuur", rating: 0, stock: 120, unit: "1ш", isNew: true },
  { id: "bh-4003", name: "Шүршүүрийн багана хар матт", price: 340000, image: img("shower3.jpg"), categorySlug: "shurshuur", rating: 0, stock: 35, unit: "1ш" },

  // Иж бүрдэл
  { id: "bh-5001", name: "Угаалтуур ба суултуурын иж бүрдэл", price: 680000, oldPrice: 780000, image: img("sink_toilet_combo1.jpg"), categorySlug: "combo", rating: 0, stock: 12, unit: "1 иж", isFeatured: true },
  { id: "bh-5002", name: "Тансаг угаалгын өрөөний иж бүрдэл", price: 920000, image: img("sink_toilet_combo2.jpg"), categorySlug: "combo", rating: 0, stock: 6, unit: "1 иж", isNew: true },
  { id: "bh-5003", name: "Угаалтуур ба суултуурын иж бүрдэл хар", price: 750000, image: img("sink_toilet_combo3.jpg"), categorySlug: "combo", rating: 0, stock: 8, unit: "1 иж" },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export const formatPrice = (n: number) => `${n.toLocaleString("en-US")}₮`;
