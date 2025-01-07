import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTableDemo } from "@/components/KategoriProdukTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Kategori Produk</CardTitle>
          <CardDescription>Data kategori produk ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableDemo />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
