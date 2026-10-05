import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteBook } from "@/actions/books";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { btnPrimary, btnSecondary, card, inputCls, tableTd, tableTh } from "@/components/admin/ui";
import { EmptyRow, PageHeader, StatCards } from "@/components/admin/PageHeader";
import { BookOpen, EyeOff, PackageCheck, PackageX, Plus, Search } from "lucide-react";

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; category?: string; stock?: string; page?: string }>;

export default async function BooksPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category = "", stock = "", page = "1" } = await searchParams;
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const supabase = await createClient();

  let query = supabase.from("books").select("*", { count: "exact" }).order("created_at", { ascending: false });
  // Strip characters that have meaning inside a PostgREST or() filter so a search can't change the query.
  const term = q.trim().replace(/[,()%*]/g, " ");
  if (term) query = query.or(`title.ilike.%${term}%,hindi_title.ilike.%${term}%,author.ilike.%${term}%,isbn.ilike.%${term}%`);
  if (category) query = query.eq("category_id", category);
  if (stock === "out") query = query.eq("in_stock", false);
  if (stock === "in") query = query.eq("in_stock", true);
  if (stock === "hidden") query = query.eq("is_active", false);
  const from = (pageNumber - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const [{ data: books, count }, { data: categories }, allCount, inCount, outCount, hiddenCount] = await Promise.all([
    query,
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("books").select("id", { count: "exact", head: true }),
    supabase.from("books").select("id", { count: "exact", head: true }).eq("in_stock", true),
    supabase.from("books").select("id", { count: "exact", head: true }).eq("in_stock", false),
    supabase.from("books").select("id", { count: "exact", head: true }).eq("is_active", false),
  ]);
  const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(term || category || stock);

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (stock) params.set("stock", stock);
    if (target > 1) params.set("page", String(target));
    const s = params.toString();
    return `/admin/books${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Manage your catalogue: pricing, stock and where each book is featured on the storefront."
        action={
          <Link href="/admin/books/new" className={btnPrimary}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Book
          </Link>
        }
      />

      <StatCards
        id="books"
        items={[
          { label: "Total Books", value: allCount.count ?? 0, icon: BookOpen, tone: "rose", sub: "In catalogue" },
          { label: "In Stock", value: inCount.count ?? 0, icon: PackageCheck, tone: "emerald", sub: "Available to order" },
          { label: "Out of Stock", value: outCount.count ?? 0, icon: PackageX, tone: "amber", sub: "Needs restocking" },
          { label: "Hidden", value: hiddenCount.count ?? 0, icon: EyeOff, tone: "violet", sub: "Not published" },
        ]}
      />

      <form method="get" className={card + " flex flex-wrap items-center gap-3 p-4"}>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input name="q" defaultValue={q} placeholder="Search title, author or ISBN" className={inputCls + " pl-9"} />
        </div>
        <select name="category" defaultValue={category} className={inputCls + " max-w-[200px]"}>
          <option value="">All categories</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="stock" defaultValue={stock} className={inputCls + " max-w-[180px]"}>
          <option value="">Any stock status</option>
          <option value="in">In stock</option>
          <option value="out">Out of stock</option>
          <option value="hidden">Hidden (not published)</option>
        </select>
        <button type="submit" className={btnSecondary}>
          Apply
        </button>
        {hasFilters && (
          <Link href="/admin/books" className="text-sm font-medium text-gray-500 hover:text-gray-800">
            Clear
          </Link>
        )}
        <span className="ml-auto text-sm text-gray-500">
          {total} book{total === 1 ? "" : "s"}
        </span>
      </form>

      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className={tableTh}>Title</th>
                <th className={tableTh}>Author</th>
                <th className={tableTh}>Price</th>
                <th className={tableTh}>Category</th>
                <th className={tableTh}>Display</th>
                <th className={tableTh}>Status</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(books ?? []).map((b) => (
                <tr key={b.id} className="transition hover:bg-rose-50/40">
                  <td className={tableTd + " font-medium text-gray-900"}>{b.title}</td>
                  <td className={tableTd}>{b.author ?? "—"}</td>
                  <td className={tableTd}>₹{b.price}</td>
                  <td className={tableTd}>{catMap.get(b.category_id ?? "") ?? "—"}</td>
                  <td className={tableTd}>
                    <div className="flex flex-wrap items-center gap-1">
                      {b.is_bestseller && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-300">
                          Bestseller
                        </span>
                      )}
                      {b.is_new_release && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-300">
                          New Release
                        </span>
                      )}
                      {b.is_featured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-red-100 text-red-800 border-red-300">
                          Featured
                        </span>
                      )}
                      {!b.is_bestseller && !b.is_new_release && !b.is_featured && "—"}
                    </div>
                  </td>
                  <td className={tableTd}>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className={b.in_stock ? "text-green-600" : "text-red-600"}>
                        {b.in_stock ? "In stock" : "Out of stock"}
                      </span>
                      {!b.is_active && <span className="text-gray-400">Hidden</span>}
                    </div>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/books/${b.id}/edit`}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteBook}
                        id={b.id}
                        itemName={b.title}
                        confirmMessage="The book will be removed from the store permanently. Past orders keep their history but lose the link to this book. This cannot be undone."
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {(books ?? []).length === 0 && (
                <EmptyRow
                  colSpan={7}
                  icon={BookOpen}
                  title={hasFilters ? "No books found" : "No books yet"}
                  hint={hasFilters ? "No books match these filters." : "Add your first book to start selling."}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {pageNumber} of {totalPages}
          </span>
          <div className="flex gap-2">
            {pageNumber > 1 && (
              <Link href={pageHref(pageNumber - 1)} className={btnSecondary}>
                Previous
              </Link>
            )}
            {pageNumber < totalPages && (
              <Link href={pageHref(pageNumber + 1)} className={btnSecondary}>
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
