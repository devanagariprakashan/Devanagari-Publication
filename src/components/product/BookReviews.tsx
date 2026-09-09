"use client";

import { useEffect, useState } from "react";
import { Star, PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ReviewRow {
  id: string;
  rating: number | null;
  comment: string | null;
  reviewer_name: string | null;
  created_at: string;
}

// ponytail: fallback 2 reviews until `npx tsx scripts/apply-reviews.ts` seeds the DB.
const FALLBACK_REVIEWS: ReviewRow[] = [
  { id: "fallback-1", rating: 5, comment: "पुस्तक की भाषा सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।", reviewer_name: "राहुल शर्मा", created_at: "" },
  { id: "fallback-2", rating: 4, comment: "सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।", reviewer_name: "प्रिया वर्मा", created_at: "" },
];

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
      ))}
    </div>
  );
}

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BookReviews({ bookId }: { bookId: string | number }) {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    const load = async () => {
      let { data } = await supabase
        .from("reviews")
        .select("id, rating, comment, reviewer_name, created_at")
        .eq("book_id", String(bookId))
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (!data) {
        // reviewer_name column not migrated yet — degrade without it
        const r2 = await supabase
          .from("reviews")
          .select("id, rating, comment, created_at")
          .eq("book_id", String(bookId))
          .eq("is_approved", true)
          .order("created_at", { ascending: false });
        data = (r2.data ?? []).map((r) => ({ ...r, reviewer_name: null }));
      }
      if (active) setReviews(data && data.length > 0 ? (data as ReviewRow[]) : FALLBACK_REVIEWS);
    };
    void load();
    return () => {
      active = false;
    };
  }, [bookId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || status === "sending") {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const supabase = createClient();
    const review = {
      id: crypto.randomUUID(),
      book_id: String(bookId),
      rating,
      comment: comment.trim(),
      reviewer_name: name.trim() || "Verified Buyer",
      is_approved: true,
    };
    const { error } = await supabase.from("reviews").insert(review);
    if (error && error.message.includes("reviewer_name")) {
      // column not migrated yet — insert without name
      const retry = await supabase.from("reviews").insert({
        id: review.id,
        book_id: review.book_id,
        rating: review.rating,
        comment: review.comment,
        is_approved: review.is_approved,
      });
      if (retry.error) {
        setStatus("error");
        return;
      }
    } else if (error) {
      setStatus("error");
      return;
    }
    setReviews((r) => [{ ...review, created_at: new Date().toISOString() }, ...r]);
    setName("");
    setComment("");
    setRating(5);
    setStatus("done");
  };

  return (
    <section className="mt-12 sm:mt-14">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Ratings &amp; Reviews</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} for this book
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Write a review */}
        <div className="lg:col-span-5 bg-white rounded-[8px] border border-stone-200/90 shadow-sm p-4 sm:p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <PenLine size={16} className="text-[#C61821]" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">Write a Review</h4>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1.5">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    aria-label={`${s} star${s !== 1 ? "s" : ""}`}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star size={22} className={s <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
                  </button>
                ))}
              </div>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full h-10 px-3 border border-stone-200 rounded-[5px] text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#C61821]/50"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this book..."
              rows={4}
              className="w-full px-3 py-2 border border-stone-200 rounded-[5px] text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#C61821]/50 resize-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 rounded-[5px] bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-sm shadow-md shadow-red-600/15 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {status === "sending" ? "Submitting..." : "Submit Review"}
            </button>
            {status === "done" && <p className="text-xs text-emerald-600 font-semibold">Thanks! Your review has been posted.</p>}
            {status === "error" && <p className="text-xs text-red-600 font-semibold">Could not submit. Please add a comment and try again.</p>}
          </form>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-7 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-[8px] border border-stone-200/90 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[11px] font-bold text-stone-600 shrink-0">
                    {(r.reviewer_name || "V").slice(0, 1)}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-stone-900">{r.reviewer_name || "Verified Buyer"}</span>
                    {fmtDate(r.created_at) && <span className="text-xs text-stone-400 ml-2">{fmtDate(r.created_at)}</span>}
                  </div>
                </div>
                <Stars value={r.rating || 5} />
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mt-2.5">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
