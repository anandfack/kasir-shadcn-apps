import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import PembelianProdukTable from "@/components/pembelian-produk/PembelianProdukTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Pembelian Barang</CardTitle>
          <CardDescription>Pembelian Barang</CardDescription>
        </CardHeader>
        <CardContent>
          <PembelianProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
