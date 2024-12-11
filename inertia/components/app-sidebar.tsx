import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { SunMoon } from "lucide-react";
import ApplicationLogo from "~/components/application-logo";
import { Link, usePage } from "@inertiajs/react";
import { useToggle } from "@uidotdev/usehooks";
import { ChevronDown } from "lucide-react";
import { NavUser } from "./nav-user";
import { LayoutDashboard, Ticket } from "lucide-react";
export function AppSidebar() {
  const user = usePage().props.auth.user;
  const [isDropdownOpen, toggleDropdown] = useToggle(false);
  const { url } = usePage();
  const isLinkActive = (link: string) => {
    const currentUrl = window.location.href; // Full URL including domain
    return currentUrl === link; // Compare with the provided route link
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel>
          <Link href={route("dashboard")}>
            <ApplicationLogo />
          </Link>
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenuButton
          asChild
          tooltip="Dashboard"
          isActive={isLinkActive(route("dashboard"))}
        >
          <Link href={route("dashboard")} className="flex items-center">
            <LayoutDashboard />
            Dashboard
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          asChild
          tooltip="Dashboard"
          isActive={isLinkActive(route("issue.index"))}
        >
          <Link href={route("issue.index")} className="flex items-center">
            <Ticket />
            Issues
          </Link>
        </SidebarMenuButton>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu></SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}