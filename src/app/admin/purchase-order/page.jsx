import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import AdminPurchaseOrderTable from "@/components/admin-purchase-oder/AdminPurchaseOrderTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order</CardTitle>
          <CardDescription>Purchase Order ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPurchaseOrderTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
