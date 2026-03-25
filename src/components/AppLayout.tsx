import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { DemoProvider } from "@/contexts/DemoContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function AppLayout() {
  const location = useLocation();
  const isDemo = location.pathname.startsWith("/demo");

  return (
    <DemoProvider isDemo={isDemo}>
      <NotificationProvider>
        <div className="min-h-screen" style={{ background: '#0b1326' }}>
          <AppSidebar />
          <div className="lg:ml-64 flex flex-col min-h-screen">
            <Topbar />
            <main className="flex-1 p-6 pb-24 lg:pb-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </NotificationProvider>
    </DemoProvider>
  );
}
