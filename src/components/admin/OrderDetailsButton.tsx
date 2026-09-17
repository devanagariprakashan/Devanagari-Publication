"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Eye, ExternalLink, Truck, Zap } from "lucide-react";

type OrderItem = {
  id: string;
  book_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  books: { image_url: string | null } | null;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_gateway: string | null;
  payment_method: string | null;
  gateway_order_id: string | null;
  payment_id: string | null;
  shipping_address: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  shipment_status: string | null;
  shipment_id: string | null;
  awb_number: string | null;
  shipment_error: string | null;
  shipping_method: string | null;
  subtotal_amount: number | null;
  discount_amount: number | null;
  coupon_code: string | null;
  shipping_charge: number | null;
  cod_fee: number | null;
  created_at: string;
  order_items: OrderItem[];
};

export function OrderDetailsButton({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const items = order.order_items ?? [];
  const isExpress = order.shipping_method === "express";
  const hasBreakdown = order.subtotal_amount != null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order {order.order_number}</h3>
                <p className="text-xs text-gray-500">
                  Placed {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</h4>
                <p className="text-sm font-medium text-gray-900">{order.customer_name ?? "—"}</p>
                <p className="text-sm text-gray-600">{order.customer_email ?? "—"}</p>
                <p className="text-sm text-gray-600">{order.customer_phone ?? "—"}</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {order.shipping_address ?? "—"}
                  {order.landmark ? `, ${order.landmark}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {[order.city, order.state, order.pincode].filter(Boolean).join(", ") || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</h4>
                <p className="text-sm text-gray-600">
                  Method: <span className="font-medium text-gray-900">{order.payment_method ?? "—"}</span>
                  {order.payment_gateway ? ` (${order.payment_gateway})` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium text-gray-900">{order.payment_status}</span>
                </p>
                {order.gateway_order_id && (
                  <p className="truncate text-xs text-gray-400">Txn: {order.gateway_order_id}</p>
                )}
                {order.payment_id && (
                  <p className="truncate text-xs text-gray-400">Payment ID: {order.payment_id}</p>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Shipment</h4>
                <p className="flex items-center gap-1.5 text-sm text-gray-600">
                  Delivery:
                  <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                    {isExpress ? <Zap className="h-3.5 w-3.5 text-amber-500" /> : <Truck className="h-3.5 w-3.5 text-gray-500" />}
                    {isExpress ? "Express" : "Standard"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium text-gray-900">{order.shipment_status ?? "pending"}</span>
                </p>
                <p className="text-sm text-gray-600">AWB: {order.awb_number ?? "—"}</p>
                {order.shipment_error && (
                  <p className="text-xs text-red-600">Error: {order.shipment_error}</p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200">
              <h4 className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Items ({items.length})
              </h4>
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium">SKU</th>
                    <th className="px-4 py-2 font-medium">Qty</th>
                    <th className="px-4 py-2 font-medium">Unit Price</th>
                    <th className="px-4 py-2 font-medium">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-3 text-gray-400" colSpan={5}>No items recorded for this order.</td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const thumb = item.books?.image_url ?? "/images/books/image-2.png";
                      const content = (
                        <span className="flex items-center gap-2.5">
                          <span className="relative h-9 w-7 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                            <Image src={thumb} alt={item.product_name} fill className="object-cover" sizes="28px" />
                          </span>
                          <span className="truncate">{item.product_name}</span>
                          {item.book_id && <ExternalLink className="h-3 w-3 shrink-0 text-gray-400" />}
                        </span>
                      );
                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-gray-900">
                            {item.book_id ? (
                              <Link
                                href={`/product/${item.book_id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center hover:text-brand-600 hover:underline"
                              >
                                {content}
                              </Link>
                            ) : (
                              content
                            )}
                          </td>
                          <td className="px-4 py-2 text-gray-500">{item.product_sku ?? "—"}</td>
                          <td className="px-4 py-2 text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-2 text-gray-700">₹{item.unit_price}</td>
                          <td className="px-4 py-2 font-medium text-gray-900">₹{item.unit_price * item.quantity}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
              {hasBreakdown ? (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums">₹{order.subtotal_amount}</span>
                  </div>
                  {(order.discount_amount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                      <span className="tabular-nums">-₹{order.discount_amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charge</span>
                    <span className="tabular-nums">
                      {(order.shipping_charge ?? 0) > 0 ? `₹${order.shipping_charge}` : "Free"}
                    </span>
                  </div>
                  {(order.cod_fee ?? 0) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>COD Handling Fee</span>
                      <span className="tabular-nums">₹{order.cod_fee}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400">Price breakdown wasn&apos;t recorded for this order.</p>
              )}
              <div className="flex justify-end pt-2">
                <span className="text-sm font-semibold text-gray-900">
                  Total Amount: <span className="text-brand-600">₹{order.total_amount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
