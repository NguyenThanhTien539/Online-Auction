// MainLayout.tsx (React Router)
import { Outlet } from "react-router-dom";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full">
      <header className="fixed inset-x-0 top-0 z-20 border-b bg-white">
        <Header />
      </header>

      <div
        className="grid"
        style={{
          gridTemplateRows: "1fr",
          gridTemplateColumns: "240px 1fr",
        }}
      >
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] overflow-y-auto border-r bg-white md:block">
          <Sidebar />
        </aside>

        <main className="pt-16">
          <div className="min-h-[calc(100vh-64px)] overflow-y-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
