import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  createSlide,
  updateSlide,
  deleteSlide,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from "@/actions/whats-new";
import { WhatsNewSlideForm, WhatsNewUpdateForm } from "@/components/admin/WhatsNewForms";
import type { WhatsNewSlideRow, WhatsNewUpdateRow } from "@/components/admin/WhatsNewForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

export default async function WhatsNewAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const supabase = await createClient();

  const [slidesRes, updatesRes] = await Promise.all([
    supabase.from("whats_new_slides").select("*").order("sort"),
    supabase.from("latest_updates").select("*").order("sort"),
  ]);

  const slides = (slidesRes.data ?? []) as WhatsNewSlideRow[];
  const updates = (updatesRes.data ?? []) as WhatsNewUpdateRow[];
  const editingSlide = slides.find((s) => s.id === edit);
  const editingUpdate = updates.find((u) => u.id === edit);
  const tablesMissing = Boolean(slidesRes.error || updatesRes.error);

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>What&apos;s New &amp; Latest Updates</h1>

      {tablesMissing && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          The whats_new_slides / latest_updates tables are not available yet. Run the schema SQL to enable
          this page. The home page is showing its built-in fallback content.
        </div>
      )}

      {/* ===== Section 1: Featured Slides ===== */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Featured Slides</h2>
          <span className="text-sm text-gray-500">Max 4 active slides</span>
        </div>

        <div className={card + " p-6"}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingSlide ? "Edit Slide" : "Add Slide"}
          </h3>
          <WhatsNewSlideForm
            key={editingSlide?.id ?? "new-slide"}
            action={editingSlide ? updateSlide : createSlide}
            slide={editingSlide}
          />
          {editingSlide && (
            <Link href="/admin/whats-new" className="mt-3 inline-block text-sm text-gray-500 hover:underline">
              Cancel edit
            </Link>
          )}
        </div>

        <div className={card}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className={tableTh}>Badge</th>
                  <th className={tableTh}>Title</th>
                  <th className={tableTh}>Subtitle</th>
                  <th className={tableTh}>Sort</th>
                  <th className={tableTh}>Active</th>
                  <th className={tableTh}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {slides.map((s) => (
                  <tr key={s.id}>
                    <td className={tableTd}>{s.badge ?? "—"}</td>
                    <td className={tableTd}>{s.title}</td>
                    <td className={tableTd}>{s.subtitle ?? "—"}</td>
                    <td className={tableTd}>{s.sort}</td>
                    <td className={tableTd}>
                      <span className={s.is_active ? "text-green-600" : "text-red-600"}>
                        {s.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className={tableTd}>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/whats-new?edit=${s.id}`}
                          className="text-sm font-medium text-brand-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton action={deleteSlide} id={s.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {slides.length === 0 && (
                  <tr>
                    <td className={tableTd} colSpan={6}>
                      No slides yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Section 2: Latest Updates ===== */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Latest Updates</h2>
          <span className="text-sm text-gray-500">Max 8 active updates (home shows the first 4 by sort)</span>
        </div>

        <div className={card + " p-6"}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingUpdate ? "Edit Update" : "Add Update"}
          </h3>
          <WhatsNewUpdateForm
            key={editingUpdate?.id ?? "new-update"}
            action={editingUpdate ? updateUpdate : createUpdate}
            update={editingUpdate}
          />
          {editingUpdate && (
            <Link href="/admin/whats-new" className="mt-3 inline-block text-sm text-gray-500 hover:underline">
              Cancel edit
            </Link>
          )}
        </div>

        <div className={card}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className={tableTh}>Title</th>
                  <th className={tableTh}>Note</th>
                  <th className={tableTh}>Date</th>
                  <th className={tableTh}>Sort</th>
                  <th className={tableTh}>Active</th>
                  <th className={tableTh}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {updates.map((u) => (
                  <tr key={u.id}>
                    <td className={tableTd}>{u.title}</td>
                    <td className={tableTd}>{u.note ?? "—"}</td>
                    <td className={tableTd}>{u.date_text ?? "—"}</td>
                    <td className={tableTd}>{u.sort}</td>
                    <td className={tableTd}>
                      <span className={u.is_active ? "text-green-600" : "text-red-600"}>
                        {u.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className={tableTd}>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/whats-new?edit=${u.id}`}
                          className="text-sm font-medium text-brand-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton action={deleteUpdate} id={u.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {updates.length === 0 && (
                  <tr>
                    <td className={tableTd} colSpan={6}>
                      No updates yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
