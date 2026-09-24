"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  ExternalLink,
  Eye,
  Copy,
  Check,
  Phone,
  MessageCircle,
  MapPin,
  CreditCard,
  Calendar,
  ArrowUpDown,
  Zap,
  BookOpen,
  X,
  IndianRupee,
} from "lucide-react";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";
import { CreateShipmentButton } from "./CreateShipmentButton";
import { TrackShipmentButton } from "./TrackShipmentButton";
import { DeleteButton } from "./DeleteButton";
import { btnSecondary, card, pageTitle } from "./ui";

export type OrderItem = {
  id: string;
  book_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  books: { image_url: string | null } | null;
};

export type Order = {
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
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  order_items: OrderItem[];
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    border: "border-indigo-200",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    border: "border-rose-200",
  },
};

function needsPriorityDispatch(order: Order): boolean {
  return (
    order.shipping_method === "express" &&
    !order.awb_number &&
    order.order_status !== "cancelled" &&
    order.order_status !== "delivered"
  );
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersManager({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const nonCancelled = orders.filter((o) => o.order_status !== "cancelled");
    const grossRevenue = nonCancelled.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const pendingOrders = orders.filter(
      (o) => o.order_status === "pending" || o.order_status === "confirmed"
    ).length;
    const shippedOrders = orders.filter((o) => o.order_status === "shipped").length;
    const deliveredOrders = orders.filter((o) => o.order_status === "delivered").length;
    const aov = nonCancelled.length > 0 ? Math.round(grossRevenue / nonCancelled.length) : 0;

    return { totalOrders, grossRevenue, pendingOrders, shippedOrders, deliveredOrders, aov };
  }, [orders]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.order_status] !== undefined) {
        counts[o.order_status]++;
      }
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (selectedStatusTab !== "all" && order.order_status !== selectedStatusTab) {
          return false;
        }

        if (paymentFilter === "paid" && order.payment_status?.toLowerCase() !== "paid") {
          return false;
        }
        if (
          paymentFilter === "cod" &&
          !order.payment_method?.toLowerCase().includes("cod") &&
          !order.payment_status?.toLowerCase().includes("cod")
        ) {
          return false;
        }
        if (paymentFilter === "pending" && order.payment_status?.toLowerCase() === "paid") {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchOrderNum = order.order_number?.toLowerCase().includes(q);
          const matchCustName = order.customer_name?.toLowerCase().includes(q);
          const matchCustEmail = order.customer_email?.toLowerCase().includes(q);
          const matchCustPhone = order.customer_phone?.toLowerCase().includes(q);
          const matchAwb = order.awb_number?.toLowerCase().includes(q);
          const matchCity = order.city?.toLowerCase().includes(q);
          const matchItems = order.order_items?.some((i) =>
            i.product_name?.toLowerCase().includes(q)
          );

          if (
            !matchOrderNum &&
            !matchCustName &&
            !matchCustEmail &&
            !matchCustPhone &&
            !matchAwb &&
            !matchCity &&
            !matchItems
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === "highest") {
          return b.total_amount - a.total_amount;
        }
        if (sortBy === "lowest") {
          return a.total_amount - b.total_amount;
        }
        return 0;
      });
  }, [orders, selectedStatusTab, paymentFilter, searchQuery, sortBy]);

  const exportToCSV = () => {
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Shipping Address",
      "City",
      "State",
      "Pincode",
      "Items Count",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Shipment Status",
      "AWB Number",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toISOString()}"`,
      `"${(o.customer_name ?? "").replace(/"/g, '""')}"`,
      `"${o.customer_email ?? ""}"`,
      `"${o.customer_phone ?? ""}"`,
      `"${(o.shipping_address ?? "").replace(/"/g, '""')}"`,
      `"${o.city ?? ""}"`,
      `"${o.state ?? ""}"`,
      `"${o.pincode ?? ""}"`,
      o.order_items?.length ?? 0,
      o.total_amount,
      `"${o.payment_method ?? ""}"`,
      `"${o.payment_status ?? ""}"`,
      `"${o.order_status}"`,
      `"${o.shipment_status ?? ""}"`,
      `"${o.awb_number ?? ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Devanagari_Orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={pageTitle}>Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Track orders, payments, and shipments.</p>
        </div>
        <button type="button" onClick={exportToCSV} className={btnSecondary}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className={card + " p-5"}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <IndianRupee className="h-4 w-4" />
            Revenue
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹{stats.grossRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-400">Avg order ₹{stats.aov}</p>
        </div>

        <div className={card + " p-5"}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShoppingBag className="h-4 w-4" />
            Total Orders
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="mt-1 text-xs text-gray-400">All time</p>
        </div>

        <div className={card + " p-5"}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Pending
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          <p className="mt-1 text-xs text-gray-400">Needs dispatch</p>
        </div>

        <div className={card + " p-5"}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck className="h-4 w-4" />
            Shipped
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.shippedOrders}</p>
          <p className="mt-1 text-xs text-gray-400">In transit</p>
        </div>

        <div className={card + " col-span-2 p-5 sm:col-span-1"}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4" />
            Delivered
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
          <p className="mt-1 text-xs text-gray-400">
            {stats.totalOrders > 0
              ? `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}% of all orders`
              : "0%"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "confirmed", label: "Confirmed" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => {
            const isCur = selectedStatusTab === tab.id;
            const count = tabCounts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  isCur
                    ? "bg-brand-600 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-semibold ${
                    isCur ? "bg-white/20" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-lg flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, customer, email, phone, city, or AWB"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5">
              <CreditCard className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="cursor-pointer bg-transparent text-xs font-medium text-gray-700 focus:outline-none"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid Only</option>
                <option value="cod">COD Orders</option>
                <option value="pending">Unpaid / Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="cursor-pointer bg-transparent text-xs font-medium text-gray-700 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Amount: High to Low</option>
                <option value="lowest">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="whitespace-nowrap border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total & Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Shipment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map((order) => {
                const isPaid = order.payment_status?.toLowerCase() === "paid";
                const isCOD =
                  order.payment_method?.toLowerCase().includes("cod") ||
                  order.payment_status?.toLowerCase().includes("cod");
                const cleanPhone = (order.customer_phone ?? "").replace(/\D/g, "");
                const isExpress = order.shipping_method === "express";

                const initials = (order.customer_name ?? "Customer")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    {/* Order number & date */}
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-900">
                            {order.order_number}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(order.order_number, order.id)}
                            title="Copy order number"
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                          >
                            {copiedId === order.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {isExpress && (
                          <span
                            className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              needsPriorityDispatch(order)
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <Zap className="h-2.5 w-2.5" />
                            {needsPriorityDispatch(order) ? "Express · Dispatch Now" : "Express"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                          {initials}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <p className="truncate font-medium text-gray-900">
                            {order.customer_name ?? "Guest"}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {order.customer_email ?? "No email"}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            {order.customer_phone && (
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600"
                              >
                                <Phone className="h-3 w-3" />
                                {order.customer_phone}
                              </a>
                            )}
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(order.customer_name || "")},%20we%20are%20processing%20your%20Devanagari%20Publication%20book%20order%20${encodeURIComponent(order.order_number)}!`}
                                target="_blank"
                                rel="noreferrer"
                                title="Message on WhatsApp"
                                className="rounded p-1 text-emerald-700 hover:bg-emerald-50"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                          {order.city && (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap pt-0.5 text-xs text-gray-400">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {order.city}, {order.state ?? ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center -space-x-2">
                          {(order.order_items ?? []).slice(0, 3).map((item, idx) => {
                            const img = item.books?.image_url;
                            return (
                              <div
                                key={item.id || idx}
                                className="relative h-10 w-7 shrink-0 overflow-hidden rounded border-2 border-white bg-gray-100"
                                title={item.product_name}
                              >
                                {img ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={img} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                                    <BookOpen className="h-3.5 w-3.5" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {(order.order_items ?? []).length > 3 && (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-semibold text-gray-600">
                              +{(order.order_items?.length ?? 0) - 3}
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-1 max-w-[180px] text-xs text-gray-600">
                          {order.order_items?.[0]?.product_name ?? "Book"}
                        </p>
                        <span className="block text-xs text-gray-400">
                          {order.order_items?.reduce((s, i) => s + (i.quantity || 1), 0) || 1} units
                        </span>
                      </div>
                    </td>

                    {/* Total & payment */}
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-1">
                        <span className="font-semibold text-gray-900">
                          ₹{order.total_amount?.toLocaleString("en-IN")}
                        </span>
                        <div>
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> Paid
                            </span>
                          ) : isCOD ? (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                              <Clock className="h-3 w-3" /> COD
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
                              <AlertCircle className="h-3 w-3" /> {order.payment_status}
                            </span>
                          )}
                        </div>
                        <span className="block text-xs capitalize text-gray-400">
                          {order.payment_method || order.payment_gateway || "Online"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 align-top">
                      <InlineOrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.order_status}
                        onUpdated={(newStatus) => {
                          setOrders((prev) =>
                            prev.map((o) =>
                              o.id === order.id ? { ...o, order_status: newStatus } : o
                            )
                          );
                        }}
                      />
                    </td>

                    {/* Shipment */}
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-1.5">
                        {order.awb_number ? (
                          <div>
                            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-indigo-700">
                              <Truck className="h-3 w-3" />
                              {order.awb_number}
                            </div>
                            <div className="mt-1">
                              <TrackShipmentButton awb={order.awb_number} />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="mb-1 block text-xs text-gray-400">
                              {order.shipment_status === "failed" ? "Shipment failed" : "Unfulfilled"}
                            </span>
                            <CreateShipmentButton
                              orderId={order.id}
                              shipmentStatus={order.shipment_status}
                              isExpress={isExpress}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={btnSecondary + " px-2.5 py-1.5 text-xs"}
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </button>
                        <DeleteButton
                          action={deleteOrder}
                          id={order.id}
                          confirmMessage={`Delete order ${order.order_number}? This cannot be undone.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Search className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">No matching orders</h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
                      Try adjusting your search, status, or payment filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStatusTab("all");
                        setPaymentFilter("all");
                      }}
                      className={btnSecondary + " mt-4"}
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(newStatus) => {
            setOrders((prev) =>
              prev.map((o) => (o.id === selectedOrder.id ? { ...o, order_status: newStatus } : o))
            );
            setSelectedOrder((prev) => (prev ? { ...prev, order_status: newStatus } : null));
          }}
        />
      )}
    </div>
  );
}

function InlineOrderStatusSelect({
  orderId,
  currentStatus,
  onUpdated,
}: {
  orderId: string;
  currentStatus: string;
  onUpdated: (newStatus: string) => void;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const val = e.target.value;
        setStatus(val);
        startTransition(async () => {
          const res = await updateOrderStatus(orderId, val);
          if (!res?.error) {
            onUpdated(val);
          }
        });
      }}
      className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-50 ${cfg.bg} ${cfg.text} ${cfg.border} focus:outline-none focus:ring-1 focus:ring-brand-500`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-white text-gray-900">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}) {
  const isExpress = order.shipping_method === "express";
  const items = order.order_items ?? [];
  const cleanPhone = (order.customer_phone ?? "").replace(/\D/g, "");

  const getStepState = (step: "placed" | "confirmed" | "shipped" | "delivered") => {
    const s = order.order_status;
    if (s === "cancelled") return "cancelled";
    if (step === "placed") return "done";
    if (step === "confirmed") {
      return s === "confirmed" || s === "shipped" || s === "delivered" ? "done" : "pending";
    }
    if (step === "shipped") {
      return s === "shipped" || s === "delivered" ? "done" : "pending";
    }
    if (step === "delivered") {
      return s === "delivered" ? "done" : "pending";
    }
    return "pending";
  };

  const stepTimestamp = (step: "placed" | "confirmed" | "shipped" | "delivered") => {
    const raw =
      step === "placed"
        ? order.created_at
        : step === "confirmed"
          ? order.confirmed_at
          : step === "shipped"
            ? order.shipped_at
            : order.delivered_at;
    if (!raw) return null;
    return new Date(raw).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2.5 py-1 font-mono text-sm font-semibold text-gray-900">
                {order.order_number}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  STATUS_CONFIG[order.order_status]?.bg ?? "bg-gray-100"
                } ${STATUS_CONFIG[order.order_status]?.text ?? "text-gray-700"}`}
              >
                {order.order_status}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Placed on{" "}
              {new Date(order.created_at).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Fulfillment progress */}
        <div className="my-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Fulfillment Progress
          </span>
          <div className="relative flex items-center justify-between">
            {[
              { id: "placed", label: "Placed" },
              { id: "confirmed", label: "Confirmed" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
            ].map((st, i, arr) => {
              const isDone = getStepState(st.id as "placed" | "confirmed" | "shipped" | "delivered") === "done";
              return (
                <div key={st.id} className="relative flex flex-1 flex-col items-center text-center">
                  {i < arr.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-3.5 -z-0 h-0.5 w-full ${
                        isDone ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`mt-1.5 text-xs font-medium ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                    {st.label}
                  </span>
                  <span className="mt-0.5 text-[11px] text-gray-400">
                    {stepTimestamp(st.id as "placed" | "confirmed" | "shipped" | "delivered") ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</h4>
            <div>
              <p className="text-sm font-semibold text-gray-900">{order.customer_name ?? "Guest"}</p>
              <p className="mt-0.5 text-xs text-gray-600">{order.customer_email ?? "—"}</p>
              <p className="text-xs text-gray-600">{order.customer_phone ?? "—"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2">
              {cleanPhone && (
                <a
                  href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(order.customer_name || "")},%20we%20are%20processing%20your%20Devanagari%20Publication%20book%20order%20${encodeURIComponent(order.order_number)}!`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              )}
              {order.customer_phone && (
                <a
                  href={`tel:${order.customer_phone}`}
                  className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  <Phone className="h-3 w-3" /> Call
                </a>
              )}
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Delivery Address
            </h4>
            <p className="text-xs leading-relaxed text-gray-700">
              {order.shipping_address ?? "—"}
              {order.landmark ? `, Landmark: ${order.landmark}` : ""}
            </p>
            <div className="text-xs font-medium text-gray-600">
              {[order.city, order.state, order.pincode].filter(Boolean).join(", ") || "—"}
            </div>
            <div className="flex items-center gap-1.5 pt-2 text-xs text-gray-500">
              {isExpress ? (
                <span className="flex items-center gap-1 font-medium text-amber-700">
                  <Zap className="h-3.5 w-3.5" /> Express Delivery
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Standard Delivery
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Payment</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Method</span>
              <span className="font-medium capitalize text-gray-900">
                {order.payment_method ?? "Online"} {order.payment_gateway ? `(${order.payment_gateway})` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Status</span>
              <span className="font-medium capitalize text-gray-900">{order.payment_status}</span>
            </div>
            {order.payment_id && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Payment ID</span>
                <span className="max-w-[160px] truncate font-mono text-gray-600">{order.payment_id}</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5 rounded-lg border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Shipment
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Status</span>
              <span className="font-medium capitalize text-gray-900">
                {order.shipment_status ?? "Unfulfilled"}
              </span>
            </div>
            {order.awb_number && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">AWB Number</span>
                <span className="font-mono font-medium text-gray-900">{order.awb_number}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <CreateShipmentButton
                orderId={order.id}
                shipmentStatus={order.shipment_status}
                isExpress={isExpress}
              />
              {order.awb_number && <TrackShipmentButton awb={order.awb_number} />}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Items ({items.length})
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/60 uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">Book</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const thumb = item.books?.image_url;
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                              <BookOpen className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          {item.book_id && (
                            <Link
                              href={`/product/${item.book_id}`}
                              target="_blank"
                              className="mt-0.5 flex items-center gap-1 text-xs text-brand-600 hover:underline"
                            >
                              View on site
                              <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">{item.product_sku ?? "—"}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600">₹{item.unit_price}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₹{item.unit_price * item.quantity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs">
          {order.subtotal_amount != null && (
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{order.subtotal_amount}</span>
            </div>
          )}
          {(order.discount_amount ?? 0) > 0 && (
            <div className="flex justify-between font-medium text-emerald-600">
              <span>Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
              <span>-₹{order.discount_amount}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-medium text-gray-900">
              {(order.shipping_charge ?? 0) > 0 ? `₹${order.shipping_charge}` : "Free"}
            </span>
          </div>
          {(order.cod_fee ?? 0) > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>COD Handling Fee</span>
              <span className="font-medium text-gray-900">₹{order.cod_fee}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <InlineOrderStatusSelect
            orderId={order.id}
            currentStatus={order.order_status}
            onUpdated={(s) => onStatusChange(s)}
          />
          <button type="button" onClick={onClose} className={btnSecondary}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
