import { createClient } from "@/lib/supabase/server";
import { createAuthor } from "@/actions/authors";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { AuthorsTable } from "@/components/admin/AuthorsTable";
import { card, pageTitle } from "@/components/admin/ui";

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

      <AuthorsTable initial={authors ?? []} />
    </div>
  );
}
