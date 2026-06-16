"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";

const ACTION_LABELS = {
  view: "Lihat",
  create: "Tambah",
  edit: "Edit",
  delete: "Hapus",
  approve: "Approve",
  print: "Cetak",
  export: "Ekspor",
  bayar: "Bayar",
  "assign-permission": "Atur Permission",
};

const ACTION_ORDER = ["view", "create", "edit", "delete", "approve", "bayar", "print", "export", "assign-permission"];

const GROUP_LABELS = {
  dashboard: "Dashboard",
  produk: "Produk",
  "produk-variant": "Produk Variant",
  "harga-produk": "Harga Produk",
  "satuan-produk": "Satuan Produk",
  "kategori-produk": "Kategori Produk",
  supplier: "Supplier",
  pegawai: "Pegawai",
  "stock-produk": "Stok Produk",
  "stok-variant": "Stok Variant",
  "mutasi-stok": "Mutasi Stok",
  "purchase-order": "Purchase Order",
  "penerimaan-po": "Penerimaan PO",
  "retur-penerimaan": "Retur Penerimaan",
  invoice: "Invoice",
  "konfigurasi-pengguna": "Konfigurasi Pengguna",
  roles: "Manajemen Role",
  "laporan-penjualan": "Laporan Penjualan",
  "laporan-pembelian": "Laporan Pembelian",
  "laporan-stok": "Laporan Stok",
  "laporan-mutasi": "Laporan Mutasi",
  "laporan-pembayaran": "Laporan Pembayaran",
};

const PermissionDialog = ({ open, onOpenChange, role, onSuccess, onError }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: permissionsData, isLoading: permLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/permissions"),
    enabled: open,
  });

  const { data: rolePermData, isLoading: rolePermLoading } = useQuery({
    queryKey: ["role-permissions", role?.id],
    queryFn: () =>
      apiRequest("GET", `/api/v1/admin/roles/${role?.id}/permissions`),
    enabled: open && !!role?.id,
  });

  useEffect(() => {
    if (open && rolePermData?.data?.permissionIds) {
      setSelectedIds(rolePermData.data.permissionIds);
    } else if (open) {
      setSelectedIds([]);
    }
  }, [open, rolePermData]);

  const grouped = permissionsData?.data || {};

  const actions = [
    ...new Set(
      Object.values(grouped)
        .flat()
        .map((p) => p.action)
        .sort((a, b) => ACTION_ORDER.indexOf(a) - ACTION_ORDER.indexOf(b)),
    ),
  ];

  const togglePermission = (permId) => {
    setSelectedIds((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId],
    );
  };

  const toggleGroup = (groupName, groupPerms, checked) => {
    const groupIds = groupPerms.map((p) => p.id);

    setSelectedIds((prev) => {
      if (checked) {
        return [...new Set([...prev, ...groupIds])];
      }
      return prev.filter((id) => !groupIds.includes(id));
    });
  };

  const handleSave = async () => {
    if (!role) return;
    setLoading(true);

    try {
      await apiRequest("PUT", `/api/v1/admin/roles/${role.id}/permissions`, {
        permission_ids: selectedIds,
      });
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = permLoading || rolePermLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Atur Permission — {role?.label || "Loading..."}
          </DialogTitle>
          <DialogDescription>
            Centang permission yang ingin diberikan ke role ini
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin h-5 w-5" />
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Modul</TableHead>
                    {actions.map((action) => (
                      <TableHead key={action} className="text-center text-xs whitespace-nowrap">
                        {ACTION_LABELS[action] || action}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(grouped).map(([groupName, groupPerms]) => {
                    const allChecked = groupPerms.every((p) =>
                      selectedIds.includes(p.id),
                    );

                    return (
                      <TableRow key={groupName}>
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={allChecked}
                              onCheckedChange={(checked) =>
                                toggleGroup(groupName, groupPerms, checked)
                              }
                            />
                            {GROUP_LABELS[groupName] || groupName}
                          </div>
                        </TableCell>
                        {actions.map((action) => {
                          const perm = groupPerms.find(
                            (p) => p.action === action,
                          );

                          return (
                            <TableCell key={action} className="text-center">
                              {perm ? (
                                <Checkbox
                                  checked={selectedIds.includes(perm.id)}
                                  onCheckedChange={() =>
                                    togglePermission(perm.id)
                                  }
                                />
                              ) : null}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} permission dipilih
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Permission"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDialog;
