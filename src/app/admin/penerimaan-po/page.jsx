import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import AdminPenerimaanPo from "@/components/admin-penerimaan-po/AdminPenerimaanPoTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Penerimaan</CardTitle>
          <CardDescription>Penerimaan Barang  ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPenerimaanPo />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
