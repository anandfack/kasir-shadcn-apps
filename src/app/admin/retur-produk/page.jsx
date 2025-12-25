import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ReturProdukTable from "@/components/retur-produk/ReturProdukTable";
// import PembelianProdukTable from "@/components/pembelian-produk/PembelianProdukTable";

const page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Retur Produk</CardTitle>
          <CardDescription>Retur Produk</CardDescription>
        </CardHeader>
        <CardContent>
          <ReturProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default page;
