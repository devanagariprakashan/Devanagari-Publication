"use client";

import { createBook } from "@/actions/books";
import { BookForm } from "@/components/admin/BookForm";

export default function NewBookPage() {
  return (
    <div className="w-full">
      <BookForm action={createBook} />
    </div>
  );
}
