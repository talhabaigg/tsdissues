import { NavFooter } from "~/components/nav-footer";
import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { Ticket, Tickets } from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: any[] = [
  {
    title: "Issues",
    href: "/issue",
    icon: Ticket,
    isAdmin: undefined,
  },
];

const footerNavItems: any[] = [
  {
    title: "Issue types",
    href: "/issue-categories",
    icon: Tickets,
    isAdmin: true,
  },
];

type AuthUser = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  permissions: string[];
};

type PageProps = {
  auth: {
    user: AuthUser;
    permissions: string[];
  };
  ziggy: any;
};

export function AppSidebar() {
  const { props } = usePage<PageProps>();
  const isAdmin = props.auth.user.isAdmin;

  const filteredMainNavItems = mainNavItems.filter((item) => {
    return !item.isAdmin || (item.isAdmin && isAdmin);
  });

  const filteredFooterNavItems = footerNavItems.filter((item) => {
    return !item.isAdmin || (item.isAdmin && isAdmin);
  });

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredMainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={filteredFooterNavItems} className="mt-auto" />
        <NavUser user={props.auth.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
