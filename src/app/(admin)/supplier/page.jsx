"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import SupplierTable from "./table/Supplier";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Supplier</CardTitle>
          <CardDescription>Data supplier ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
