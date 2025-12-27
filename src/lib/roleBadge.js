export const ROLE_OPTIONS = [
  { value: "Super Admin", label: "Super Admin", variant: "destructive" },
  {
    value: "Admin Operasional",
    label: "Admin Operasional",
    variant: "default",
  },
  { value: "Staff Gudang", label: "Staff Gudang", variant: "secondary" },
  { value: "Staff Pembelian", label: "Staff Pembelian", variant: "outline" },
  { value: "Kasir", label: "Kasir", variant: "success" },
  { value: "Finance", label: "Finance", variant: "warning" },
  { value: "HR / Manager", label: "HR / Manager", variant: "info" },
];

export const roleBadgeMap = Object.fromEntries(
  ROLE_OPTIONS.map((r) => [r.value, { label: r.label, variant: r.variant }])
);
