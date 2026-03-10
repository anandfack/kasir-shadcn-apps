"use client";
import { React, useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminStokVariantDialog from "./AdminStokVariantDialog";
import AdminStokVariantActions from "./AdminStokVariantActions";
import useFetchAdminStokVariant from "@/hooks/admin-stok-variant/useFetchAdminStokVariant";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, CirclePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import AdminUpdateStokVariantForm from "./AdminUpdateStokVariantForm";
import { apiRequest } from "@/lib/apiRequest";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import AdminPenyesuaianStokVariantForm from "./AdminPenyesuaianStokVariantForm";

const AdminStokVariantTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchAdminStokVariant(
    "/api/v1/admin/stok-variant",
    refreshKey,
  );

  useEffect(() => {
    if (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error.message,
        variant: "destructive",
      });

      if (error.status === 401) {
        // redirect / logout
      }
    }
  }, [error, toast]);

  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteData, setDeleteData] = useState(null);
  const [isDialogTambahOpen, setIsDialogTambahOpen] = useState(false);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [penyesuaianData, setPenyesuaianData] = useState(null);
  const [isDialogPenyesuaianOpen, setIsDialogPenyesuaianOpen] = useState(false);

  // const [produkOpen, setProdukOpen] = useState(true);

  // const { data: produkData = [], isLoading: produkLoading } = useQuery({
  //   queryKey: ["produk"],
  //   queryFn: () => apiRequest("GET", "/api/admin/v1/produk"),
  //   enabled: produkOpen,
  //   staleTime: 1000 * 60 * 5,
  // });

  const dialogTitle = useMemo(
    () => `Update Nilai Minimum dan Maksimum Stock`,
    [],
  );

  const dialogDescription = useMemo(
    () =>
      `${editData?.nama_produk || ""}` +
      ` - ${editData?.ukuran || ""} / ${editData?.warna || ""}`,
    [editData],
  );

  const dialogTitlePenyesuaian = useMemo(
    () => `Penyesuaian Stok Variant Produk`,
    [],
  );

  const dialogDescriptionPenyesuaian = useMemo(
    () =>
      `${penyesuaianData?.nama_produk || ""}` +
      ` - ${penyesuaianData?.ukuran || ""} / ${penyesuaianData?.warna || ""}`,
    [penyesuaianData],
  );

  const handleError = useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  const statusBadgeMap = {
    "Belum Diatur": {
      label: "Belum Diatur",
      className: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    },
    Habis: {
      label: "Habis",
      className: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    },
    Menipis: {
      label: "Menipis",
      className: "bg-amber-500/20 text-amber-400 border border-amber-500/30"
    },
    Berlebih: {
      label: "Berlebih",
      className: "bg-sky-500/20 text-sky-400 border border-sky-500/30"
    },
    Aman: {
      label: "Aman",
      className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
    },
  };

  const groupedData = useMemo(() => {
    if (!data) return [];

    const map = new Map();

    data.forEach((item) => {
      const produkId = item.produk_id;

      if (!map.has(produkId)) {
        map.set(produkId, {
          produk_id: produkId,
          nama_produk: item.nama_produk,
          variants: [],
        });
      }

      map.get(produkId).variants.push(item);
    });

    return Array.from(map.values());
  }, [data]);

  const columns = useMemo(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "nama_produk",
        header: "Nama Produk",
        cell: ({ row }) => (
          <div className="font-semibold">{row.original.nama_produk}</div>
        ),
      },
      {
        id: "variants",
        header: () => (
          <div className="grid grid-cols-[80px_120px_1fr_80px_80px_80px_120px_80px] text-xs">
            <div>Ukuran</div>
            <div>Warna</div>
            <div>SKU</div>
            <div>Stok</div>
            <div>Min</div>
            <div>Max</div>
            <div>Status</div>
            <div className="text-center">Actions</div>
          </div>
        ),
        cell: ({ row }) => {
          const variants = row.original.variants;

          return (
            <div className="flex flex-col divide-y">
              {variants.map((v) => {
                const badge =
                  statusBadgeMap[v.status] ?? statusBadgeMap["Aman"];

                return (
                  <div
                    key={v.id}
                    className="grid grid-cols-[80px_120px_1fr_80px_80px_80px_120px_80px] items-center py-2 text-sm"
                  >
                    {/* Ukuran */}
                    <div>{v.ukuran ?? "-"}</div>

                    {/* Warna */}
                    <div>{v.warna ?? "-"}</div>

                    {/* SKU */}
                    <div className="truncate font-mono text-xs max-w-[200px]">
                      {v.sku}
                    </div>

                    {/* Stok */}
                    <div className="text-center">{v.jumlah_stok ?? "-"}</div>

                    {/* Min */}
                    <div className="text-center">{v.minimal_stok ?? "-"}</div>

                    {/* Max */}
                    <div className="text-center">{v.maksimal_stok ?? "-"}</div>

                    {/* Status */}
                    <div>
                      <Badge variant="outline" className={badge.className}>
                        {badge.label}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center">
                      <AdminStokVariantActions
                        disabled={v.jumlah_stok === null}
                        onEdit={() => {
                          setEditData(v);
                          setIsDialogUpdateOpen(true);
                        }}
                        onAdjustment={() => {
                          setPenyesuaianData(v);
                          setIsDialogPenyesuaianOpen(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    ],
    [statusBadgeMap],
  );

  const table = useReactTable({
    data: groupedData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading)
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="animate-spin h-5 w-5" />
        <div>Loading ...</div>
      </div>
    );
  if (error)
    return (
      <div>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          <div>Gagal memuat data</div>
        </div>
        <div className="flex items-center justify-center text-zinc-300 text-xs">
          {error.message}
        </div>
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
        <Input
          placeholder="Cari Produk ..."
          className="max-w-sm text-xs md:text-sm"
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ✅ Dialog Update Harga Produk */}
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {editData && (
            <AdminUpdateStokVariantForm
              // produkData={produkData}
              initialData={editData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Data stok variant berhasil diupdate.",
                });
                setRefreshKey((prev) => prev + 1);
                setIsDialogUpdateOpen(false);
              }}
              onError={(error) => {
                toast({
                  title: "Terjadi kesalahan",
                  description: getApiErrorMessage(error),
                  variant: "destructive",
                });
                console.error("Terjadi error:", error);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDialogPenyesuaianOpen}
        onOpenChange={setIsDialogPenyesuaianOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitlePenyesuaian}</DialogTitle>
            <DialogDescription>
              {dialogDescriptionPenyesuaian}
            </DialogDescription>
          </DialogHeader>
          {penyesuaianData && (
            <AdminPenyesuaianStokVariantForm
              initialData={penyesuaianData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Berhasil menyesuaikan stok variant produk.",
                });
                setRefreshKey((prev) => prev + 1);
                setIsDialogPenyesuaianOpen(false);
              }}
              onError={(error) => {
                toast({
                  title: "Terjadi kesalahan",
                  description:
                    typeof error === "string"
                      ? error
                      : getApiErrorMessage(error),
                  variant: "destructive",
                  variant: "destructive",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStokVariantTable;
