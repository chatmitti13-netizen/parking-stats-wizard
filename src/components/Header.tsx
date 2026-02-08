import { Bell, ChevronRight, Menu, Moon, Search, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useUi } from "@/store/UiContext";
import { cn } from "@/lib/utils";

const Header = () => {
  const { pathname } = useLocation();
  const { toggleSidebar, notifications, theme, toggleTheme } = useUi();

  const routeLabels: Record<string, string> = {
    dashboard: "Boshqaruv paneli",
    "district-map": "Tuman xaritasi",
    mahallas: "Mahallalar",
    officers: "Xodimlar",
    statistics: "Statistika",
    reports: "Hisobotlar",
    "ai-analytics": "AI tahlil",
    submissions: "Topshiriqlar",
    alerts: "Ogohlantirishlar",
    settings: "Sozlamalar",
    "officer-panel": "Xodim paneli",
  };

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => routeLabels[segment] ?? segment.replace(/-/g, " "));

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Baxmal tumani hokimligi</p>
            <h1 className="text-xl font-semibold text-foreground">Baxmal tumani statistik platformasi</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Hisobotlar, mahallalar, xodimlarni qidirish"
              className="h-10 w-72 rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="relative h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center">
              {notifications}
            </span>
          </button>
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              SA
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Saida Abdullaeva</p>
              <span className="text-xs text-muted-foreground">Tuman administratori</span>
            </div>
            <span className="hidden md:inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Administrator
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-[0.2em]">Bosh sahifa</span>
          {segments.map((segment, index) => (
            <span key={segment} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              <span className={cn("capitalize", index === segments.length - 1 && "text-foreground")}>{segment}</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
