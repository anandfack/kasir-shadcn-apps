"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HargaProdukDialog from "./HargaProdukDialog";
import HargaProdukActions from "./HargaProdukActions";
import useFetchHargaProduk from "@/hooks/harga-produk/useFetchHargaProduk";
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

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import TambahHargaProdukForm from "./TambahHargaProdukForm";

import { useToast } from "@/hooks/use-toast";
import UpdateHargaProdukForm from "./UpdateHargaProdukForm";
import { apiRequest } from "@/app/utils/fetchOptions";

const HargaProdukTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const { data, loading, error } = useFetchHargaProduk(
    "/api/v1/harga-produk",
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
  const [produkOpen, setProdukOpen] = useState(true);

  const { data: produkData = [], isLoading: produkLoading } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/produk"),
    enabled: produkOpen,
    staleTime: 1000 * 60 * 5,
  });

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

  // const handleDelete = React.useCallback(async () => {
  //   if (!deleteData) return;

  //   try {
  //     await deleteProduk(deleteData);
  //     setDeleteData(null);
  //     setIsDialogDeleteOpen(false);
  //     setRefreshKey((prev) => prev + 1);
  //   } catch (error) {
  //     console.error("Gagal menghapus produk:", error);
  //   }
  // }, [deleteData, deleteProduk, setIsDialogDeleteOpen, setRefreshKey]);

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
        id: "produk",
        accessorFn: (row) => row.produk?.nama_produk,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Produk
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("produk")}</div>,
      },
      {
        accessorKey: "harga_beli",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Harga Beli
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 2,
            }).format(row.getValue("harga_beli"))}
          </div>
        ),
      },
      {
        accessorKey: "harga_jual",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Harga Jual
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 2,
            }).format(row.getValue("harga_beli"))}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const loadData = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <HargaProdukActions
                onEdit={() => {
                  setEditData(loadData);
                  setIsDialogUpdateOpen(true);
                  console.log("klik edit");
                }}
                onDelete={() =>
                  console.log("Hapus", loadData.produk.nama_produk)
                }
              />
              <HargaProdukDialog
                isOpen={isDialogUpdateOpen}
                onOpenChange={setIsDialogUpdateOpen}
                title={dialogTitle}
                description={dialogDescription}
              >
                {editData && (
                  <UpdateHargaProdukForm
                    produkData={produkData}
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
                      setIsDialogTambahOpen(true);
                    }}
                    isLoading={false}
                    initialData={editData}
                  />
                )}
              </HargaProdukDialog>
            </div>
          );
        },
      },
    ],
    [
      editData,
      toast,
      isDialogUpdateOpen,
      setIsDialogUpdateOpen,
      dialogDescription,
      dialogTitle,
      produkData,
    ]
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
          <TambahHargaProdukForm
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

export default HargaProdukTable;
