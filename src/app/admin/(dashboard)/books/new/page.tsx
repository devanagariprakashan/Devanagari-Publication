"use client";

import { createBook } from "@/actions/books";
import { BookForm } from "@/components/admin/BookForm";
import { card, pageTitle } from "@/components/admin/ui";

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>New Book</h1>
      <div className={card + " p-6"}>
        <BookForm action={createBook} />
      </div>
    </div>
  );
}
