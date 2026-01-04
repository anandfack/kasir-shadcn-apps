"use client";
import { React, useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import StockProdukDialog from "./StockProdukDialog";
import StockProdukActions from "./StockProdukActions";
import useFetchStockProduk from "@/hooks/stock-produk/useFetchStockProduk";
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
import UpdateStockProdukForm from "./UpdateStockProdukForm";
import PenyesuaianStockForm from "./PenyesuaianStockForm";
import { apiRequest } from "@/lib/apiRequest";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const StockProdukTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchStockProduk(
    "/api/v1/admin/stock",
    refreshKey
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

  // const dialogTitle = useMemo(
  //   () => `Ubah Harga ${editData?.produk?.nama_produk || ""}`,
  //   [editData]
  // );

  // const dialogDescription = useMemo(
  //   () => `Update Harga ${editData?.produk?.nama_produk || ""} disini`,
  //   [editData]
  // );

  const handleError = useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  const statusBadgeMap = {
    "Belum Diatur": {
      label: "Belum Diatur",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    Habis: {
      label: "Habis",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    Menipis: {
      label: "Menipis",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    Berlebih: {
      label: "Berlebih",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    Aman: {
      label: "Aman",
      className: "bg-green-100 text-green-700 border-green-200",
    },
  };

  const columns = useMemo(
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
        accessorKey: "jumlah_stok",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Jumlah Stok
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const value = row.getValue("jumlah_stok");
          return <div>{value ?? "-"}</div>;
        },
      },
      {
        accessorKey: "minimal_stok",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Minimal Stok
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const value = row.getValue("minimal_stok");
          return <div>{value ?? "-"}</div>;
        },
      },
      {
        accessorKey: "maksimal_stok",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Maksimal Stok
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const value = row.getValue("maksimal_stok");
          return <div>{value ?? "-"}</div>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status");
          const badge = statusBadgeMap[status] ?? statusBadgeMap["Aman"];

          return (
            <Badge variant="outline" className={badge.className}>
              {badge.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "terakhir_update",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Terakhir Update
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const rawDate = row.getValue("terakhir_update");
          if (!rawDate) {
            return <div>-</div>;
          }
          const formattedDate = rawDate
            ? new Date(rawDate).toISOString().split("T")[0]
            : "";

          return <div className="capitalize">{formattedDate}</div>;
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const loadData = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <StockProdukActions
                onEdit={() => {
                  setEditData(loadData);
                  setIsDialogUpdateOpen(true);
                  console.log("klik edit");
                }}
                onAdjustment={() => {
                  setPenyesuaianData(loadData);
                  setIsDialogPenyesuaianOpen(true);
                  console.log("klik adjustment");
                }}
              />
              <StockProdukDialog
                isOpen={isDialogUpdateOpen}
                onOpenChange={setIsDialogUpdateOpen}
                // title={dialogTitle}
                // description={dialogDescription}
              >
                {editData && (
                  <UpdateStockProdukForm
                    // produkData={produkData}
                    onSubmit={() => {
                      toast({
                        title: "Sukses!",
                        description: "Data harga produk berhasil diupdate.",
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
                      setIsDialogTambahOpen(true);
                    }}
                    isLoading={false}
                    initialData={editData}
                  />
                )}
              </StockProdukDialog>
            </div>
          );
        },
      },
    ],
    [
      statusBadgeMap,
      editData,
      toast,
      isDialogUpdateOpen,
      setIsDialogUpdateOpen,
      // dialogDescription,
      // dialogTitle,
      // produkData,
    ]
  );

  const table = useReactTable({
    data: data || [],
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
      {/* ✅ Dialog Update Harga Produk */}
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            {/* <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription> */}
          </DialogHeader>
          {editData && (
            <UpdateStockProdukForm
              // produkData={produkData}
              initialData={editData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Data harga produk berhasil diupdate.",
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

      {/* ✅ Dialog Reset Password */}
      <Dialog
        open={isDialogPenyesuaianOpen}
        onOpenChange={setIsDialogPenyesuaianOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            {/* <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription> */}
          </DialogHeader>
          {penyesuaianData && (
            <PenyesuaianStockForm
              initialData={penyesuaianData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Berhasil menyesuaikan stok produk.",
                });
                setRefreshKey((prev) => prev + 1);
                setIsDialogPenyesuaianOpen(false);
              }}
              onError={(error) => {
                toast({
                  title: "Terjadi kesalahan",
                  description: getApiErrorMessage(error),
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

export default StockProdukTable;
