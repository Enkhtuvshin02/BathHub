export type Category = {
  slug: string;
  name: string; // Mongolian label, exactly as on 100ail.mn
};

export type Product = {
  id: string;
  name: string;
  price: number; // in tögrög (₮)
  oldPrice?: number; // present when discounted
  image: string;
  categorySlug: string;
  rating: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  unit?: string; // e.g. "1ш", "1 уут"
};
