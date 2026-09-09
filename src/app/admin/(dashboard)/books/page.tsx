import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteBook } from "@/actions/books";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { btnPrimary, card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

export default async function BooksPage() {
  const supabase = await createClient();
  const [{ data: books }, { data: categories }] = await Promise.all([
    supabase.from("books").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name"),
  ]);
  const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={pageTitle}>Books</h1>
        <Link href="/admin/books/new" className={btnPrimary}>
          New Book
        </Link>
      </div>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Title</th>
                <th className={tableTh}>Author</th>
                <th className={tableTh}>Price</th>
                <th className={tableTh}>Category</th>
                <th className={tableTh}>Display</th>
                <th className={tableTh}>In Stock</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(books ?? []).map((b) => (
                <tr key={b.id}>
                  <td className={tableTd}>{b.title}</td>
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
                    <span className={b.in_stock ? "text-green-600" : "text-red-600"}>
                      {b.in_stock ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/books/${b.id}/edit`}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteBook} id={b.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(books ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={7}>
                    No books yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
