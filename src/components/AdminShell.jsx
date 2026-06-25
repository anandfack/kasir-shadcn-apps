"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AdminNavbar from "@/components/admin-navbar/AdminNavbar";
import { Toaster } from "@/components/ui/toaster";
import AiAssistant from "@/components/ai/AiAssistant";

export default function AdminShell({ children, user }) {
  return (
    <>
      <div className="sticky top-0 z-0 flex items-center justify-end p-4 bg-background">
        <AdminNavbar user={user} />
      </div>
      <SidebarProvider>
        <div className="flex min-h-screen w-screen bg-background overflow-hidden">
          <AppSidebar />

          <div className="flex flex-col flex-1 min-w-0">
            <main className="flex-1 px-6 py-6 min-w-0">{children}</main>

            {/* <SidebarTrigger /> */}
          </div>
        </div>

        <Toaster />
        <AiAssistant />
      </SidebarProvider>
    </>
  );
}
