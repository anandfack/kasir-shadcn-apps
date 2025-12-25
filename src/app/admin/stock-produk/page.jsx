import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import StockProdukTable from "@/components/stock-produk/StockProdukTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Stock Produk</CardTitle>
          <CardDescription>Data barang ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <StockProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
