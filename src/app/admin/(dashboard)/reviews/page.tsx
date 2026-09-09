import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteReview } from "@/actions/reviews";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

function Stars({ rating }: { rating: number | null }) {
  const r = rating ?? 0;
  const filled = "★★★★★".slice(0, Math.min(r, 5));
  const empty = "★★★★★".slice(Math.min(r, 5));
  return (
    <span className="whitespace-nowrap">
      <span className="text-amber-400">{filled}</span>
      <span className="text-gray-300">{empty}</span>
    </span>
  );
}

type Review = {
  id: string;
  rating: number | null;
  comment: string | null;
  reviewer_name: string | null;
  created_at: string;
  book_id: string | null;
  books: { title: string; id: string } | null;
};

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, reviewer_name, created_at, book_id, books(title, id)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Ratings &amp; Reviews</h1>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Reviewer</th>
                <th className={tableTh}>Rating</th>
                <th className={tableTh}>Comment</th>
                <th className={tableTh}>Book</th>
                <th className={tableTh}>Date</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {((reviews as Review[] | null) ?? []).map((r) => (
                <tr key={r.id}>
                  <td className={tableTd}>{r.reviewer_name ?? "Verified Buyer"}</td>
                  <td className={tableTd}>
                    <Stars rating={r.rating} />
                  </td>
                  <td className={`${tableTd} max-w-xs`}>
                    <p className="line-clamp-2">{r.comment ?? "—"}</p>
                  </td>
                  <td className={tableTd}>
                    {r.books && r.book_id ? (
                      <Link
                        href={`/product/${r.book_id}`}
                        className="text-brand-600 hover:underline"
                      >
                        {r.books.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={tableTd}>
                    {new Date(r.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className={tableTd}>
                    <DeleteButton action={deleteReview} id={r.id} />
                  </td>
                </tr>
              ))}
              {(reviews ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={6}>
                    No reviews yet.
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
