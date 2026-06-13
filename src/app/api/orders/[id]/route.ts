import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-utils";

function serializeOrder(o: {
  id: string; createdAt: Date; status: string; subtotal: number; discount: number;
  delivery: number; ecoBag: number; total: number; paymentMethod: string | null;
  addrLabel: string; addrCity: string; addrDistrict: string; addrKhoroo: string; addrDetail: string;
  custFirstName: string; custLastName: string; custPhone: string; custEmail: string; receiptType: string;
  items: {
    product: { id: string; name: string; image: string; categorySlug: string; rating: number; stock: number;
      isNew: boolean; isFeatured: boolean; unit: string | null; oldPrice: number | null };
    qty: number; price: number;
  }[];
}) {
  return {
    id: o.id,
    createdAt: o.createdAt.getTime(),
    status: o.status,
    subtotal: o.subtotal,
    discount: o.discount,
    delivery: o.delivery,
    ecoBag: o.ecoBag,
    total: o.total,
    paymentMethod: o.paymentMethod,
    address: {
      label: o.addrLabel, city: o.addrCity, district: o.addrDistrict,
      khoroo: o.addrKhoroo, detail: o.addrDetail, otherRecipient: false,
    },
    customer: {
      firstName: o.custFirstName, lastName: o.custLastName,
      phone: o.custPhone, email: o.custEmail,
      receiptType: o.receiptType as "personal" | "company",
    },
    items: o.items.map((item) => ({
      product: {
        id: item.product.id, name: item.product.name, price: item.price,
        image: item.product.image, categorySlug: item.product.categorySlug,
        rating: item.product.rating, stock: item.product.stock,
        isNew: item.product.isNew, isFeatured: item.product.isFeatured,
        unit: item.product.unit ?? undefined,
        oldPrice: item.product.oldPrice ?? undefined,
      },
      qty: item.qty,
    })),
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json(null, { status: 401 });
  const { id } = await params;
  const order = await db.order.findFirst({
    where: { id, userId: session.sub },
    include: { items: { include: { product: true } } },
  });
  if (!order) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(serializeOrder(order));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json(null, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();

  if (!["cancelled", "paid"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await db.order.findFirst({ where: { id, userId: session.sub } });
  if (!existing) return NextResponse.json(null, { status: 404 });

  const updated = await db.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(serializeOrder(updated));
}
