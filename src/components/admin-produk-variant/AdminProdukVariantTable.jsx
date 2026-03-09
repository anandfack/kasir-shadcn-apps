"use client";
import { React, useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// import AdminProdukVariantDialog from "./AdminProdukVariantDialog";
// import AdminProdukVariantActions from "./AdminProdukVariantActions";

import useFetchAdminProdukVariant from "@/hooks/admin-produk-variant/useFetchAdminProdukVariant";
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
import AdminTambahProdukVariantForm from "./AdminTambahProdukVariantForm";
// import AdminUpdateProdukVariantForm from "./AdminUpdateProdukVariantForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { ArrowLeftRight } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import AdminProdukVariantActions from "./AdminProdukVariantActions";
import AdminUpdateProdukVariantForm from "./AdminUpdateProdukVariantForm";
import AdminMutasiStokVariant from "../admin-mutasi-stok-variant/AdminMutasiStokVariant";

const AdminProdukVarianTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchAdminProdukVariant(
    "/api/v1/admin/produk-variant",
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
  const [kategoriOpen, setKategoriOpen] = useState(true);
  const [supplierOpen, setSupplierOpen] = useState(true);
  const [satuanOpen, setSatuanOpen] = useState(true);
  const [produkOpen, setProdukOpen] = useState(true);
  const [isMutasiDialogOpen, setIsMutasiDialogOpen] = useState(false);
  const [mutasiData, setMutasiData] = useState(null);
  const [isMutasiLoading, setIsMutasiLoading] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);

  const { data: produkData = [], isLoading: produkLoading } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/produk"),
    enabled: produkOpen,
    staleTime: 1000 * 60 * 5,
  });

  const fetchMutasiStok = useCallback(
    async (id) => {
      setIsMutasiLoading(true);
      try {
        const res = await apiRequest(
          "GET",
          `/api/v1/admin/mutasi-stok-variant/${id}`,
        );
        setMutasiData(res);
        setIsMutasiDialogOpen(true);
      } catch (err) {
        toast({
          title: "Gagal mengambil mutasi stok",
          description: getApiErrorMessage(err),
          variant: "destructive",
        });
      } finally {
        setIsMutasiLoading(false);
      }
    },
    [toast],
  );

  const dialogTitle = useMemo(() => {
    if (!editData) return "Update Produk";
    return `Update Produk Variant`;
  }, [editData]);

  const dialogDescription = useMemo(() => {
    console.log("EDIT DATA ADA NIH:", editData);
    if (!editData) return "Silakan ubah data produk di sini";
    return `${editData.produk?.nama_produk}`;
  }, [editData]);

  const handleError = useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteData) return;

    try {
      await apiRequest(
        "DELETE",
        `/api/v1/admin/produk-variant/${deleteData.id}`,
      );
      toast({
        title: "Sukses!",
        description: "Data produk variant berhasil dihapus.",
      });
      setRefreshKey((prev) => prev + 1);
      setDeleteData(null);
      setIsDialogDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Gagal menghapus",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
      console.error("Gagal menghapus:", error);
    }
  }, [deleteData, toast]);

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
      },
      {
        id: "variants",
        header: () => (
          <div className="w-full grid grid-cols-5 items-center py-2 text-sm">
            <div>Ukuran</div>
            <div>Warna</div>
            <div>SKU</div>
            <div>Status</div>
            <div className="text-center">Actions</div>
          </div>
        ),
        cell: ({ row }) => {
          const variants = row.original.variants;

          return (
            <div className="w-full flex flex-col divide-y">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-5 items-center py-2 text-sm"
                >
                  <div>{v.ukuran}</div>
                  <div>{v.warna}</div>
                  <div className="text-xs truncate font-mono">{v.sku}</div>
                  <div>
                    <Badge
                      className={`text-xs ${
                        v.is_aktif
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {v.is_aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>

                  <AdminProdukVariantActions
                    onEdit={() => {
                      setEditData(v);
                      setIsDialogUpdateOpen(true);
                    }}
                    onDelete={() => {
                      setDeleteData(v);
                      setIsDialogDeleteOpen(true);
                    }}
                    onMutasiStokVariant={() => {
                      setSelectedProduk(row.original);
                      fetchMutasiStok(v.id);
                    }}
                  />
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    [fetchMutasiStok],
  );

  const groupedData = useMemo(() => {
    if (!data) return [];

    const map = new Map();

    data.forEach((variant) => {
      const produkId = variant.produk.id;

      if (!map.has(produkId)) {
        map.set(produkId, {
          produkId,
          nama_produk: variant.produk.nama_produk,
          variants: [],
        });
      }

      map.get(produkId).variants.push(variant);
    });

    return Array.from(map.values());
  }, [data]);

  const table = useReactTable({
    data: groupedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
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
        <Dialog
          open={isDialogTambahOpen}
          onOpenChange={(isOpen) => setIsDialogTambahOpen(isOpen)}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="font-semibold text-xs md:text-sm"
            >
              <CirclePlus /> Tambah Produk Variant
            </Button>
          </DialogTrigger>
          <AdminTambahProdukVariantForm
            onSuccess={() => {
              toast({
                title: "Sukses!",
                description: "Data produk variant berhasil ditambahkan.",
              });
              setRefreshKey((prev) => prev + 1);
              setIsDialogTambahOpen(false);
            }}
            onError={(error) => {
              toast({
                title: "Terjadi kesalahan",
                description: getApiErrorMessage(error),
                variant: "destructive",
              });
              console.error("Terjadi error:", error);
              setIsDialogTambahOpen(true);
            }}
            produkData={produkData}
            setProdukOpen={setProdukOpen}
            produkLoading={produkLoading}
          />
        </Dialog>
        <Input
          placeholder="Cari Produk Variant ..."
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
      {/* ✅ Dialog Konfirmasi Delete */}
      <Dialog open={isDialogDeleteOpen} onOpenChange={setIsDialogDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus{" "}
              <strong>{deleteData?.sku}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* ✅ Dialog Update Harga Produk */}
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {editData && (
            <AdminUpdateProdukVariantForm
              produkData={produkData}
              initialData={editData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Data produk variant berhasil diupdate.",
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
      <AdminMutasiStokVariant
        open={isMutasiDialogOpen}
        onOpenChange={setIsMutasiDialogOpen}
        data={mutasiData}
        produk={selectedProduk}
      />
    </div>
  );
};

export default AdminProdukVarianTable;
