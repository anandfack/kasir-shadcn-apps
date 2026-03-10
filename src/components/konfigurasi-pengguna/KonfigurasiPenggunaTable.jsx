"use client";
import { React, useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import KonfigurasiPenggunaDialog from "./KonfigurasiPenggunaDialog";
import KonfigurasiPenggunaActions from "./KonfigurasiPenggunaActions";
import useFetchKonfigurasiPengguna from "@/hooks/konfigurasi-pengguna/useFetchKonfigurasiPengguna";
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
import TambahKonfigurasiPenggunaForm from "./TambahKonfigurasiPenggunaForm";
import UpdateKonfigurasiPenggunaForm from "./UpdateKonfigurasiPenggunaForm";
import { apiRequest } from "@/lib/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { roleBadgeMap } from "@/lib/roleBadge";
import ResetPasswordForm from "./ResetPasswordForm";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { formatTanggal } from "@/lib/formatTanggal";

const KonfigurasiPenggunaTable = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetchKonfigurasiPengguna(
    "/api/v1/admin/konfigurasi-pengguna",
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
  const [pegawaiOpen, setPegawaiOpen] = useState(true);
  const [pegawaiWithoutLoginOpen, setPegawaiWithoutLoginOpen] = useState(true);
  useState(true);
  const [pegawaiWithoutLoading, setPegawaiWithoutLoading] = useState(true);
  const [resetPasswordData, setResetPasswordData] = useState(null);
  const [isDialogResetPasswordOpen, setIsDialogResetPasswordOpen] =
    useState(false);

  const { data: pegawaiData = [], isLoading: pegawaiLoading } = useQuery({
    queryKey: ["pegawai"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/pegawai"),
    enabled: pegawaiOpen,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: pegawaiWithoutLoginData = [],
    isLoading: pegawaiWithoutLoginLoading,
  } = useQuery({
    queryKey: ["pegawai", "without-login"],
    queryFn: () =>
      apiRequest("GET", "/api/v1/admin/pegawai?without_login=true"),
    enabled: pegawaiWithoutLoginOpen,
  });

  const dialogTitle = useMemo(() => `Ubah Konfigurasi Pengguna`, []);

  const dialogDescription = useMemo(
    () => `${editData?.pegawai?.nama_pegawai || ""}`,
    [editData],
  );
  const dialogTitleReset = useMemo(() => `Reset Password`, []);

  const dialogDescriptionReset = useMemo(
    () => `${resetPasswordData?.pegawai?.nama_pegawai || ""}`,
    [resetPasswordData],
  );

  const handleError = useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  // const handleDelete = useCallback(async () => {
  //   if (!deleteData) return;

  //   try {
  //     await apiRequest(
  //       "DELETE",
  //       `/api/v1/admin/konfigurasi-pengguna/${deleteData.id}`
  //     );
  //     toast({
  //       title: "Sukses!",
  //       description: "Data konfigurasi pengguna berhasil dihapus.",
  //     });
  //     setRefreshKey((prev) => prev + 1);
  //     setDeleteData(null);
  //     setIsDialogDeleteOpen(false);
  //   } catch (error) {
  //     toast({
  //       title: "Gagal menghapus",
  //       description: getApiErrorMessage(error),
  //       variant: "destructive",
  //     });
  //     console.error("Gagal menghapus:", error);
  //   }
  // }, [deleteData, toast]);

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
        accessorKey: "username",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Username
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("username")}</div>,
      },
      {
        accessorKey: "email",
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
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
      },

      {
        accessorKey: "role",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Role
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const role = row.getValue("role");
          const badge = roleBadgeMap[role];

          return (
            <Badge variant={badge?.variant || "outline"}>
              {badge?.label || role}
            </Badge>
          );
        },
      },
      {
        id: "pegawai",
        accessorFn: (row) => row.pegawai?.nama_pegawai,
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Pegawai
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("pegawai")}</div>,
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
        accessorKey: "verified",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Verify
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const isVerified = row.getValue("verified");
          return (
            <Badge variant={isVerified ? "secondary" : "destructive"}>
              {isVerified ? "Verified" : "Not Verified"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "last_login",
        header: ({ column }) => (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Last Login
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div>{formatTanggal(row.getValue("last_login"))}</div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const loadData = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <KonfigurasiPenggunaActions
                onEdit={() => {
                  setEditData(loadData);
                  setIsDialogUpdateOpen(true);
                }}
                // onDelete={() => {
                //   setDeleteData(loadData);
                //   setIsDialogDeleteOpen(true);
                // }}
                onResetPassword={() => {
                  setResetPasswordData(loadData);
                  setIsDialogResetPasswordOpen(true);
                }}
              />
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
        <Dialog
          open={isDialogTambahOpen}
          onOpenChange={(isOpen) => setIsDialogTambahOpen(isOpen)}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="font-semibold text-xs md:text-sm"
            >
              <CirclePlus /> Tambah Pengguna
            </Button>
          </DialogTrigger>
          <TambahKonfigurasiPenggunaForm
            onSuccess={() => {
              toast({
                title: "Sukses!",
                description: "Data pengguna berhasil ditambahkan.",
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
            pegawaiWithoutLoginData={pegawaiWithoutLoginData}
            setPegawaiWithoutLoginOpen={setPegawaiWithoutLoginOpen}
            pegawaiWithoutLoginLoading={pegawaiWithoutLoginLoading}
          />
        </Dialog>
        <Input
          placeholder="Cari Pengguna ..."
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
      {/* <Dialog open={isDialogDeleteOpen} onOpenChange={setIsDialogDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus harga untuk produk
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
      </Dialog> */}
      {/* ✅ Dialog Update Harga Produk */}
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {editData && (
            <UpdateKonfigurasiPenggunaForm
              pegawaiData={pegawaiData}
              initialData={editData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Data konfigurasi pengguna berhasil diupdate.",
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
        open={isDialogResetPasswordOpen}
        onOpenChange={setIsDialogResetPasswordOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitleReset}</DialogTitle>
            <DialogDescription>{dialogDescriptionReset}</DialogDescription>
          </DialogHeader>
          {resetPasswordData && (
            <ResetPasswordForm
              initialData={resetPasswordData}
              isLoading={false}
              onSubmit={() => {
                toast({
                  title: "Sukses!",
                  description: "Password berhasil direset.",
                });
                setIsDialogResetPasswordOpen(false);
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

export default KonfigurasiPenggunaTable;
