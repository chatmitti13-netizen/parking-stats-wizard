import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

interface UiContextValue {
  sidebarOpen: boolean;
  theme: ThemeMode;
  notifications: number;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setNotifications: (count: number) => void;
}

const UiContext = createContext<UiContextValue | undefined>(undefined);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [notifications, setNotifications] = useState(4);

  useEffect(() => {
    const storedTheme = localStorage.getItem("baxmal-theme");
    const storedSidebar = localStorage.getItem("baxmal-sidebar");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
    if (storedSidebar === "open" || storedSidebar === "closed") {
      setSidebarOpen(storedSidebar === "open");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("baxmal-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("baxmal-sidebar", sidebarOpen ? "open" : "closed");
  }, [sidebarOpen]);

  const value = useMemo(
    () => ({
      sidebarOpen,
      theme,
      notifications,
      setSidebarOpen,
      toggleSidebar: () => setSidebarOpen((prev) => !prev),
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
      setNotifications,
    }),
    [sidebarOpen, theme, notifications]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error("useUi must be used within UiProvider");
  }
  return context;
};
