import { Toaster } from "sonner";
import AdminNav from "../_components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full bg-[#0f172b]">
      <AdminNav />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0f172b",
            border: "1px solid #314158",
            color: "#f8fafc",
            fontFamily: "var(--font-fira-code)",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
