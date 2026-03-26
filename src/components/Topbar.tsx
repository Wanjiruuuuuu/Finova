import { useState, useRef, useEffect } from "react";
import { Bell, LogOut } from "lucide-react";
import { useIsDemo } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";
import { useDbNotifications, useMarkNotificationsRead } from "@/hooks/useFinanceData";
import { useNotifications } from "@/contexts/NotificationContext";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, any> = { warning: AlertTriangle, success: CheckCircle, info: Info };
const colorMap: Record<string, string> = { warning: "text-warning", success: "text-primary", info: "text-muted-foreground" };

function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function Topbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDemo = useIsDemo();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Demo notifications from context
  const demoNotifs = useNotifications();
  // Real notifications from DB
  const { data: dbNotifs } = useDbNotifications();
  const markRead = useMarkNotificationsRead();

  const notifications = isDemo
    ? demoNotifs.notifications.map(n => ({ id: n.id, title: n.title, message: n.message, type: n.type, read: n.read, created_at: n.createdAt.toISOString() }))
    : (dbNotifs || []);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = isDemo ? "Rachel" : (user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User");
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleBellClick = () => {
    setOpen(!open);
    if (!open) {
      if (isDemo) demoNotifs.markAllRead();
      else markRead.mutate();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border flex items-center justify-between px-6" style={{ background: '#0b1326' }}>
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Welcome back, {displayName}
          {isDemo && <span className="ml-2 pill-badge bg-warning/10 text-warning text-[10px]">Demo Mode</span>}
        </h2>
        <p className="text-xs text-muted-foreground">Your financial overview</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative" ref={ref}>
          <button onClick={handleBellClick} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-expense text-[10px] text-white font-bold flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card !p-0 overflow-hidden shadow-xl">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Notifications</span>
                {unreadCount > 0 && <span className="text-[10px] text-primary font-semibold">{unreadCount} new</span>}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map(n => {
                    const Icon = iconMap[n.type] || Info;
                    return (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-border/50 ${!n.read ? "bg-secondary/30" : ""}`}>
                        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorMap[n.type] || "text-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.created_at)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {!isDemo && user && (
          <button onClick={handleSignOut} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Sign out">
            <LogOut className="w-5 h-5" />
          </button>
        )}

        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
          {initial}
        </div>
      </div>
    </header>
  );
}
