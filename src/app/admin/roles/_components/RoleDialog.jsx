"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";

const RoleDialog = ({ open, onOpenChange, editData, onSuccess, onError }) => {
  const [name, setName] = useState(editData?.name || "");
  const [label, setLabel] = useState(editData?.label || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      setName(editData?.name || "");
      setLabel(editData?.label || "");
      setDescription(editData?.description || "");
    }
  }, [open, editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await apiRequest("PUT", `/api/v1/admin/roles/${editData.id}`, {
          name,
          label,
          description,
        });
      } else {
        await apiRequest("POST", "/api/v1/admin/roles", {
          name,
          label,
          description,
        });
      }

      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Role" : "Tambah Role"}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Ubah data role yang sudah ada"
              : "Buat role baru untuk mengatur hak akses"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Role</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="superadmin"
                required
                disabled={editData?.is_system}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Super Admin"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi role"
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
