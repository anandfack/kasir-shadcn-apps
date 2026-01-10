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
          <CardTitle>Konfigurasi Pengguna</CardTitle>
          <CardDescription>Data pengguna ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <KonfigurasiPenggunaTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
