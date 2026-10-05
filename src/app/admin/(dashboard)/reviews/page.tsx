import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteReview } from "@/actions/reviews";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, tableTd, tableTh } from "@/components/admin/ui";
import { EmptyRow, PageHeader, StatCards } from "@/components/admin/PageHeader";
import { AlertCircle, MessageSquareText, Star, ThumbsUp } from "lucide-react";

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

  const list = (reviews as Review[] | null) ?? [];
  const rated = list.filter((r) => r.rating != null);
  const average = rated.length ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ratings & Reviews"
        description="What customers say about your books. Removing a review also removes it from that book's rating."
      />

      <StatCards
        id="reviews"
        items={[
          { label: "Total Reviews", value: list.length, icon: MessageSquareText, tone: "rose", sub: "Approved reviews" },
          { label: "Average Rating", value: list.length ? average.toFixed(1) : "—", icon: Star, tone: "amber", sub: "Out of 5" },
          { label: "5-Star Reviews", value: rated.filter((r) => (r.rating ?? 0) >= 5).length, icon: ThumbsUp, tone: "emerald", sub: "Happiest customers" },
          { label: "Low Ratings", value: rated.filter((r) => (r.rating ?? 0) <= 2).length, icon: AlertCircle, tone: "violet", sub: "2 stars or below" },
        ]}
      />

      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
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
              {list.map((r) => (
                <tr key={r.id} className="transition hover:bg-rose-50/40">
                  <td className={tableTd}>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                        {(r.reviewer_name ?? "V").charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-gray-900">{r.reviewer_name ?? "Verified Buyer"}</span>
                    </div>
                  </td>
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
                    <DeleteButton
                      action={deleteReview}
                      id={r.id}
                      itemName="this review"
                      confirmMessage="The review will be removed from the book page and its rating will no longer count. This cannot be undone."
                    />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <EmptyRow colSpan={6} icon={MessageSquareText} title="No reviews yet" hint="Customer reviews from book pages will appear here." />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
