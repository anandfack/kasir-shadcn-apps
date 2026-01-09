"use client";
import { React, useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
// import HargaProdukActions from "./HargaProdukActions";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  ArrowDownUp,
  ArrowUpDown,
  CirclePlus,
  EyeIcon,
  Loader2,
  SquarePen,
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
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import useFetchPembelianProduk from "@/hooks/pembelian-produk/useFetchPembelianProduk";
import TambahPembelianProduk from "./TambahPembelianProduk";
import DetailPembelianProduk from "./DetailPembelianProduk";
import ReturPembelianProduk from "./ReturPembelianProduk";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { formatTanggalTanpaJam } from "@/lib/formatTanggal";
import { formatRupiah } from "@/lib/formatRupiah";
import { Badge } from "../ui/badge";

const PembelianProdukTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchPembelianProduk(
    "/api/v1/admin/pembelian-produk",
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

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [isDialogTambahOpen, setIsDialogTambahOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isReturDialogOpen, setIsReturDialogOpen] = useState(false);
  const [isDialogReturOpen, setIsDialogReturOpen] = useState(false);
  const [selectedReturId, setSelectedReturId] = useState(null);

  const fetchDetailPembelian = useCallback(
    async (id) => {
      setIsDetailLoading(true);
      try {
        const res = await apiRequest(
          "GET",
          `/api/v1/admin/pembelian-produk/${id}`
        );
        setDetailData(res);
        setIsDetailDialogOpen(true);
      } catch (err) {
        toast({
          title: "Gagal mengambil detail",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      } finally {
        setIsDetailLoading(false);
      }
    },
    [toast, error]
  );

  const statusBadgeVariant = (status) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "PROSES":
        return "warning";
      case "BATAL":
        return "destructive";
      default:
        return "secondary";
    }
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
        accessorKey: "tanggal_pembelian",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Tanggal Pembelian
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <div className="capitalize">
              {formatTanggalTanpaJam(row.getValue("tanggal_pembelian"))}
            </div>
          );
        },
      },
      {
        accessorKey: "nomor_pembelian",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Pembelian
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nomor_pembelian")}</div>
        ),
      },
      {
        accessorKey: "nomor_faktur",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Faktur
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nomor_faktur")}</div>
        ),
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
            Supplier
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
      },
      {
        accessorKey: "total_harga",
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
            {formatRupiah(row.getValue("total_harga"))}
          </div>
        ),
      },
      {
        accessorKey: "status_pembelian",

        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Status Pembelian
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status_pembelian");

          return <Badge variant={statusBadgeVariant(status)}>{status}</Badge>;
        },
      },

      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const loadData = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                className="text-xs"
                title="Detail"
                onClick={() => {
                  fetchDetailPembelian(loadData.id);
                }}
              >
                <EyeIcon />
              </Button>
              <Button
                variant="destructive"
                className="text-xs"
                title="Retur"
                onClick={() => {
                  setSelectedReturId(loadData.id);
                  setIsDialogReturOpen(true);
                }}
              >
                <ArrowDownUp />
              </Button>
            </div>
          );
        },
      },
    ],
    [fetchDetailPembelian]
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
        <Dialog
          open={isDialogTambahOpen}
          onOpenChange={(isOpen) => setIsDialogTambahOpen(isOpen)}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="font-semibold text-xs md:text-sm"
            >
              <CirclePlus /> Tambah Pembelian
            </Button>
          </DialogTrigger>
          <TambahPembelianProduk
            open={isDialogTambahOpen}
            onSuccess={() => {
              toast({
                title: "Sukses!",
                description: "Data pembelian produk berhasil ditambahkan.",
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
          />
        </Dialog>
        <Input
          placeholder="Cari Pembelian Produk ..."
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
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
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
      <DetailPembelianProduk
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        data={detailData}
      />
      <Dialog open={isDialogReturOpen} onOpenChange={setIsDialogReturOpen}>
        <ReturPembelianProduk
          open={isDialogReturOpen}
          onOpenChange={setIsReturDialogOpen}
          pembelianId={selectedReturId}
          data={detailData}
          onClose={() => setIsDialogReturOpen(false)}
          // onSuccess={() => {
          //   setRefreshKey((prev) => prev + 1);
          //   setIsDialogReturOpen(false);
          // }}
          onSuccess={() => {
            toast({
              title: "Sukses!",
              description: "Data pembelian produk berhasil ditambahkan.",
            });
            setRefreshKey((prev) => prev + 1);
            setIsDialogReturOpen(false);
          }}
          onError={(error) => {
            console.error("Error retur:", error);
          }}
        />
      </Dialog>
    </div>
  );
};

export default PembelianProdukTable;
