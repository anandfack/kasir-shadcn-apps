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
import PegawaiTable from "@/components/pegawai/PegawaiTable";

const Page = () => {
  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Pegawai</CardTitle>
          <CardDescription>Data pegawai ada disini</CardDescription>
        </CardHeader>
        <CardContent>
          <PegawaiTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
