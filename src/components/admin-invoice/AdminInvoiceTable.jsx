"use client";
import { React, useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
  CreditCardIcon,
  EyeIcon,
  Loader2,
  PackageCheckIcon,
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
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { formatTanggalTanpaJam } from "@/lib/formatTanggal";
import { formatRupiah } from "@/lib/formatRupiah";
import { Badge } from "../ui/badge";
import useFetchAdminInvoice from "@/hooks/admin-invoice/useFetchAdminInvoice";
import AdminTambahInvoice from "./AdminTambahInvoiceForm";
import AdminDetailInvoice from "./AdminDetailinvoice";
import AdminPembayaranInvoice from "./AdminPembayaranInvoice";

const AdminInvoiceTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchAdminInvoice(
    "/api/v1/admin/invoice",
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

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [isDialogTambahOpen, setIsDialogTambahOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isReturDialogOpen, setIsReturDialogOpen] = useState(false);
  const [isTerimaDialogOpen, setIsTerimaDialogOpen] = useState(false);
  const [isDialogReturOpen, setIsDialogReturOpen] = useState(false);
  const [isDialogTerimaOpen, setIsDialogTerimaOpen] = useState(false);
  const [selectedReturId, setSelectedReturId] = useState(null);
  const [selectedTerimaId, setSelectedTerimaId] = useState(null);
  const [isPembayaranDialogOpen, setIsPembayaranDialogOpen] = useState(false);
  const [isDialogPembayaranOpen, setIsDialogPembayaranOpen] = useState(false);
  const [selectedPembayaranId, setSelectedPembayaranId] = useState(null);

  const fetchDetailInvoice = useCallback(
    async (id) => {
      setIsDetailLoading(true);
      try {
        const res = await apiRequest("GET", `/api/v1/admin/invoice/${id}`);
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
    [toast, error],
  );

  const statusBadgeVariant = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PARTIAL":
        return "warning";
      case "BATAL":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const statusPembayaranBadge = (status) => {
    if (status === "BELUM_BAYAR") {
      return "secondary";
    }
    if (status === "SEBAGIAN") {
      return "warning";
    }
    if (status === "LUNAS") {
      return "success";
    }
    if (status === "OVERPAID") {
      return "destructive";
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
        accessorKey: "nomor_invoice",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Invoice
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nomor_invoice")}</div>
        ),
      },
      {
        accessorKey: "tanggal_invoice",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Tanggal Invoice
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <div className="capitalize">
              {formatTanggalTanpaJam(row.getValue("tanggal_invoice"))}
            </div>
          );
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
            Status Invoice
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status");

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
                className="text-xs text-sky-400 border-sky-400 hover:bg-sky-400/10 transition-colors"
                title="Detail Invoice"
                onClick={() => {
                  fetchDetailInvoice(loadData.id);
                }}
              >
                <EyeIcon />
              </Button>
              <Button
                variant="secondary"
                className="text-xs text-emerald-400 border-emerald-400 hover:bg-emerald-400/10 transition-colors"
                title="Bayar Invoice"
                onClick={() => {
                  setSelectedPembayaranId(loadData.id);
                  setIsDialogPembayaranOpen(true);
                }}
              >
                <CreditCardIcon />
              </Button>
            </div>
          );
        },
      },
    ],
    [fetchDetailInvoice],
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
              <CirclePlus /> Tambah Purchase Order
            </Button>
          </DialogTrigger>
          <AdminTambahInvoice
            open={isDialogTambahOpen}
            onSuccess={() => {
              toast({
                title: "Sukses!",
                description: "Data invoice berhasil ditambahkan.",
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
          placeholder="Cari Invoice ..."
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
      <AdminDetailInvoice
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        data={detailData}
      />
      <Dialog
        open={isDialogPembayaranOpen}
        onOpenChange={setIsDialogPembayaranOpen}
      >
        <AdminPembayaranInvoice
          open={isDialogPembayaranOpen}
          onOpenChange={setIsPembayaranDialogOpen}
          invoiceId={selectedPembayaranId}
          data={detailData}
          statusBadgeVariant={statusBadgeVariant}
          statusPembayaranBadge={statusPembayaranBadge}
          onClose={() => setIsDialogPembayaranOpen(false)}
          onSuccess={() => {
            toast({
              title: "Sukses!",
              description: "Pembayaran invoice berhasil ditambahkan.",
            });
            setRefreshKey((prev) => prev + 1);
            // setIsDialogPembayaranOpen(false);
          }}
          onError={(error) => {
            toast({
              title: "Terjadi kesalahan",
              description: getApiErrorMessage(error),
              variant: "destructive",
            });
            console.error("Error pembayaran:", error);
          }}
        />
      </Dialog>
    </div>
  );
};

export default AdminInvoiceTable;
