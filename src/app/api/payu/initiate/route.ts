import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPayuRequestHash, PAYU_PAYMENT_URL, payuConfig } from "@/lib/payu";
import { findCoupon } from "@/lib/coupons";
import { couponDiscount } from "@/lib/coupon-shared";
import { computeShippingCharge, SITE_DEFAULTS, type SiteSettings } from "@/lib/site-settings";

type Item = { id: string; quantity: number };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      items?: Item[]; fullName?: string; email?: string; phone?: string;
      address?: string; landmark?: string; city?: string; state?: string;
      pincode?: string; shippingMethod?: string; couponCode?: string;
    };
    const items = body.items || [];
    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    if (!items.length || !fullName || !email || !body.phone || !body.address || !body.city || !body.pincode) {
      return NextResponse.json({ error: "Complete delivery and contact details are required" }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || !/^\d{6}$/.test(body.pincode)) {
      return NextResponse.json({ error: "Enter a valid email and pincode" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: settingsRow } = await admin.from("site_settings").select("*").eq("id", 1).maybeSingle();
    const settings: SiteSettings = { ...SITE_DEFAULTS, ...(settingsRow ?? {}) };

    const ids = items.map((item) => item.id);
    const { data: books, error: booksError } = await admin
      .from("books").select("id,title,price,is_active,in_stock").in("id", ids);
    if (booksError) throw booksError;
    if (!books || books.length !== new Set(ids).size) {
      return NextResponse.json({ error: "One or more books are unavailable" }, { status: 400 });
    }

    const byId = new Map(books.map((book) => [book.id, book]));
    const subtotal = items.reduce((total, item) => {
      const book = byId.get(item.id);
      if (!book || !book.is_active || !book.in_stock || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        throw new Error("A selected book is unavailable");
      }
      return total + Number(book.price) * item.quantity;
    }, 0);
    const coupon = typeof body.couponCode === "string" ? await findCoupon(body.couponCode) : null;
    const discount = couponDiscount(coupon, subtotal);
    const shippingMethod = body.shippingMethod === "express" ? "express" : "standard";
    const shipping = computeShippingCharge(settings, shippingMethod, subtotal);
    const amount = Math.max(1, subtotal - discount + shipping);
    const txnid = `DEV${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const order = {
      id: crypto.randomUUID(), order_number: orderNumber, customer_name: fullName,
      customer_email: email, customer_phone: body.phone, total_amount: amount,
      order_status: "pending", payment_status: "pending", payment_gateway: "payu",
      payment_method: "online", gateway_order_id: txnid,
      shipping_address: body.address, landmark: body.landmark || null, city: body.city,
      state: body.state || null, pincode: body.pincode,
      shipping_method: shippingMethod, subtotal_amount: subtotal, discount_amount: discount,
      coupon_code: coupon?.code ?? null, shipping_charge: shipping, cod_fee: 0,
    };
    const { error: orderError } = await admin.from("orders").insert(order);
    if (orderError) throw orderError;
    const { error: itemsError } = await admin.from("order_items").insert(items.map((item) => ({
      id: crypto.randomUUID(), order_id: order.id, book_id: item.id,
      product_name: byId.get(item.id)?.title, product_sku: item.id,
      quantity: item.quantity, unit_price: Number(byId.get(item.id)?.price),
    })));
    if (itemsError) {
      await admin.from("orders").delete().eq("id", order.id);
      throw itemsError;
    }
    const { key } = payuConfig();
    const productinfo = items.map((item) => `${byId.get(item.id)?.title} x${item.quantity}`).join(", ").slice(0, 200);
    const callback = `${request.nextUrl.origin}/api/payu/callback`;
    const fields: Record<string, string> = {
      key, txnid, amount: amount.toFixed(2), productinfo, firstname: fullName,
      email, phone: body.phone, surl: callback, furl: callback, service_provider: "payu_paisa",
      udf1: order.id, udf2: orderNumber, udf3: "", udf4: "", udf5: "",
    };
    fields.hash = createPayuRequestHash({
      key, txnid, amount: fields.amount, productinfo, firstname: fullName, email,
      udf1: order.id, udf2: orderNumber,
    });
    return NextResponse.json({ action: PAYU_PAYMENT_URL, fields });
  } catch (error) {
    console.error("PayU initiation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start payment" }, { status: 500 });
  }
}
