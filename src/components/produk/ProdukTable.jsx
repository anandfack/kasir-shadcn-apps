"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProdukDialog from "./ProdukDialog";
import ProdukActions from "./ProdukActions";
import useFetchProduk from "@/hooks/produk/useFetchProduk";
import React from "react";
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
import TambahProdukForm from "./TambahProdukForm";

import { useToast } from "@/hooks/use-toast";
import UpdateProdukForm from "./UpdateProdukForm";
import { apiRequest } from "@/app/utils/fetchOptions";
import { Badge } from "../ui/badge";
import MutasiStokBarang from "@/components/mutasi-stok/MutasiStok";
import { ArrowLeftRight } from "lucide-react";

const ProdukTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const { data, loading, error } = useFetchProduk(
    "/api/v1/admin/produk",
    refreshKey
  );

  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteData, setDeleteData] = React.useState(null);
  const [isDialogTambahOpen, setIsDialogTambahOpen] = React.useState(false);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = React.useState(false);
  const [kategoriOpen, setKategoriOpen] = useState(true);
  const [supplierOpen, setSupplierOpen] = useState(true);
  const [satuanOpen, setSatuanOpen] = useState(true);
  const [isMutasiDialogOpen, setIsMutasiDialogOpen] = useState(false);
  const [mutasiData, setMutasiData] = useState(null);
  const [isMutasiLoading, setIsMutasiLoading] = useState(false);

  const { data: kategoriData = [], isLoading: kategoriLoading } = useQuery({
    queryKey: ["kategori"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/kategori-produk"),
    enabled: kategoriOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: supplierData = [], isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/supplier"),
    enabled: supplierOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: satuanData = [], isLoading: satuanLoading } = useQuery({
    queryKey: ["satuan"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/satuan-produk"),
    enabled: satuanOpen,
    staleTime: 1000 * 60 * 5,
  });

  const fetchMutasiStok = React.useCallback(
    async (id) => {
      setIsMutasiLoading(true);
      try {
        const res = await apiRequest("GET", `/api/v1/admin/mutasi-stok/${id}`);
        setMutasiData(res);
        setIsMutasiDialogOpen(true);
      } catch (err) {
        toast({
          title: "Gagal mengambil mutasi stok",
          description: err?.message || "Terjadi kesalahan",
          variant: "destructive",
        });
      } finally {
        setIsMutasiLoading(false);
      }
    },
    [toast]
  );

  const dialogTitle = React.useMemo(
    () => `Ubah Harga ${editData?.produk?.nama_produk || ""}`,
    [editData]
  );

  const dialogDescription = React.useMemo(
    () => `Update Harga ${editData?.produk?.nama_produk || ""} disini`,
    [editData]
  );

  const handleError = React.useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  const handleDelete = React.useCallback(async () => {
    if (!deleteData) return;

    try {
      await apiRequest("DELETE", `/api/v1/admin/produk/${deleteData.id}`);
      toast({
        title: "Sukses!",
        description: "Data harga produk berhasil dihapus.",
        variant: "success",
      });
      setRefreshKey((prev) => prev + 1);
      setDeleteData(null);
      setIsDialogDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Gagal menghapus",
        description: error?.response?.data?.error || "Terjadi kesalahan",
        variant: "destructive",
      });
      console.error("Gagal menghapus:", error);
    }
  }, [deleteData, toast]);

  const columns = React.useMemo(
    () => [
      {
        id: "no",
        accessorFn: (_, index) => index + 1,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            No
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("no")}.</div>,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "kode_produk",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Kode Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("kode_produk")}</div>,
      },
      {
        id: "kategori",
        accessorFn: (row) => row.kategori?.nama_kategori,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Kategori Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("kategori")}</div>,
      },
      {
        id: "satuan",
        accessorFn: (row) => row.satuan?.nama_satuan,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Satuan Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("satuan")}</div>,
      },
      {
        id: "supplier",
        accessorFn: (row) => row.supplier?.nama_supplier,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Supplier Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
      },
      {
        accessorKey: "nama_produk",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nama Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("nama_produk")}</div>,
      },
      {
        accessorKey: "deskripsi_produk",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Deskripsi Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("deskripsi_produk")}</div>,
      },
      {
        accessorKey: "is_aktif",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Status
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const isActive = row.getValue("is_aktif");
          return (
            <Badge variant={isActive ? "secondary" : "destructive"}>
              {isActive ? "Aktif" : "Non-Aktif"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const loadData = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              {/* ✅ Mutasi Stok */}
              <Button
                variant="ghost"
                size="icon"
                title="Mutasi Stok"
                disabled={isMutasiLoading}
                onClick={() => fetchMutasiStok(loadData.id)}
              >
                {isMutasiLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <ArrowLeftRight className="h-4 w-4" />
                )}
              </Button>

              {/* Edit & Delete tetap */}
              <ProdukActions
                onEdit={() => {
                  setEditData(loadData);
                  setIsDialogUpdateOpen(true);
                }}
                onDelete={() => {
                  setDeleteData(loadData);
                  setIsDialogDeleteOpen(true);
                }}
              />
            </div>
          );
        },
      },
    ],
    [fetchMutasiStok, isMutasiLoading]
  );

  const table = useReactTable({
    data,
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
          {error}
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
              <CirclePlus /> Tambah Produk
            </Button>
          </DialogTrigger>
          <TambahProdukForm
            onSuccess={() => {
              toast({
                title: "Sukses!",
                description: "Data produk berhasil ditambahkan.",
                variant: "success",
              });
              setRefreshKey((prev) => prev + 1);
              setIsDialogTambahOpen(false);
            }}
            onError={(error) => {
              toast({
                title: "Terjadi kesalahan",
                description:
                  error?.response?.data?.error || "Terjadi kesalahan",
                variant: "destructive",
              });
              console.error("Terjadi error:", error);
              setIsDialogTambahOpen(true);
            }}
            kategoriData={kategoriData}
            supplierData={supplierData}
            satuanData={satuanData}
            setKategoriOpen={setKategoriOpen}
            setSatuanOpen={setSatuanOpen}
            setSupplierOpen={setSupplierOpen}
            kategoriLoading={kategoriLoading}
            supplierLoading={supplierLoading}
            satuanLoading={satuanLoading}
          />
        </Dialog>
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
                          header.getContext()
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
                        cell.getContext()
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
              Apakah kamu yakin ingin menghapus harga untuk produk{" "}
              <strong>{deleteData?.produk?.nama_produk}</strong>?
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {editData && (
            <UpdateProdukForm
              kategoriData={kategoriData}
              supplierData={supplierData}
              satuanData={satuanData}
              initialData={editData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Data harga produk berhasil diupdate.",
                  variant: "success",
                });
                setRefreshKey((prev) => prev + 1);
                setIsDialogUpdateOpen(false);
              }}
              onError={(error) => {
                toast({
                  title: "Terjadi kesalahan",
                  description:
                    error?.response?.data?.error || "Terjadi kesalahan",
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
      <MutasiStokBarang
        open={isMutasiDialogOpen}
        onOpenChange={setIsMutasiDialogOpen}
        data={mutasiData}
      />
    </div>
  );
};

export default ProdukTable;
