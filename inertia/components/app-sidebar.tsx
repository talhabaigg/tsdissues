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
// import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  Binary,
  Box,
  Building,
  Clock,
  Database,
  FoldHorizontal,
  Hammer,
  Hourglass,
  LayoutGrid,
  Pickaxe,
  UsersRound,
} from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: any[] = [
  {
    title: "Issues",
    href: "/issue",
    icon: LayoutGrid,
    permission: "view dashboard",
  },
];

// const textIcon = (text: string) => () => (
//     <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-500 text-sm font-medium text-white">{text}</span>
// );

const footerNavItems: NavItem[] = [
  // {
  //     title: 'Repository',
  //     href: 'https://github.com/laravel/react-starter-kit',
  //     icon: Folder,
  // },
  // {
  //     title: 'Documentation',
  //     href: 'https://laravel.com/docs/starter-kits',
  //     icon: BookOpen,
  // },
];

type AuthUser = {
  permissions: string[];
  // add other user properties if needed
};

type PageProps = {
  auth: {
    user: AuthUser;
    permissions: string[];
    // add other auth properties if needed
  };
  // add other props if needed
};

export function AppSidebar() {
  const { props } = usePage<PageProps>();
  // const permissions: string[] = props?.auth?.user?.permissions ?? [];
  const permissions: string[] = props?.auth?.permissions ?? [];

  // const filteredMainNavItems = mainNavItems.filter(
  //   (item) => !item.permission || permissions.includes(item.permission),
  // );
  // const filteredDocuments = documents.filter(
  //   (item) => !item.permission || permissions.includes(item.permission),
  // );
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
        {/* <NavDocuments items={filteredDocuments} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser user={props.auth.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
