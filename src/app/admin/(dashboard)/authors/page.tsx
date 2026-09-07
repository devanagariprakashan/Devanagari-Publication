import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { createAuthor, deleteAuthor } from "@/actions/authors";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

export default async function AuthorsPage() {
  const supabase = await createClient();
  const { data: authors } = await supabase
    .from("authors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Authors</h1>

      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Add Author</h2>
        <AuthorForm action={createAuthor} />
      </div>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Name</th>
                <th className={tableTh}>Role</th>
                <th className={tableTh}>Short Role</th>
                <th className={tableTh}>Active</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(authors ?? []).map((a) => (
                <tr key={a.id}>
                  <td className={tableTd}>{a.name}</td>
                  <td className={tableTd}>{a.role ?? "—"}</td>
                  <td className={tableTd}>{a.short_role ?? "—"}</td>
                  <td className={tableTd}>
                    <span className={a.is_active ? "text-green-600" : "text-red-600"}>
                      {a.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/authors/${a.id}/edit`}
                        className="text-sm font-medium text-brand-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteAuthor} id={a.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(authors ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={5}>
                    No authors yet.
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
