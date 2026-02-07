import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Layout = () => (
  <div className="flex min-h-screen bg-muted/30">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto px-6 pb-10 pt-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout;
