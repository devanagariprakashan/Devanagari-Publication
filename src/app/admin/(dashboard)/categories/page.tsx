import { createClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory, updateCategory } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
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
                <tr key={c.id}>
                  <td className={tableTd}>
                    {c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt={c.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={tableTd}>{c.name}</td>
                  <td className={tableTd}>{c.slug}</td>
                  <td className={tableTd}>{c.description ?? "—"}</td>
                  <td className={tableTd}>
                    <span className={c.is_active ? "text-green-600" : "text-red-600"}>
                      {c.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <details className="relative">
                        <summary className="cursor-pointer rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-900">
                          Edit
                        </summary>
                        <div className={card + " absolute z-10 mt-2 w-96 p-4"}>
                          <CategoryForm action={updateCategory} category={c} />
                        </div>
                      </details>
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
