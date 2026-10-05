import { createClient } from "@/lib/supabase/server";
import { createAuthor } from "@/actions/authors";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { AuthorsTable } from "@/components/admin/AuthorsTable";
import { card } from "@/components/admin/ui";
import { PageHeader, SectionCardHeader, StatCards } from "@/components/admin/PageHeader";
import { PenLine, UserCheck, UserX } from "lucide-react";

export default async function AuthorsPage() {
  const supabase = await createClient();
  const { data: authors } = await supabase
    .from("authors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authors"
        description="The writers and faculty behind your books. They appear on the Authors page and in the book author dropdown."
      />

      <StatCards
        id="authors"
        items={[
          { label: "Total Authors", value: (authors ?? []).length, icon: PenLine, tone: "rose", sub: "In the directory" },
          { label: "Active", value: (authors ?? []).filter((a) => a.is_active).length, icon: UserCheck, tone: "emerald", sub: "Shown on the site" },
          { label: "Hidden", value: (authors ?? []).filter((a) => !a.is_active).length, icon: UserX, tone: "amber", sub: "Not shown" },
        ]}
      />

      <div className={card + " p-6"}>
        <SectionCardHeader title="Add Author" description="Add a photo, a short role and a bio so readers know who wrote the book." />
        <AuthorForm action={createAuthor} />
      </div>

      <AuthorsTable initial={authors ?? []} />
    </div>
  );
}
