import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, AppHeader } from "./_layout";
import { AuthCheck } from "@/components/auth-check";
import { Suspense } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
