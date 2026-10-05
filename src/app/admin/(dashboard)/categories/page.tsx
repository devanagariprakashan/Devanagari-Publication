import { createClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory, updateCategory } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { EditCategoryButton } from "@/components/admin/EditCategoryButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, tableTd, tableTh } from "@/components/admin/ui";
import { EmptyRow, PageHeader, Pill, SectionCardHeader, StatCards } from "@/components/admin/PageHeader";
import { Eye, EyeOff, Layers } from "lucide-react";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });
  const activeCount = (categories ?? []).filter((c) => c.is_active).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Group your books so customers can browse and filter the shop. Hidden categories don't show up in the store."
      />

      <StatCards
        id="categories"
        items={[
          { label: "Total Categories", value: (categories ?? []).length, icon: Layers, tone: "rose", sub: "In the catalogue" },
          { label: "Active", value: activeCount, icon: Eye, tone: "emerald", sub: "Visible in the store" },
          { label: "Hidden", value: (categories ?? []).length - activeCount, icon: EyeOff, tone: "amber", sub: "Not shown to customers" },
        ]}
      />

      <div className={card + " p-6"}>
        <SectionCardHeader title="Add Category" description="Give it a clear name. The URL slug is created from it." />
        <CategoryForm action={createCategory} />
      </div>

      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className={tableTh}>Image</th>
                <th className={tableTh}>Name</th>
                <th className={tableTh}>Slug</th>
                <th className={tableTh}>Description</th>
                <th className={tableTh}>Status</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(categories ?? []).map((c) => (
                <tr key={c.id} className="transition hover:bg-rose-50/40">
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
                    <Pill tone={c.is_active ? "green" : "red"}>{c.is_active ? "Active" : "Hidden"}</Pill>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <EditCategoryButton action={updateCategory} category={c} />
                      <DeleteButton
                        action={deleteCategory}
                        id={c.id}
                        itemName={c.name}
                        confirmMessage="Books in this category will be left without a category. This cannot be undone."
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {(categories ?? []).length === 0 && (
                <EmptyRow colSpan={6} icon={Layers} title="No categories yet" hint="Add your first category above to start organising the catalog." />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
