import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import HargaProdukTable from "@/components/harga-produk/HargaProdukTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Barang</CardTitle>
          <CardDescription>Data barang ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <HargaProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
