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
import { apiRequest } from "@/lib/apiRequest";

const DeleteRoleDialog = ({ open, onOpenChange, role, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!role) return;

    setLoading(true);

    try {
      await apiRequest("DELETE", `/api/v1/admin/roles/${role.id}`);
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
          <DialogTitle>Hapus Role</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus role{" "}
            <strong>{role?.label}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoleDialog;
