import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import AdminStokVariantTable from "@/components/admin-stok-variant/AdminStokVariantTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Stock Produk</CardTitle>
          <CardDescription>Data stock ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminStokVariantTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
