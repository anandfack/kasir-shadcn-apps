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
import AdminProdukVariantTable from "@/components/admin-produk-variant/AdminProdukVariantTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Produk Variant</CardTitle>
          <CardDescription>Data produk variant ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminProdukVariantTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
