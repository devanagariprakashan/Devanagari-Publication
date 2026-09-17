import { createClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory, updateCategory } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { EditCategoryButton } from "@/components/admin/EditCategoryButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Categories</h1>

      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Add Category</h2>
        <CategoryForm action={createCategory} />
      </div>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Image</th>
                <th className={tableTh}>Name</th>
                <th className={tableTh}>Slug</th>
                <th className={tableTh}>Description</th>
                <th className={tableTh}>Active</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(categories ?? []).map((c) => (
                <tr key={c.id} className="transition hover:bg-gray-50">
                  <td className={tableTd}>
                    {c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt={c.name} className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-200" />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-50 text-xs text-gray-400 ring-1 ring-gray-200">—</span>
                    )}
                  </td>
                  <td className={tableTd + " font-medium text-gray-900"}>{c.name}</td>
                  <td className={tableTd}>
                    <code className="rounded bg-gray-50 px-1.5 py-0.5 text-xs text-gray-600">{c.slug}</code>
                  </td>
                  <td className={tableTd}>{c.description ?? "—"}</td>
                  <td className={tableTd}>
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold " +
                        (c.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")
                      }
                    >
                      {c.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <EditCategoryButton action={updateCategory} category={c} />
                      <DeleteButton action={deleteCategory} id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(categories ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={6}>
                    No categories yet.
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
