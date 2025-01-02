"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  CirclePlus,
  Eye,
  MoreHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";

const data = [
  {
    id: "1",
    kodeBarang: "B001",
    namaBarang: "Kaos Polos Putih",
    KategoriBarang: "Pakaian",
    hargaJual: 25000,
    hargaBeli: 15000,
    stokBarang: 100,
    minimalStok: 20,
    satuan: "pcs",
    supplierBarang: "PT. Garmen Jaya",
    deskripsiBarang: "Kaos polos lengan pendek, ukuran M",
    gambarBarang: "https://example.com/kaos_putih.jpg",
    status: "Non aktif",
  },
  {
    id: "2",
    kodeBarang: "K002",
    namaBarang: "Pensil 2B",
    KategoriBarang: "Alat Tulis",
    hargaJual: 2000,
    hargaBeli: 1500,
    stokBarang: 500,
    minimalStok: 100,
    satuan: "pcs",
    supplierBarang: "CV. Pena Emas",
    deskripsiBarang: "Pensil kayu, HB",
    gambarBarang: "https://example.com/pensil_2b.jpg",
    status: "Aktif",
  },
  {
    id: "3",
    kodeBarang: "M001",
    namaBarang: "Sabun Mandi",
    KategoriBarang: "Perlengkapan Mandi",
    hargaJual: 10000,
    hargaBeli: 8000,
    stokBarang: 200,
    minimalStok: 50,
    satuan: "pcs",
    supplierBarang: "PT. Kosmetik Indah",
    deskripsiBarang: "Sabun mandi cair, aroma bunga",
    gambarBarang: "https://example.com/sabun_mandi.jpg",
    status: "Aktif",
  },
  {
    id: "4",
    kodeBarang: "B002",
    namaBarang: "Celana Jeans Biru",
    KategoriBarang: "Pakaian",
    hargaJual: 150000,
    hargaBeli: 100000,
    stokBarang: 50,
    minimalStok: 10,
    satuan: "pcs",
    supplierBarang: "PT. Garmen Jaya",
    deskripsiBarang: "Celana jeans slim fit, ukuran 30",
    gambarBarang: "https://example.com/celana_jeans.jpg",
    status: "Aktif",
  },
  {
    id: "5",
    kodeBarang: "K003",
    namaBarang: "Buku Tulis",
    KategoriBarang: "Alat Tulis",
    hargaJual: 5000,
    hargaBeli: 3000,
    stokBarang: 200,
    minimalStok: 50,
    satuan: "pcs",
    supplierBarang: "CV. Pena Emas",
    deskripsiBarang: "Buku tulis bergaris, 100 lembar",
    gambarBarang: "https://example.com/buku_tulis.jpg",
    status: "Aktif",
  },
];

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "kodeBarang",
    header: ({ column }) => {
      return (
        <div className="flex justify-start">
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Kode Barang
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("kodeBarang")}</div>,
  },
  {
    accessorKey: "namaBarang",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Nama Barang
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaBarang")}</div>
    ),
  },
  {
    accessorKey: "KategoriBarang",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Kategori
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("KategoriBarang")}</div>
    ),
  },
  {
    accessorKey: "hargaBeli",
    header: () => <div>Harga Beli</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("hargaBeli"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "hargaJual",
    header: () => <div>Harga Jual</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("hargaJual"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "stokBarang",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Stok Barang
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("stokBarang")}</div>,
  },
  {
    accessorKey: "minimalStok",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Minimal Stok
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("minimalStok")}</div>,
  },
  // {
  //   accessorKey: "satuan",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="link"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="p-0"
  //       >
  //         Satuan
  //         <ArrowUpDown />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div>{row.getValue("satuan")}</div>,
  // },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "Aktif" ? "secondary" : "destructive"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          {/* <Button variant="outline">
            <Eye />
            Detail
          </Button> */}
          <Button variant="secondary">
            <SquarePen />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 />
            Delete
          </Button>
        </div>
      );
    },
  },
];

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 py-4">
        <Input
          placeholder="Cari barang ..."
          value={table.getColumn("namaBarang")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("namaBarang")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" className="mx-auto font-semibold">
          <CirclePlus /> Add New Record
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
}
