"use client";

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
  ShieldIcon,
} from "lucide-react";
import handleLogout from "@/components/logout/handleLogout";
import { usePermissions } from "@/hooks/usePermissions";

export function AppSidebar() {
  const { can } = usePermissions();

  const masterMenuItems = [
    ...(can("produk.view")
      ? [{ icon: <PackageIcon />, name: "Produk", href: "/admin/produk" }]
      : []),
    ...(can("produk-variant.view")
      ? [
          {
            icon: <PackageIcon />,
            name: "Produk Variant",
            href: "/admin/produk-variant",
          },
        ]
      : []),
    ...(can("harga-produk.view")
      ? [{ icon: <TagsIcon />, name: "Harga", href: "/admin/harga-produk" }]
      : []),
    ...(can("satuan-produk.view")
      ? [{ icon: <RulerIcon />, name: "Satuan", href: "/admin/satuan-produk" }]
      : []),
    ...(can("kategori-produk.view")
      ? [
          { icon: <TagIcon />, name: "Kategori", href: "/admin/kategori-produk" },
        ]
      : []),
    ...(can("supplier.view")
      ? [{ icon: <TruckIcon />, name: "Supplier", href: "/admin/supplier" }]
      : []),
    ...(can("pegawai.view")
      ? [{ icon: <UsersIcon />, name: "Pegawai", href: "/admin/pegawai" }]
      : []),
  ];
  const informasiMenuItems = [
    ...(can("stok-variant.view")
      ? [{ icon: <BoxesIcon />, name: "Stok Variant", href: "/admin/stok-variant" }]
      : []),
    ...(can("produk.view")
      ? [{ icon: <ReceiptIcon />, name: "Penjualan", href: "/admin/penjualan-produk" }]
      : []),
  ];
  const trasactionMenuItems = [
    ...(can("purchase-order.view")
      ? [
          {
            icon: <ClipboardListIcon />,
            name: "Purchase Order",
            href: "/admin/purchase-order",
          },
        ]
      : []),
    ...(can("penerimaan-po.view")
      ? [
          {
            icon: <PackageCheckIcon />,
            name: "Penerimaan Purchase Order",
            href: "/admin/penerimaan-po",
          },
        ]
      : []),
    ...(can("invoice.view")
      ? [{ icon: <ReceiptIcon />, name: "Invoice", href: "/admin/invoice" }]
      : []),
  ];

  const laporanMenuItems = [
    ...(can("laporan-penjualan.view")
      ? [{ icon: <BarChart3Icon />, name: "Laporan Penjualan", href: "#" }]
      : []),
    ...(can("laporan-pembelian.view")
      ? [{ icon: <LineChartIcon />, name: "Laporan pembelian", href: "#" }]
      : []),
    ...(can("laporan-stok.view")
      ? [{ icon: <ArchiveIcon />, name: "Laporan Stok", href: "#" }]
      : []),
    ...(can("laporan-mutasi.view")
      ? [{ icon: <TrendingUpIcon />, name: "Laporan Mutasi", href: "#" }]
      : []),
    ...(can("laporan-pembayaran.view")
      ? [{ icon: <WalletIcon />, name: "Laporan Pembayaran", href: "#" }]
      : []),
  ];

  const konfigurasiMenuItems = [
    ...(can("konfigurasi-pengguna.view")
      ? [
          {
            icon: <UserCogIcon />,
            name: "User & Role",
            href: "/admin/konfigurasi-pengguna",
          },
        ]
      : []),
    ...(can("roles.view")
      ? [
          {
            icon: <ShieldIcon />,
            name: "Roles",
            href: "/admin/roles",
          },
        ]
      : []),
    { icon: <MailCheckIcon />, name: "Verifikasi E-mail", href: "#" },
    { icon: <SettingsIcon />, name: "Pengaturan Sistem", href: "#" },
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
        {masterMenuItems.length > 0 && (
          <SidebarCollapsibleMenu label="Master" items={masterMenuItems} />
        )}
        {informasiMenuItems.length > 0 && (
          <SidebarCollapsibleMenu label="Informasi" items={informasiMenuItems} />
        )}
        {trasactionMenuItems.length > 0 && (
          <SidebarCollapsibleMenu label="Transaksi" items={trasactionMenuItems} />
        )}
        {laporanMenuItems.length > 0 && (
          <SidebarCollapsibleMenu label="Laporan" items={laporanMenuItems} />
        )}
        <SidebarCollapsibleMenu label="Konfigurasi" items={konfigurasiMenuItems} />
      </SidebarContent>
    </Sidebar>
  );
}
