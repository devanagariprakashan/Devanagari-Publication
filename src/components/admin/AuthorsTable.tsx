"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { deleteAuthors } from "@/actions/authors";
import { btnDanger, btnPrimary, card, tableTd, tableTh } from "./ui";

type Author = {
  id: string;
  name: string;
  role: string | null;
  short_role: string | null;
  is_active: boolean | null;
};

export function AuthorsTable({ initial }: { initial: Author[] }) {
  const [authors, setAuthors] = useState(initial);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [pending, startTransition] = useTransition();
  const dirty = removedIds.length > 0;

  // Guard against losing a staged deletion (e.g. closing the tab) before it's saved.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function remove(author: Author) {
    if (!window.confirm(`Remove ${author.name}? Click "Save changes" to make this permanent, or leave this page without saving to undo.`)) return;
    setAuthors(previous => previous.filter(a => a.id !== author.id));
    setRemovedIds(previous => [...previous, author.id]);
    setMessage({});
  }

  function save() {
    startTransition(async () => {
      const result = await deleteAuthors(removedIds);
      if (result.error) { setMessage({ error: result.error }); return; }
      setRemovedIds([]);
      setMessage({ success: "Changes saved" });
    });
  }

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Authors</h2>
        {dirty && (
          <button type="button" onClick={save} disabled={pending} className={btnPrimary}>
            {pending ? "Saving..." : "Save changes"}
          </button>
        )}
      </div>
      {dirty && (
        <div role="status" className="mx-6 mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
          You removed {removedIds.length} author{removedIds.length === 1 ? "" : "s"} — click &quot;Save changes&quot; to make this permanent, or leave this page without saving to undo.
        </div>
      )}
      {message.error && <div role="alert" className="mx-6 mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{message.error}</div>}
      {message.success && <div role="status" className="mx-6 mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{message.success}</div>}
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
            {authors.map(a => (
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
                    <Link href={`/admin/authors/${a.id}/edit`} className="text-sm font-medium text-brand-600 hover:underline">
                      Edit
                    </Link>
                    <button type="button" onClick={() => remove(a)} className={btnDanger}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {authors.length === 0 && (
              <tr>
                <td className={tableTd} colSpan={5}>No authors yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
