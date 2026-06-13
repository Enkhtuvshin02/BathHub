import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { categories, products } from "../src/lib/data";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter });

async function main() {
  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { slug: cat.slug, name: cat.name },
    });
  }

  for (const p of products) {
    await db.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        categorySlug: p.categorySlug,
        rating: p.rating,
        stock: p.stock,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        unit: p.unit ?? null,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        categorySlug: p.categorySlug,
        rating: p.rating,
        stock: p.stock,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        unit: p.unit ?? null,
      },
    });
  }

  const hash = await bcrypt.hash("demo1234", 10);
  await db.user.upsert({
    where: { email: "tuvshin674@gmail.com" },
    update: {},
    create: {
      email: "tuvshin674@gmail.com",
      password: hash,
      firstName: "Энхтүвшин",
      lastName: "Энхтайван",
      phone: "86155401",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
