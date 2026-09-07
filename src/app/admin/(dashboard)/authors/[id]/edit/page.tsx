import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { updateAuthor } from "@/actions/authors";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { card, pageTitle } from "@/components/admin/ui";

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: author } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!author) notFound();

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Edit Author</h1>
      <div className={card + " p-6"}>
        <AuthorForm action={updateAuthor} author={author} />
      </div>
    </div>
  );
}
