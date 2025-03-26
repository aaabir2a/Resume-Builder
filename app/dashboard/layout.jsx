import { MainSidebar } from "@/components/main-sidebar";
import Header from "@/components/header";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <MainSidebar className="h-full" />
        </aside>
        <main className="flex-1 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
