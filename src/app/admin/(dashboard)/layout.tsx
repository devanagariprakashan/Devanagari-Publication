import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebarProvider } from "@/context/AdminSidebarContext";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader email={user.email ?? undefined} />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
