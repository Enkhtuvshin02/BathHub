import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { name, price, oldPrice, image, categorySlug, stock, isNew, isFeatured, unit } = body;

  const product = await db.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price: Number(price) }),
      ...(oldPrice !== undefined && { oldPrice: oldPrice ? Number(oldPrice) : null }),
      ...(image !== undefined && { image }),
      ...(categorySlug !== undefined && { categorySlug }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(isNew !== undefined && { isNew: Boolean(isNew) }),
      ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      ...(unit !== undefined && { unit: unit || null }),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.product.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
