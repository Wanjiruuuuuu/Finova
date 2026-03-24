import { Bell, Moon } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border flex items-center justify-between px-6" style={{ background: '#0b1326' }}>
      <div>
        <h2 className="text-sm font-semibold text-foreground">Welcome back, Rachel</h2>
        <p className="text-xs text-muted-foreground">Your financial overview is updated as of 2m ago.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
          R
        </div>
      </div>
    </header>
  );
}
