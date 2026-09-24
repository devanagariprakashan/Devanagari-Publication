import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createIthinkShipment } from "@/lib/ithink";
import { findCoupon } from "@/lib/coupons";
import { couponDiscount } from "@/lib/coupon-shared";
import { checkCodEligibility, computeShippingCharge, SITE_DEFAULTS, type SiteSettings } from "@/lib/site-settings";

type Item = { id: string; quantity: number };

export async function POST(request: Request) {
  try {
    const body = await request.json() as { items?: Item[]; fullName?: string; email?: string; phone?: string; address?: string; landmark?: string; city?: string; state?: string; pincode?: string; shippingMethod?: string; couponCode?: string };
    const items = body.items || [];
    if (!items.length || !body.fullName?.trim() || !body.email?.trim() || !body.phone || !body.address?.trim() || !body.city?.trim() || !/^\d{6}$/.test(body.pincode || "")) {
      return NextResponse.json({ error: "Complete delivery and contact details are required" }, { status: 400 });
    }
    const admin = createAdminClient();
    const { data: settingsRow } = await admin.from("site_settings").select("*").eq("id", 1).maybeSingle();
    const settings: SiteSettings = { ...SITE_DEFAULTS, ...(settingsRow ?? {}) };

    const { data: books, error: booksError } = await admin.from("books").select("id,title,price,is_active,in_stock").in("id", items.map((item) => item.id));
    if (booksError) throw booksError;
    if (!books || books.length !== new Set(items.map((item) => item.id)).size) return NextResponse.json({ error: "One or more books are unavailable" }, { status: 400 });
    const byId = new Map(books.map((book) => [book.id, book]));
    const subtotal = items.reduce((total, item) => {
      const book = byId.get(item.id);
      if (!book || !book.is_active || !book.in_stock || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) throw new Error("A selected book is unavailable");
      return total + Number(book.price) * item.quantity;
    }, 0);

    const codEligibility = checkCodEligibility(settings, subtotal);
    if (!codEligibility.eligible) {
      return NextResponse.json({ error: codEligibility.reason || "Cash on Delivery is unavailable for this order" }, { status: 400 });
    }

    const coupon = typeof body.couponCode === "string" ? await findCoupon(body.couponCode) : null;
    const discount = couponDiscount(coupon, subtotal);
    const shippingMethod = body.shippingMethod === "express" ? "express" : "standard";
    const shipping = computeShippingCharge(settings, shippingMethod, subtotal);
    const amount = Math.max(1, subtotal - discount + shipping + settings.cod_fee);
    const order = { id: crypto.randomUUID(), order_number: `ORD-${Date.now().toString().slice(-8)}`, customer_name: body.fullName.trim(), customer_email: body.email.trim().toLowerCase(), customer_phone: body.phone, total_amount: amount, order_status: "confirmed", payment_status: "pending", payment_method: "cod", shipping_address: body.address.trim(), landmark: body.landmark || null, city: body.city.trim(), state: body.state || null, pincode: body.pincode, shipment_status: "pending", shipping_method: shippingMethod, subtotal_amount: subtotal, discount_amount: discount, coupon_code: coupon?.code ?? null, shipping_charge: shipping, cod_fee: settings.cod_fee };
    const { error: orderError } = await admin.from("orders").insert(order);
    if (orderError) throw orderError;
    const { error: itemsError } = await admin.from("order_items").insert(items.map((item) => ({ id: crypto.randomUUID(), order_id: order.id, book_id: item.id, product_name: byId.get(item.id)?.title, product_sku: item.id, quantity: item.quantity, unit_price: Number(byId.get(item.id)?.price) })));
    if (itemsError) { await admin.from("orders").delete().eq("id", order.id); throw itemsError; }
    await createIthinkShipment(order.id);
    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number, totalAmount: order.total_amount });
  } catch (error) {
    console.error("COD order creation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create COD order" }, { status: 500 });
  }
}
