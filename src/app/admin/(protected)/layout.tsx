import { Toaster } from "sonner";
import AdminNav from "@/components/admin/AdminNav";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-theme-theme-backdrop h-full p-0 md:p-3">
      <div className="border-theme-theme-stroke bg-theme-theme-background flex h-full flex-col overflow-hidden md:rounded-xl md:border">
        <AdminHeader />
        <div className="flex min-h-0 flex-1">
          <AdminNav />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">{children}</main>
        </div>
        <AdminBottomNav />
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-theme-theme-background)",
            border: "1px solid var(--color-theme-theme-stroke)",
            color: "var(--color-theme-heading-foreground)",
            fontFamily: "var(--font-fira-code)",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
