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
import BarangTable, { DataTableDemo } from "@/components/BarangTable";

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
          <DataTableDemo />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
