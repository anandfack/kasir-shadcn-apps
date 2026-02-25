import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import AdminInvoiceTable from "@/components/admin-invoice/AdminInvoiceTable";
// import AdminPenerimaanPo from "@/components/admin-penerimaan-po/AdminPenerimaanPoTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
          <CardDescription>Invoice ada disini</CardDescription>
        </CardHeader>
        <CardContent><AdminInvoiceTable /></CardContent>
      </Card>
    </>
  );
};

export default Page;
