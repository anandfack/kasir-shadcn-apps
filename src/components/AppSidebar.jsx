import { Sidebar, SidebarHeader, SidebarContent } from "./ui/sidebar";
import { SidebarCollapsibleMenu } from "./SidebarCollapsibleMenu";
import {
  PackageIcon,
  RulerIcon,
  TagIcon,
  BoxesIcon,
  BookUserIcon,
  LogOut,
  LayoutDashboardIcon,
  TagsIcon,
  TruckIcon,
  UsersIcon,
  ArrowLeftRightIcon,
  HistoryIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  Undo2Icon,
  BarChart3Icon,
  LineChartIcon,
  ArchiveIcon,
  TrendingUpIcon,
  WalletIcon,
  UserCogIcon,
  MailCheckIcon,
  SettingsIcon,
  LogOutIcon,
  ClipboardListIcon,
  PackageCheckIcon,
} from "lucide-react";
import handleLogout from "@/components/logout/handleLogout";

export function AppSidebar() {
  const masterMenuItems = [
    { icon: <PackageIcon />, name: "Produk", href: "/admin/produk" },
    {
      icon: <PackageIcon />,
      name: "Produk Variant",
      href: "/admin/produk-variant",
    },
    { icon: <TagsIcon />, name: "Harga", href: "/admin/harga-produk" },
    { icon: <RulerIcon />, name: "Satuan", href: "/admin/satuan-produk" },
    { icon: <TagIcon />, name: "Kategori", href: "/admin/kategori-produk" },
    { icon: <TruckIcon />, name: "Supplier", href: "/admin/supplier" },
    { icon: <UsersIcon />, name: "Pegawai", href: "/admin/pegawai" },
  ];
  const informasiMenuItems = [
    // { icon: <BoxesIcon />, name: "Stok", href: "/admin/stock-produk" },
    { icon: <BoxesIcon />, name: "Stok Variant", href: "/admin/stok-variant" },
    // { icon: <Undo2Icon />, name: "Retur", href: "/admin/retur-produk" },
    {
      icon: <ReceiptIcon />,
      name: "Penjualan",
      href: "/admin/penjualan-produk",
    },

    // { icon: <ArrowLeftRightIcon />, name: "Mutasi Stok", href: "#" },
    // { icon: <HistoryIcon />, name: "Riwayat Harga", href: "#" },
  ];
  const trasactionMenuItems = [
    // {
    //   icon: <ShoppingCartIcon />,
    //   name: "Pembelian",
    //   href: "/admin/pembelian-produk",
    // },
    {
      icon: <ClipboardListIcon />,
      name: "Purchase Order",
      href: "/admin/purchase-order",
    },
    {
      icon: <PackageCheckIcon />,
      name: "Penerimaan Purchase Order",
      href: "/admin/penerimaan-po",
    },
    {
      icon: <ReceiptIcon />,
      name: "Inovice",
      href: "/admin/invoice",
    },
  ];

  const laporanMenuItems = [
    { icon: <BarChart3Icon />, name: "Laporan Penjualan", href: "#" },
    { icon: <LineChartIcon />, name: "Laporan pembelian", href: "#" },
    { icon: <ArchiveIcon />, name: "Laporan Stok", href: "#" },
    { icon: <TrendingUpIcon />, name: "Laporan Mutasi", href: "#" },
    { icon: <WalletIcon />, name: "Laporan Pembayaran", href: "#" },
  ];

  const konfigurasiMenuItems = [
    {
      icon: <UserCogIcon />,
      name: "User & Role",
      href: "/admin/konfigurasi-pengguna",
    },
    { icon: <MailCheckIcon />, name: "Verifikasi E-mail", href: "#" },
    { icon: <SettingsIcon />, name: "Pengaturan Sistem", href: "#" },
    { icon: <LogOutIcon />, name: "Logout", action: handleLogout },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarCollapsibleMenu
          label="Menu Utama"
          items={[
            { icon: <LayoutDashboardIcon />, name: "Dashboard", href: "/" },
          ]}
        />
        <SidebarCollapsibleMenu label="Master" items={masterMenuItems} />
        <SidebarCollapsibleMenu label="Informasi" items={informasiMenuItems} />
        <SidebarCollapsibleMenu label="Transaksi" items={trasactionMenuItems} />
        <SidebarCollapsibleMenu label="Laporan" items={laporanMenuItems} />
        <SidebarCollapsibleMenu
          label="Konfigurasi"
          items={konfigurasiMenuItems}
        />
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarFooterMenu />
        <SidebarFooterMenu username={user?.username} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
