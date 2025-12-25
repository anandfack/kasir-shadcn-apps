"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PegawaiDialog from "./PegawaiDialog";
import PegawaiActions from "./PegawaiActions";
import useFetchPegawai from "@/hooks/pegawai/useFetchPegawai";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, CirclePlus, EyeIcon, Loader2 } from "lucide-react";
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
import TambahPegawaiForm from "./TambahPegawaiForm";

import { useToast } from "@/hooks/use-toast";
import UpdatePegawaiForm from "./UpdatePegawaiForm";
import { apiRequest } from "@/app/utils/fetchOptions";
import { Badge } from "../ui/badge";
import { set } from "react-hook-form";
import DetailPegawai from "./DetailPegawai";

const PegawaiTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const { data, loading, error } = useFetchPegawai(
    "/api/v1/admin/pegawai",
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
  const [detailPegawaiData, setDetailPegawaiData] = useState(null);
  const [isDetailPegawaiLoading, setIsDetailPegawaiLoading] = useState(false);
  const [isDetailPegawaiDialogOpen, setIsDetailPegawaiDialogOpen] =
    useState(false);

  const fetchDetailPegawai = React.useCallback(
    async (id) => {
      setIsDetailPegawaiLoading(true);
      try {
        const res = await apiRequest("GET", `/api/v1/admin/pegawai/${id}`);
        setDetailPegawaiData(res);
        setIsDetailPegawaiDialogOpen(true);
      } catch (err) {
        toast({
          title: "Gagal mengambil detail pegawai",
          description: err?.message || "Terjadi kesalahan",
          variant: "destructive",
        });
      } finally {
        setIsDetailPegawaiLoading(false);
      }
    },
    [toast]
  );

  //   const dialogTitle = React.useMemo(
  //     () => `Ubah Harga ${editData?.produk?.nama_produk || ""}`,
  //     [editData]
  //   );

  //   const dialogDescription = React.useMemo(
  //     () => `Update Harga ${editData?.produk?.nama_produk || ""} disini`,
  //     [editData]
  //   );

  const handleError = React.useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  const handleDelete = React.useCallback(async () => {
    if (!deleteData) return;

    try {
      await apiRequest("DELETE", `/api/v1/admin/pegawai/${deleteData.id}`);
      toast({
        title: "Sukses!",
        description: "Data pegawai berhasil dihapus.",
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
        accessorKey: "nip_pegawai",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            NIP
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("nip_pegawai")}</div>,
      },
      {
        accessorKey: "nama_pegawai",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nama Pegawai
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("nama_pegawai")}</div>,
      },
      {
        accessorKey: "jabatan_pegawai",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Jabatan
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("jabatan_pegawai")}</div>,
      },
      {
        accessorKey: "jenis_kelamin",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Jenis Kelamin
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("jenis_kelamin")}</div>,
      },
      {
        accessorKey: "nomor_telepon_pegawai",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Nomor Telepon
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("nomor_telepon_pegawai")}</div>,
      },
      {
        accessorKey: "email_pegawai",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Email
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("email_pegawai")}</div>,
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
              {/* ✅ Detail Pegawai */}
              <Button
                variant="ghost"
                size="icon"
                title="Detail Pegawai"
                disabled={isDetailPegawaiLoading}
                onClick={() => fetchDetailPegawai(loadData.id)}
              >
                {isDetailPegawaiLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>

              {/* Edit & Delete tetap */}
              <PegawaiActions
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
    [fetchDetailPegawai, isDetailPegawaiLoading]
    // [fetchMutasiStok, isMutasiLoading]
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
              <CirclePlus /> Tambah Pegawai
            </Button>
          </DialogTrigger>
          <TambahPegawaiForm
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
            // kategoriData={kategoriData}
            // supplierData={supplierData}
            // satuanData={satuanData}
            // setKategoriOpen={setKategoriOpen}
            // setSatuanOpen={setSatuanOpen}
            // setSupplierOpen={setSupplierOpen}
            // kategoriLoading={kategoriLoading}
            // supplierLoading={supplierLoading}
            // satuanLoading={satuanLoading}
          />
        </Dialog>
        <Input
          placeholder="Cari Pegawai ..."
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
              Apakah kamu yakin ingin menghapus harga untuk pegawai{" "}
              <strong>{deleteData?.pegawai?.nama_pegawai}</strong>?
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
            {/* <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription> */}
          </DialogHeader>
          {editData && (
            <UpdatePegawaiForm
              initialData={editData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Data pegawai berhasil diupdate.",
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
      <DetailPegawai
        open={isDetailPegawaiDialogOpen}
        onOpenChange={setIsDetailPegawaiDialogOpen}
        data={detailPegawaiData}
      />
      {/* <MutasiStokBarang
        open={isMutasiDialogOpen}
        onOpenChange={setIsMutasiDialogOpen}
        data={mutasiData}
      /> */}
    </div>
  );
};

export default PegawaiTable;
