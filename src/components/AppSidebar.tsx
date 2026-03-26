import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, Brain, Wallet, BarChart3, Settings, Users, Zap } from "lucide-react";
import { FinovaLogo } from "@/components/FinovaLogo";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", path: "/transactions", icon: Receipt },
  { title: "AI Insights", path: "/ai-insights", icon: Brain },
  { title: "Budgets", path: "/budgets", icon: Wallet },
  { title: "Reports", path: "/reports", icon: BarChart3 },
  { title: "Advisors", path: "/advisors", icon: Users },
];

const mobileItems = [
  { title: "Home", path: "/dashboard", icon: LayoutDashboard },
  { title: "Activity", path: "/transactions", icon: Receipt },
  { title: "AI", path: "/ai-insights", icon: Brain },
  { title: "Budgets", path: "/budgets", icon: Wallet },
  { title: "Reports", path: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const location = useLocation();
  const prefix = location.pathname.startsWith("/demo") ? "/demo" : "";

  const items = navItems.map(item => ({ ...item, path: prefix + item.path }));
  const mobileNav = mobileItems.map(item => ({ ...item, path: prefix + item.path }));
  const settingsPath = prefix + "/settings";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-border z-40" style={{ background: '#0b1326' }}>
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <FinovaLogo size={24} />
            <h1 className="text-xl font-bold text-primary tracking-tight">Finova</h1>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mt-0.5">
            Your Digital Ledger
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <NavLink key={item.path} to={item.path} className={isActive ? "nav-item-active" : "nav-item"}>
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="px-3 pb-3">
          <div className="rounded-xl border border-primary/20 p-3" style={{ background: 'rgba(78,222,163,0.05)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Upgrade to Pro</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Unlock advisor access + unlimited AI</p>
            <Link to={prefix ? "/auth" : "/settings"} className="block text-center text-[10px] font-semibold py-1.5 rounded-lg bg-primary text-primary-foreground">
              Upgrade
            </Link>
          </div>
        </div>

        <div className="px-3 pb-4 border-t border-border pt-4">
          <NavLink to={settingsPath} className={location.pathname === settingsPath ? "nav-item-active" : "nav-item"}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border flex items-center justify-around py-2" style={{ background: '#0b1326' }}>
        {mobileNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors relative">
              {isActive && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary/10" />}
              <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={isActive ? "text-primary" : "text-muted-foreground"}>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
