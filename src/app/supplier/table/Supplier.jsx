"use client";

import React from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  CirclePlus,
  Loader2,
  SquarePen,
  Trash2,
} from "lucide-react";

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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import TambahSupplierForm from "../form/TambahSupplier";
import UpdateSupplierForm from "../form/UpdateSupplier";
import { useDeleteSupplier } from "@/hooks/supplier/useDeleteSupplier";
import { Badge } from "@/components/ui/badge";

const useFetchData = (url, refreshKey) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refreshKey]);

  return { data, loading, error };
};

const SupplierTable = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [editData, setEditData] = React.useState(null);
  const [deleteData, setDeleteData] = React.useState(null);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = React.useState(false);
  const [isDialogTambahOpen, setIsDialogTambahOpen] = React.useState(false);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = React.useState(false);

  const { deleteSupplier, isLoading } = useDeleteSupplier();

  const { data, loading, error } = useFetchData("/api/v1/supplier", refreshKey);

  const handleDelete = React.useCallback(async () => {
    if (!deleteData) return;

    try {
      await deleteSupplier(deleteData);
      setDeleteData(null);
      setIsDialogDeleteOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Gagal menghapus supplier:", error);
    }
  }, [deleteData, deleteSupplier, setIsDialogDeleteOpen, setRefreshKey]);

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
        accessorKey: "kode_supplier",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Kode Supplier
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("kode_supplier")}</div>,
      },
      {
        accessorKey: "nama_supplier",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nama Supplier
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nama_supplier")}</div>
        ),
      },
      {
        accessorKey: "alamat_supplier",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Alamat Supplier
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("alamat_supplier")}</div>
        ),
      },
      {
        accessorKey: "nomor_telepon_supplier",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Telepon Supplier
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            {row.getValue("nomor_telepon_supplier")}
          </div>
        ),
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
            <Badge variant={isActive ? "success" : "destructive"}>
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
              <Dialog
                open={isDialogUpdateOpen && editData === loadData}
                onOpenChange={(isOpen) => {
                  if (!isOpen) setEditData(null);
                  setIsDialogUpdateOpen(isOpen);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={() => {
                      setEditData(loadData);
                      setIsDialogUpdateOpen(true);
                    }}
                  >
                    <SquarePen />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Ubah Supplier</DialogTitle>
                    <DialogDescription>
                      Modifikasi supplier untuk mengelompokkan supplier Anda
                      secara lebih efisien.
                    </DialogDescription>
                  </DialogHeader>
                  {editData && (
                    <UpdateSupplierForm
                      initialData={editData}
                      onSuccess={() => {
                        setRefreshKey((prev) => prev + 1);
                        setIsDialogUpdateOpen(false);
                      }}
                      onError={(error) => {
                        console.error("Terjadi error:", error);
                        setIsDialogUpdateOpen(true);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <Button
                className="text-xs"
                variant="destructive"
                onClick={() => {
                  setDeleteData(loadData.id);
                  setIsDialogDeleteOpen(true);
                }}
              >
                <Trash2 />
              </Button>
              <Dialog
                open={isDialogDeleteOpen}
                onOpenChange={setIsDialogDeleteOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Apakah Anda yakin ingin menghapus data ini?
                    </DialogTitle>
                    <DialogDescription>
                      Yakin ingin menghapus? Data yang dihapus tidak dapat
                      dikembalikan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogDeleteOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Hapus"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
    ],
    [
      editData,
      setEditData,
      isDialogUpdateOpen,
      setIsDialogUpdateOpen,
      handleDelete,
      isDialogDeleteOpen,
      isLoading,
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
              <CirclePlus /> Tambah Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tambah Supplier</DialogTitle>
              <DialogDescription>
                Definisikan supplier baru untuk mengelompokkan supplier Anda
                secara lebih efisien.
              </DialogDescription>
            </DialogHeader>
            <TambahSupplierForm
              onSuccess={() => {
                setRefreshKey((prev) => prev + 1);
                setIsDialogTambahOpen(false);
              }}
              onError={(error) => {
                console.error("Terjadi error:", error);
                setIsDialogTambahOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Cari Supplier ..."
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

export default SupplierTable;
