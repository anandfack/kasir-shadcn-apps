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
// import MutasiStokBarang from "@/components/mutasi-stok/MutasiStok";
import { ArrowLeftRight } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

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
  //   const [isMutasiDialogOpen, setIsMutasiDialogOpen] = useState(false);
  //   const [mutasiData, setMutasiData] = useState(null);
  //   const [isMutasiLoading, setIsMutasiLoading] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);

  const { data: produkData = [], isLoading: produkLoading } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/produk"),
    enabled: produkOpen,
    staleTime: 1000 * 60 * 5,
  });

  //   const fetchMutasiStok = useCallback(
  //     async (id) => {
  //       setIsMutasiLoading(true);
  //       try {
  //         const res = await apiRequest("GET", `/api/v1/admin/mutasi-stok/${id}`);
  //         setMutasiData(res);
  //         setIsMutasiDialogOpen(true);
  //       } catch (err) {
  //         toast({
  //           title: "Gagal mengambil mutasi stok",
  //           description: getApiErrorMessage(err),
  //           variant: "destructive",
  //         });
  //       } finally {
  //         setIsMutasiLoading(false);
  //       }
  //     },
  //     [toast],
  //   );

  const dialogTitle = useMemo(() => {
    if (!editData) return "Update Produk";
    return `Update Produk`;
  }, [editData]);

  const dialogDescription = useMemo(() => {
    if (!editData) return "Silakan ubah data produk di sini";
    return `${editData.nama_produk}`;
  }, [editData]);

  const handleError = useCallback((error) => {
    console.error("Terjadi error:", error);
    setIsDialogUpdateOpen(true);
  }, []);

  //   const handleDelete = useCallback(async () => {
  //     if (!deleteData) return;

  //     try {
  //       await apiRequest("DELETE", `/api/v1/admin/produk/${deleteData.id}`);
  //       toast({
  //         title: "Sukses!",
  //         description: "Data harga produk berhasil dihapus.",
  //       });
  //       setRefreshKey((prev) => prev + 1);
  //       setDeleteData(null);
  //       setIsDialogDeleteOpen(false);
  //     } catch (error) {
  //       toast({
  //         title: "Gagal menghapus",
  //         description: getApiErrorMessage(error),
  //         variant: "destructive",
  //       });
  //       console.error("Gagal menghapus:", error);
  //     }
  //   }, [deleteData, toast]);

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
        header: "Variant",
        cell: ({ row }) => {
          const variants = row.original.variants;

          return (
            <div className="flex flex-col gap-1">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-5 gap-2 text-xs border-b pb-1"
                >
                  <div>{v.ukuran}</div>
                  <div>{v.warna}</div>
                  <div>{v.sku}</div>
                  <div>
                    <Badge variant={v.is_aktif ? "secondary" : "destructive"}>
                      {v.is_aktif ? "Aktif" : "Non-Aktif"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    [],
  );

  //   const columns = useMemo(
  //     () => [
  //       {
  //         id: "no",
  //         accessorFn: (_, index) => index + 1,
  //         header: ({ column }) => (
  //           <Button
  //             variant="link"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             className="p-0"
  //           >
  //             No
  //             <ArrowUpDown />
  //           </Button>
  //         ),
  //         cell: ({ row }) => <div>{row.getValue("no")}.</div>,
  //         enableSorting: true,
  //         enableHiding: false,
  //       },
  //       {
  //         id: "produk",
  //         accessorFn: (row) => row.produk?.nama_produk,
  //         header: ({ column }) => (
  //           <Button
  //             variant="link"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             className="p-0"
  //           >
  //             Nama Produk
  //             <ArrowUpDown />
  //           </Button>
  //         ),
  //         cell: ({ row }) => <div>{row.getValue("produk")}</div>,
  //       },
  //       {
  //         accessorKey: "sku",
  //         header: ({ column }) => (
  //           <Button
  //             variant="link"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             className="p-0"
  //           >
  //             SKU
  //             <ArrowUpDown />
  //           </Button>
  //         ),
  //         cell: ({ row }) => <div>{row.getValue("sku")}</div>,
  //       },
  //       {
  //         accessorKey: "ukuran",
  //         header: ({ column }) => (
  //           <Button
  //             variant="link"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             className="p-0"
  //           >
  //             Ukuran
  //             <ArrowUpDown />
  //           </Button>
  //         ),
  //         cell: ({ row }) => <div>{row.getValue("ukuran")}</div>,
  //       },
  //       {
  //         accessorKey: "warna",
  //         header: ({ column }) => (
  //           <Button
  //             variant="link"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             className="p-0"
  //           >
  //             Warna
  //             <ArrowUpDown />
  //           </Button>
  //         ),
  //         cell: ({ row }) => <div>{row.getValue("warna")}</div>,
  //       },
  //       {
  //         accessorKey: "is_aktif",
  //         header: ({ column }) => (
  //           <Button
  //             variant="link"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             className="p-0"
  //           >
  //             Status
  //             <ArrowUpDown />
  //           </Button>
  //         ),
  //         cell: ({ row }) => {
  //           const isActive = row.getValue("is_aktif");
  //           return (
  //             <Badge variant={isActive ? "secondary" : "destructive"}>
  //               {isActive ? "Aktif" : "Non-Aktif"}
  //             </Badge>
  //           );
  //         },
  //       },
  //       {
  //         id: "actions",
  //         header: () => <div className="text-center">Actions</div>,
  //         cell: ({ row }) => {
  //           const loadData = row.original;

  //             return (
  //               <div className="flex items-center justify-center gap-2">
  //                 {/* ✅ Mutasi Stok */}
  //                 <Button
  //                   variant="ghost"
  //                   size="icon"
  //                   title="Mutasi Stok"
  //                   disabled={isMutasiLoading}
  //                   onClick={() => {
  //                     setSelectedProduk(loadData);
  //                     fetchMutasiStok(loadData.id);
  //                   }}
  //                 >
  //                   {isMutasiLoading ? (
  //                     <Loader2 className="animate-spin h-4 w-4" />
  //                   ) : (
  //                     <ArrowLeftRight className="h-4 w-4" />
  //                   )}
  //                 </Button>

  //                 {/* Edit & Delete tetap */}
  //                 <ProdukActions
  //                   onEdit={() => {
  //                     setEditData(loadData);
  //                     setIsDialogUpdateOpen(true);
  //                   }}
  //                   onDelete={() => {
  //                     setDeleteData(loadData);
  //                     setIsDialogDeleteOpen(true);
  //                   }}
  //                 />
  //               </div>
  //             );
  //         },
  //       },
  //     ],
  //     [],
  //   );

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
      {/* <Dialog open={isDialogDeleteOpen} onOpenChange={setIsDialogDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus{" "}
              <strong>{deleteData?.nama_produk}</strong>?
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
      {/* <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
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
                  description: "Data harga produk variant berhasil diupdate.",
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
      </Dialog> */}
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
      {/* <MutasiStokBarang
        open={isMutasiDialogOpen}
        onOpenChange={setIsMutasiDialogOpen}
        data={mutasiData}
        produk={selectedProduk}
      /> */}
    </div>
  );
};

export default AdminProdukVarianTable;
