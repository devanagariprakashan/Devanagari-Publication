"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface AdminSidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | null>(null);

export function AdminSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <AdminSidebarContext.Provider value={value}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error(
      "useAdminSidebar must be used within an AdminSidebarProvider",
    );
  }
  return context;
}
