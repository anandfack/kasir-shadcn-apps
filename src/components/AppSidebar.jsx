import { Sidebar, SidebarHeader, SidebarContent } from "./ui/sidebar";
import { SidebarCollapsibleMenu } from "./SidebarCollapsibleMenu";
import {
  HomeIcon,
  PackageIcon,
  DollarSignIcon,
  RulerIcon,
  TagIcon,
  BoxesIcon,
} from "lucide-react";

export function AppSidebar() {
  const masterMenuItems = [
    { icon: <PackageIcon />, name: "Produk", href: "/produk" },
    { icon: <DollarSignIcon />, name: "Harga", href: "/" },
    { icon: <RulerIcon />, name: "Satuan", href: "/" },
    { icon: <TagIcon />, name: "Kategori", href: "/kategori-produk" },
    { icon: <BoxesIcon />, name: "Stok", href: "/" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarCollapsibleMenu
          label="Menu Utama"
          items={[{ icon: <HomeIcon />, name: "Dashboard", href: "/" }]}
        />
        <SidebarCollapsibleMenu label="Master" items={masterMenuItems} />
      </SidebarContent>
    </Sidebar>
  );
}
