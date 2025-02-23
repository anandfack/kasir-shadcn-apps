import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ProdukTable from "./table/Produk";

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
          <ProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
