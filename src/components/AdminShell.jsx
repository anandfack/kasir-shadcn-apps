"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AdminNavbar from "@/components/admin-navbar/AdminNavbar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminShell({ children, user }) {
  return (
      <SidebarProvider>
        <div className="flex min-h-screen w-screen bg-background overflow-hidden">
          <AppSidebar />

          <div className="flex flex-col flex-1 min-w-0">
            <AdminNavbar user={user} />

            <main className="flex-1 px-6 py-6 min-w-0">{children}</main>

            <SidebarTrigger />
          </div>
        </div>

        <Toaster />
      </SidebarProvider>
  );
}
