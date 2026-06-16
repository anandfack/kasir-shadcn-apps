"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { apiRequest } from "@/lib/apiRequest";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useToast } from "@/hooks/use-toast";
import { CirclePlus, Loader2, Pencil, Trash2, ShieldCheck } from "lucide-react";
import RoleDialog from "./_components/RoleDialog";
import DeleteRoleDialog from "./_components/DeleteRoleDialog";
import PermissionDialog from "./_components/PermissionDialog";

const Page = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [permissionData, setPermissionData] = useState(null);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["roles", refreshKey],
    queryFn: () => apiRequest("GET", "/api/v1/admin/roles"),
  });

  const roleList = data?.data || [];

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (role) => {
    setEditData(role);
    setIsDialogOpen(true);
  };

  const handleDelete = (role) => {
    setDeleteData(role);
    setIsDeleteOpen(true);
  };

  const handlePermission = (role) => {
    setPermissionData(role);
    setIsPermissionOpen(true);
  };

  if (isLoading) {
    return (
      <>
        <Breadcrumbs />
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin h-5 w-5" />
          </CardContent>
        </Card>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumbs />
        <Card>
          <CardContent className="flex items-center justify-center py-10 text-red-500">
            {getApiErrorMessage(error)}
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Role</CardTitle>
          <CardDescription>Kelola role dan hak akses pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <Button
              variant="outline"
              className="font-semibold text-xs md:text-sm"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
            >
              <CirclePlus /> Tambah Role
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Role</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah User</TableHead>
                  <TableHead>Jumlah Permission</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleList.length > 0 ? (
                  roleList.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.label}</TableCell>
                      <TableCell>{role.description || "-"}</TableCell>
                      <TableCell>{role._count?.userRoles || 0}</TableCell>
                      <TableCell>{role._count?.rolePermissions || 0}</TableCell>
                      <TableCell>
                        {role.is_system ? (
                          <Badge variant="secondary">Sistem</Badge>
                        ) : (
                          <Badge variant="outline">Kustom</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Atur Permission"
                            onClick={() => handlePermission(role)}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Role"
                            onClick={() => handleEdit(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!role.is_system && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Hapus Role"
                              onClick={() => handleDelete(role)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Tidak ada data role
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <RoleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editData={editData}
        onSuccess={() => {
          toast({
            title: "Sukses!",
            description: editData
              ? "Role berhasil diperbarui"
              : "Role berhasil ditambahkan",
          });
          handleSuccess();
          setIsDialogOpen(false);
        }}
        onError={(error) => {
          toast({
            title: "Terjadi kesalahan",
            description: getApiErrorMessage(error),
            variant: "destructive",
          });
        }}
      />

      <DeleteRoleDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        role={deleteData}
        onSuccess={() => {
          toast({
            title: "Sukses!",
            description: "Role berhasil dihapus",
          });
          handleSuccess();
          setIsDeleteOpen(false);
        }}
        onError={(error) => {
          toast({
            title: "Terjadi kesalahan",
            description: getApiErrorMessage(error),
            variant: "destructive",
          });
        }}
      />

      <PermissionDialog
        open={isPermissionOpen}
        onOpenChange={setIsPermissionOpen}
        role={permissionData}
        onSuccess={() => {
          toast({
            title: "Sukses!",
            description: "Permission berhasil diperbarui",
          });
          handleSuccess();
          setIsPermissionOpen(false);
        }}
        onError={(error) => {
          toast({
            title: "Terjadi kesalahan",
            description: getApiErrorMessage(error),
            variant: "destructive",
          });
        }}
      />
    </>
  );
};

export default Page;
