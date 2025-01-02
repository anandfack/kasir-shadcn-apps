import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function SidebarCollapsibleMenu({ label, items }) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            {label}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          {items.map((item, index) => (
            <SidebarMenu key={index}>
              <SidebarMenuItem>
                <Link href={item.href}>
                  <SidebarMenuButton>
                    {item.icon}
                    {item.name}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          ))}
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
