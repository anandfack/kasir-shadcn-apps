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
import KonfigurasiPenggunaTable from "@/components/konfigurasi-pengguna/KonfigurasiPenggunaTable";

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
          <KonfigurasiPenggunaTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
