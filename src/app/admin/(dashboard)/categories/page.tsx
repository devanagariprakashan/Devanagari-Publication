import { createClient } from "@/lib/supabase/server";
import { deleteCategory } from "@/actions/categories";
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
        <CategoryForm />
      </div>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  <td className={tableTd}>{c.name}</td>
                  <td className={tableTd}>{c.slug}</td>
                  <td className={tableTd}>{c.description ?? "—"}</td>
                  <td className={tableTd}>
                    <span className={c.is_active ? "text-green-600" : "text-red-600"}>
                      {c.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <DeleteButton action={deleteCategory} id={c.id} />
                  </td>
                </tr>
              ))}
              {(categories ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={5}>
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
