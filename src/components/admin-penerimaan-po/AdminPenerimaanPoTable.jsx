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
// import ReturPembelianProduk from "./ReturPembelianProduk";
// import PembayaranPembelianProduk from "./PembayaranPembelianProduk";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { formatTanggalTanpaJam } from "@/lib/formatTanggal";
import { formatRupiah } from "@/lib/formatRupiah";
import { Badge } from "../ui/badge";
// import AdminTambahPurchaseOrderForm from "./AdminTambahPurchaseOrderForm";
// import AdminDetailPurchaseOrder from "./AdminDetailPurchaseOrder";
// import AdminTerimaPurchaseOrderForm from "./AdminTerimaPurchaseOrderForm";
import useFetchAdminPenerimaanPo from "@/hooks/admin-penerimaan-po/useFetchAdminPenerimaanPo";
import AdminDetailPurchaseOrder from "../admin-purchase-oder/AdminDetailPurchaseOrder";
import AdminDetailPenerimaanPo from "./AdminDetailPenerimaanPo";

const AdminPenerimaanPo = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchAdminPenerimaanPo(
    "/api/v1/admin/penerimaan-po",
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

    const fetchDetailPenerimaanPo = useCallback(
      async (id) => {
        setIsDetailLoading(true);
        try {
          const res = await apiRequest(
            "GET",
            `/api/v1/admin/penerimaan-po/${id}`,
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
      [toast, error],
    );

  const statusBadgeVariant = (status) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "SEBAGIAN":
        return "warning";
      case "BATAL":
        return "destructive";
      default:
        return "secondary";
    }
  };

  //   const statusPembayaranBadge = (status) => {
  //     if (status === "BELUM_BAYAR") {
  //       return "secondary";
  //     }
  //     if (status === "SEBAGIAN") {
  //       return "warning";
  //     }
  //     if (status === "LUNAS") {
  //       return "success";
  //     }
  //     if (status === "OVERPAID") {
  //       return "destructive";
  //     }
  //   };

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
        accessorKey: "nomor_penerimaan",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Penerimaan Barang
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nomor_penerimaan")}</div>
        ),
      },
      {
        id: "nomor_po",
        accessorFn: (row) => row.purchaseOrder?.nomor_po,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Purchase Order
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("nomor_po")}</div>,
      },
      {
        id: "supplier",
        accessorFn: (row) => row.purchaseOrder?.supplier?.nama_supplier,
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
        id: "pegawai_penerima",
        accessorFn: (row) => row.pegawai?.nama_pegawai,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Pegawai Penerima
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("pegawai_penerima")}</div>,
      },
      {
        accessorKey: "tanggal_penerimaan",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Tanggal Penerimaan
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <div className="capitalize">
              {formatTanggalTanpaJam(row.getValue("tanggal_penerimaan"))}
            </div>
          );
        },
      },
      {
        accessorKey: "status_penerimaan",

        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Status Penerimaan Barang
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status_penerimaan");

          return <Badge variant={statusBadgeVariant(status)}>{status}</Badge>;
        },
      },
      //   {
      //     accessorKey: "progress_persen",
      //     header: ({ column }) => (
      //       <Button
      //         variant="link"
      //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //         className="p-0"
      //       >
      //         Progress
      //         <ArrowUpDown />
      //       </Button>
      //     ),
      //     cell: ({ row }) => (
      //       <div className="capitalize">{row.getValue("progress_persen")}%</div>
      //     ),
      //   },
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
                title="Detail"
                onClick={() => {
                  fetchDetailPenerimaanPo(loadData.id);
                }}
              >
                <EyeIcon />
              </Button>
              <Button
                variant="secondary"
                className="text-xs text-rose-400 border-rose-400 hover:bg-rose-400/10 transition-colors"
                title="Retur Penerimaan"
                onClick={() => {
                  setSelectedReturId(loadData.id);
                  setIsDialogReturOpen(true);
                }}
              >
                <ArrowDownUp />
              </Button>
              {/* <Button
                variant="secondary"
                className="text-xs bg-blue-400 text-white dark:bg-blue-600"
                title="Bayar Pembelian"
                onClick={() => {
                  setSelectedPembayaranId(loadData.id);
                  setIsDialogPembayaranOpen(true);
                }}
              >
                <CreditCardIcon />
              </Button> */}
              {/* <Button
                variant="secondary"
                className="text-xs text-emerald-400 border-emerald-400 hover:bg-emerald-400/10 transition-colors"
                title="Terima Barang"
                onClick={() => {
                  setSelectedTerimaId(loadData.id);
                  setIsDialogTerimaOpen(true);
                }}
              >
                <PackageCheckIcon />
              </Button> */}
            </div>
          );
        },
      },
    ],
    [],
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
        {/* <Dialog
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
          <AdminTambahPurchaseOrderForm
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
        </Dialog> */}
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
      <AdminDetailPenerimaanPo
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        data={detailData}
      />
      {/* <Dialog open={isDialogTerimaOpen} onOpenChange={setIsDialogTerimaOpen}>
        <AdminTerimaPurchaseOrderForm
          open={isDialogTerimaOpen}
          onOpenChange={setIsTerimaDialogOpen}
          terimaId={selectedTerimaId}
          data={detailData}
          onClose={() => setIsDialogTerimaOpen(false)}
          onSuccess={() => {
            toast({
              title: "Sukses!",
              description: "Data penerimaan berhasil ditambahkan.",
            });
            setRefreshKey((prev) => prev + 1);
            setIsDialogTerimaOpen(false);
          }}
          onError={(error) => {
            toast({
              title: "Terjadi kesalahan",
              description: getApiErrorMessage(error),
              variant: "destructive",
            });
            console.error("Error terima:", error);
          }}
        />
      </Dialog> */}
      {/* <Dialog
        open={isDialogPembayaranOpen}
        onOpenChange={setIsDialogPembayaranOpen}
      >
        <PembayaranPembelianProduk
          open={isDialogPembayaranOpen}
          onOpenChange={setIsPembayaranDialogOpen}
          pembelianId={selectedPembayaranId}
          data={detailData}
          statusBadgeVariant={statusBadgeVariant}
          statusPembayaranBadge={statusPembayaranBadge}
          onClose={() => setIsDialogPembayaranOpen(false)}
          onSuccess={() => {
            toast({
              title: "Sukses!",
              description: "Pembayaran berhasil ditambahkan.",
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
      </Dialog> */}
    </div>
  );
};

export default AdminPenerimaanPo;
