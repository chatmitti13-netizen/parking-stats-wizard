import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Users,
  ShieldCheck,
  BarChart3,
  FileText,
  Bell,
  Settings,
  LogOut,
  Brain,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/UiContext";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "District Map", to: "/district-map", icon: Map },
  { label: "Mahallas", to: "/mahallas", icon: Users },
  { label: "Officers", to: "/officers", icon: ShieldCheck },
  { label: "Statistics", to: "/statistics", icon: BarChart3 },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "AI Analytics", to: "/ai-analytics", icon: Brain },
  { label: "Submissions", to: "/submissions", icon: ClipboardList },
  { label: "Alerts", to: "/alerts", icon: Bell },
  { label: "Settings", to: "/settings", icon: Settings },
];

const Sidebar = () => {
  const { sidebarOpen } = useUi();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out (mock)");
    navigate("/dashboard");
  };

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen sticky top-0 border-r border-sidebar-border flex flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
            BD
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sidebar-foreground/60">Baxmal</p>
              <h2 className="text-lg font-semibold">Statistics Platform</h2>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-3 pb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition w-full"
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
