import type { Category, Product } from "./types";

// BathMall.mn — bathroom & sanitaryware categories (Mongolian).
export const categories: Category[] = [
  { slug: "unitaz", name: "Унитаз" },
  { slug: "ugaaltuur", name: "Угаалтуур" },
  { slug: "bide", name: "Биде" },
  { slug: "holigch", name: "Холигч, цорго" },
  { slug: "shurshuur", name: "Шүршүүр" },
  { slug: "vann", name: "Ванн" },
  { slug: "dush-cabin", name: "Душны кабин" },
  { slug: "toli", name: "Толь" },
  { slug: "tavilga", name: "Угаалгын өрөөний тавилга" },
  { slug: "dagaldah", name: "Дагалдах хэрэгсэл" },
  { slug: "radiator", name: "Халаагч радиатор" },
];

// Public images from the Unsplash CDN (free-licensed, hotlink-friendly).
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

// Products — bathroom/sanitaryware catalog with realistic Mongolian names + ₮ prices.
export const products: Product[] = [
  // Унитаз
  { id: "bm-1001", name: "Хана дүүжин унитаз softclose суултуртай", price: 450000, oldPrice: 520000, image: img("1569597967185-cd6120712154"), categorySlug: "unitaz", rating: 0, stock: 40, unit: "1ш", isFeatured: true },
  { id: "bm-1002", name: "Шалны унитаз бачокны хамт", price: 320000, image: img("1617400549598-84806b847c1a"), categorySlug: "unitaz", rating: 0, stock: 65, unit: "1ш", isNew: true },
  { id: "bm-1003", name: "Компакт унитаз цагаан керамик", price: 280000, image: img("1660199581040-72f23500098e"), categorySlug: "unitaz", rating: 0, stock: 80, unit: "1ш" },

  // Угаалтуур
  { id: "bm-1101", name: "Гранит угаалтуур цагаан 60см", price: 165000, image: img("1605635542594-d94a74f72399"), categorySlug: "ugaaltuur", rating: 0, stock: 120, unit: "1ш", isFeatured: true },
  { id: "bm-1102", name: "Ширээний угаалтуур дугуй хэлбэртэй", price: 98000, image: img("1780399370211-1149b7776337"), categorySlug: "ugaaltuur", rating: 0, stock: 90, unit: "1ш", isNew: true },
  { id: "bm-1103", name: "Хос угаалтуур шкафтай 120см", price: 540000, oldPrice: 600000, image: img("1769763917830-7b9c8317329d"), categorySlug: "ugaaltuur", rating: 0, stock: 25, unit: "1ш" },

  // Биде
  { id: "bm-1201", name: "Электрон биде халуун усны функцтэй", price: 890000, image: img("1581309637759-ee82f7b94b2d"), categorySlug: "bide", rating: 0, stock: 15, unit: "1ш", isFeatured: true, isNew: true },
  { id: "bm-1202", name: "Хана дүүжин биде керамик", price: 240000, image: img("1518618750560-8f07abde4e4e"), categorySlug: "bide", rating: 0, stock: 35, unit: "1ш" },

  // Холигч, цорго
  { id: "bm-1301", name: "Угаалтуурын холигч хром", price: 75000, image: img("1562069028-92f10e37ac9d"), categorySlug: "holigch", rating: 0, stock: 200, unit: "1ш", isFeatured: true },
  { id: "bm-1302", name: "Гал тогооны холигч өндөр цорготой", price: 120000, image: img("1669920282671-e2f03e99513f"), categorySlug: "holigch", rating: 0, stock: 140, unit: "1ш", isNew: true },
  { id: "bm-1303", name: "Ваннны холигч шүршүүртэй", price: 145000, oldPrice: 165000, image: img("1593523474914-2a4fd54075dc"), categorySlug: "holigch", rating: 0, stock: 110, unit: "1ш" },

  // Шүршүүр
  { id: "bm-1401", name: "Борооны шүршүүр 30см толгойтой", price: 185000, image: img("1561361398-d1f7b6cfee79"), categorySlug: "shurshuur", rating: 0, stock: 70, unit: "1ш", isFeatured: true },
  { id: "bm-1402", name: "Гар шүршүүр 3 горимтой", price: 35000, image: img("1698724624855-e9dbc5a0bddb"), categorySlug: "shurshuur", rating: 0, stock: 260, unit: "1ш", isNew: true },
  { id: "bm-1403", name: "Шүршүүрийн систем термостаттай", price: 420000, image: img("1576678433413-202829a1ab98"), categorySlug: "shurshuur", rating: 0, stock: 30, unit: "1ш" },

  // Ванн
  { id: "bm-1501", name: "Акрилан ванн 170см", price: 680000, oldPrice: 750000, image: img("1620626011761-996317b8d101"), categorySlug: "vann", rating: 0, stock: 20, unit: "1ш", isFeatured: true },
  { id: "bm-1502", name: "Чугуун ванн сонгодог хэлбэртэй", price: 1250000, image: img("1521783593447-5702b9bfd267"), categorySlug: "vann", rating: 0, stock: 8, unit: "1ш" },
  { id: "bm-1503", name: "Булангийн ванн 150x150", price: 720000, image: img("1644068298141-6333cb147520"), categorySlug: "vann", rating: 0, stock: 12, unit: "1ш", isNew: true },

  // Душны кабин
  { id: "bm-1601", name: "Душны кабин 90x90 шилэн хаалгатай", price: 950000, image: img("1580750494923-a06004b452cd"), categorySlug: "dush-cabin", rating: 0, stock: 18, unit: "1ш", isFeatured: true, isNew: true },
  { id: "bm-1602", name: "Душны бокс гидромассажтай", price: 1850000, image: img("1608651061499-ff031fbf6645"), categorySlug: "dush-cabin", rating: 0, stock: 6, unit: "1ш" },

  // Толь
  { id: "bm-1701", name: "LED гэрэлтэй угаалгын өрөөний толь 70см", price: 175000, image: img("1519087630026-63fb0dab69bb"), categorySlug: "toli", rating: 0, stock: 55, unit: "1ш", isFeatured: true, isNew: true },
  { id: "bm-1702", name: "Дугуй толь антик хүрээтэй", price: 95000, image: img("1663659504863-43dd69a5fda2"), categorySlug: "toli", rating: 0, stock: 75, unit: "1ш" },

  // Угаалгын өрөөний тавилга
  { id: "bm-1801", name: "Угаалтуурын шкаф 80см 2 хаалгатай", price: 380000, image: img("1595156066164-410d89ad9a4f"), categorySlug: "tavilga", rating: 0, stock: 28, unit: "1ш", isFeatured: true },
  { id: "bm-1802", name: "Өлгүүр шкаф толин хаалгатай", price: 210000, image: img("1630699144606-4bb0525961f4"), categorySlug: "tavilga", rating: 0, stock: 44, unit: "1ш", isNew: true },

  // Дагалдах хэрэгсэл
  { id: "bm-1901", name: "Алчуур өлгүүр зэвэрдэггүй ган", price: 28000, image: img("1656646523991-a04588a99770"), categorySlug: "dagaldah", rating: 0, stock: 300, unit: "1ш", isNew: true },
  { id: "bm-1902", name: "Угаалгын өрөөний 5 хэсэгтэй иж бүрдэл", price: 65000, oldPrice: 78000, image: img("1589898362790-edba11d34869"), categorySlug: "dagaldah", rating: 0, stock: 130, unit: "1 иж" },

  // Халаагч радиатор
  { id: "bm-2001", name: "Халаагч радиатор алчуур хатаагч 60x80", price: 195000, image: img("1711059949530-a3057eac6f1c"), categorySlug: "radiator", rating: 0, stock: 50, unit: "1ш", isFeatured: true, isNew: true },
  { id: "bm-2002", name: "Цахилгаан алчуур хатаагч хром", price: 145000, image: img("1595182939836-5d4ba24ae7bf"), categorySlug: "radiator", rating: 0, stock: 60, unit: "1ш" },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export const formatPrice = (n: number) => `${n.toLocaleString("en-US")}₮`;
