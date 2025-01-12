// "use client";

// import * as React from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpDown,
//   ChevronDown,
//   CirclePlus,
//   SquarePen,
//   Trash2,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "./ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import TambahKategoriProdukForm from "./TambahKategoriProdukForm";

// import { Input } from "@/components/ui/input";

// const data = [
//   {
//     id: "1",
//     kode_kategori: "K-0001",
//     nama_kategori: "Peralatan Mandi",
//   },
//   {
//     id: "2",
//     kode_kategori: "K-0002",
//     nama_kategori: "Barang Pecah Belah",
//   },
//   {
//     id: "3",
//     kode_kategori: "K-0003",
//     nama_kategori: "Furniture",
//   },
//   {
//     id: "4",
//     kode_kategori: "K-0004",
//     nama_kategori: "Perabotan Dapur",
//   },
//   {
//     id: "5",
//     kode_kategori: "K-0005",
//     nama_kategori: "Perabotan Rumah",
//   },
// ];

// const columns = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "kode_kategori",
//     header: ({ column }) => {
//       return (
//         <div className="flex justify-start">
//           <Button
//             variant="link"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//             className="p-0"
//           >
//             Kode Kategori Produk
//             <ArrowUpDown />
//           </Button>
//         </div>
//       );
//     },
//     cell: ({ row }) => <div>{row.getValue("kode_kategori")}</div>,
//   },
//   {
//     accessorKey: "nama_kategori",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="link"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0"
//         >
//           Nama Kategori Produk
//           <ArrowUpDown />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("nama_kategori")}</div>
//     ),
//   },
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const payment = row.original;

//       return (
//         <div className="flex items-center justify-center gap-2">
//           <Button variant="secondary">
//             <SquarePen />
//             Edit
//           </Button>
//           <Button variant="destructive">
//             <Trash2 />
//             Delete
//           </Button>
//         </div>
//       );
//     },
//   },
// ];

// "use client";

// import React from "react";
// import axios from "axios";
// import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";

// // Custom Hook: Fetch Data
// const useFetchData = () => {
//   const [data, setData] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("/api/kategori-produk");
//         console.log(response.data);
//         setData(response.data); // Sesuaikan dengan struktur data API Anda
//       } catch (err) {
//         setError(err.message || "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   });

//   return { data, loading, error };
// };

// const columns = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//   },
//   {
//     accessorKey: "kode_kategori",
//     header: "Kode Kategori Produk",
//     cell: ({ row }) => row.getValue("kode_kategori"),
//   },
//   {
//     accessorKey: "nama_kategori",
//     header: "Nama Kategori Produk",
//     cell: ({ row }) => row.getValue("nama_kategori"),
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <div className="flex gap-2 justify-center">
//         <Button variant="secondary">Edit</Button>
//         <Button variant="destructive">Delete</Button>
//       </div>
//     ),
//   },
// ];

// export default function DataTableDemo() {
//   const { data, loading, error } = useFetchData("/api/kategori-produk"); 

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="w-full">
//       {/* Header with Search and Add Button */}
//       <div className="flex justify-between py-4">
//         <Input
//           placeholder="Cari Kategori Produk ..."
//           className="max-w-sm"
//           onChange={(e) =>
//             table.getColumn("nama_kategori")?.setFilterValue(e.target.value)
//           }
//         />
//         <Button variant="outline">Tambah Kategori Produk</Button>
//       </div>

//       {/* Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : header.column.columnDef.header}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>{cell.renderValue()}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import axios from "axios";

export const DataTableDemo = async () => {
  try {
    const response = await axios.get("/api/kategori-produk");
    const kategoriProduk = response;
    console.log(kategoriProduk);
  } catch (error) {
    console.error("Error saat menampilkan data", error);
  }
  return <div>KategoriProdukTable</div>;
};
