import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { updateBook } from "@/actions/books";
import { BookForm } from "@/components/admin/BookForm";
import { card, pageTitle } from "@/components/admin/ui";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!book) notFound();

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Edit Book</h1>
      <div className={card + " p-6"}>
        <BookForm action={updateBook} book={book} />
      </div>
    </div>
  );
}
