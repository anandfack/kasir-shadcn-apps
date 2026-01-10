export const ROLE_OPTIONS = [
  { value: "superadmin", label: "Super Admin", variant: "destructive" },
  {
    value: "adminoperasional",
    label: "Admin Operasional",
    variant: "default",
  },
  { value: "staffgudang", label: "Staff Gudang", variant: "secondary" },
  { value: "staffpembelian", label: "Staff Pembelian", variant: "outline" },
  { value: "kasir", label: "Kasir", variant: "success" },
  { value: "finance", label: "Finance", variant: "warning" },
  { value: "manager", label: "Manager", variant: "info" },
];

export const roleBadgeMap = Object.fromEntries(
  ROLE_OPTIONS.map((r) => [r.value, { label: r.label, variant: r.variant }])
);
