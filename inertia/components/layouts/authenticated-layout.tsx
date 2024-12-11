import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("sidebar:state") === "true",
  );

  useEffect(() => {
    // Manage dark mode state and persist in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const handleSidebarStateChange = (state: boolean) => {
    setSidebarOpen(state);
    localStorage.setItem("sidebar:state", String(state));
  };

  return (
    <SidebarProvider
      defaultOpen={sidebarOpen}
      onOpenChange={handleSidebarStateChange}
    >
      <AppSidebar />
      <main className="p-2 w-full">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default Layout;
