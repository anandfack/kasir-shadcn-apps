import { Sidebar, SidebarHeader, SidebarContent } from "./ui/sidebar";
import { SidebarCollapsibleMenu } from "./SidebarCollapsibleMenu";
import {
  HomeIcon,
  PackageIcon,
  DollarSignIcon,
  RulerIcon,
  TagIcon,
  BoxesIcon,
  BookUserIcon,
} from "lucide-react";

export function AppSidebar() {
  const masterMenuItems = [
    { icon: <PackageIcon />, name: "Produk", href: "/produk" },
    { icon: <DollarSignIcon />, name: "Harga", href: "/harga-produk" },
    { icon: <RulerIcon />, name: "Satuan", href: "/satuan-produk" },
    { icon: <TagIcon />, name: "Kategori", href: "/kategori-produk" },
    { icon: <BoxesIcon />, name: "Stok", href: "/stok-produk" },
    { icon: <BookUserIcon />, name: "Supplier", href: "/supplier" },
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
