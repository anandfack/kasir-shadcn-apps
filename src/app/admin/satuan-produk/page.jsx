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
import SatuanProdukTable from "@/components/satuan-produk/SatuanProdukTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Satuan Produk</CardTitle>
          <CardDescription>Data satuan produk ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <SatuanProdukTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
