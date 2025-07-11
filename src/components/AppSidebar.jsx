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
  const trasactionMenuItems = [
    { icon: <DollarSignIcon />, name: "Pembelian", href: "/pembelian-produk" },
    { icon: <DollarSignIcon />, name: "Penjualan", href: "/penjualan-produk" },
    { icon: <RulerIcon />, name: "Retur", href: "/retur-produk" },
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
        <SidebarCollapsibleMenu label="Transaksi" items={trasactionMenuItems} />
      </SidebarContent>
    </Sidebar>
  );
}
