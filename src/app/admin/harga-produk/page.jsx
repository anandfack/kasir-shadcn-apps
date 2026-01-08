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
          <CardTitle>Harga Produk</CardTitle>
          <CardDescription>Data harga produk ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <HargaProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
