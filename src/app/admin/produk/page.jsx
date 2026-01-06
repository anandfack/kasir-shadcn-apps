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
import ProdukTable from "@/components/produk/ProdukTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Produk</CardTitle>
          <CardDescription>Data produk ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <ProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
