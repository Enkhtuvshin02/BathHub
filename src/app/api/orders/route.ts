import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-utils";
import { generateOrderId } from "@/lib/checkout";

function serializeOrder(o: Awaited<ReturnType<typeof fetchOrder>>) {
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
      label: o.addrLabel,
      city: o.addrCity,
      district: o.addrDistrict,
      khoroo: o.addrKhoroo,
      detail: o.addrDetail,
      otherRecipient: false,
    },
    customer: {
      firstName: o.custFirstName,
      lastName: o.custLastName,
      phone: o.custPhone,
      email: o.custEmail,
      receiptType: o.receiptType as "personal" | "company",
    },
    items: o.items.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        categorySlug: item.product.categorySlug,
        rating: item.product.rating,
        stock: item.product.stock,
        isNew: item.product.isNew,
        isFeatured: item.product.isFeatured,
        unit: item.product.unit ?? undefined,
        oldPrice: item.product.oldPrice ?? undefined,
      },
      qty: item.qty,
    })),
  };
}

async function fetchOrder(id: string, userId: string) {
  return db.order.findFirstOrThrow({
    where: { id, userId },
    include: { items: { include: { product: true } } },
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const orders = await db.order.findMany({
    where: { userId: session.sub },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders.map(serializeOrder));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтэрч орно уу." }, { status: 401 });

  const body = await req.json();
  const { address, customer, items, subtotal, discount, delivery, ecoBag, total, paymentMethod } = body;

  const id = generateOrderId();

  const order = await db.order.create({
    data: {
      id,
      userId: session.sub,
      addrLabel: address.label,
      addrCity: address.city,
      addrDistrict: address.district,
      addrKhoroo: address.khoroo,
      addrDetail: address.detail,
      custFirstName: customer.firstName,
      custLastName: customer.lastName,
      custPhone: customer.phone,
      custEmail: customer.email,
      receiptType: customer.receiptType,
      subtotal,
      discount: discount ?? 0,
      delivery,
      ecoBag,
      total,
      status: "pending",
      paymentMethod: paymentMethod ?? "bank",
      items: {
        create: items.map((line: { product: { id: string; price: number }; qty: number }) => ({
          productId: line.product.id,
          qty: line.qty,
          price: line.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(serializeOrder(order), { status: 201 });
}
