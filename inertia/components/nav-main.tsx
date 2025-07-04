import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";

export function NavMain({
  items = [],
}: {
  items: { title: string; href: string; icon?: React.ComponentType<any> }[];
}) {
  const page = usePage();
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.href === page.url}
              tooltip={{ children: item.title }}
            >
              <Link href={item.href}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
