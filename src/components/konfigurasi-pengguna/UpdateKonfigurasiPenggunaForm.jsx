"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "../ui/switch";
import { Loader2Icon, SaveIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const UpdateKonfigurasiPenggunaForm = ({
  pegawaiData,
  initialData,
  onSubmit,
  isLoading,
  onError,
}) => {
  const [formData, setFormData] = useState(initialData ?? {});
  const [isChanged, setIsChanged] = useState(false);

  const { data: roleList = [], isLoading: roleLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      apiRequest("GET", "/api/v1/admin/roles").then((res) => res.data || []),
    staleTime: 1000 * 60 * 5,
  });

  const pegawaiList = useMemo(() => {
    if (Array.isArray(pegawaiData)) return pegawaiData;
    if (Array.isArray(pegawaiData?.data)) return pegawaiData.data;
    return [];
  }, [pegawaiData]);

  useEffect(() => {
    if (initialData) {
      const roleIds =
        initialData.userRoles?.map((ur) => ur.role?.id).filter(Boolean) || [];
      setFormData({
        ...initialData,
        role_ids: roleIds,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) return;

    const initialRoleIds =
      initialData.userRoles?.map((ur) => ur.role?.id).filter(Boolean).sort() ||
      [];
    const currentRoleIds = (formData.role_ids || []).sort();

    const isSame =
      formData.username === initialData.username &&
      formData.email === initialData.email &&
      formData.is_aktif === initialData.is_aktif &&
      formData.pegawai?.id === initialData.pegawai?.id &&
      JSON.stringify(initialRoleIds) === JSON.stringify(currentRoleIds);

    setIsChanged(!isSame);
  }, [formData, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (value) => {
    setFormData((prev) => ({ ...prev, is_aktif: value }));
  };

  const toggleRole = (roleId) => {
    setFormData((prev) => {
      const current = prev.role_ids || [];
      const exists = current.includes(roleId);
      return {
        ...prev,
        role_ids: exists
          ? current.filter((id) => id !== roleId)
          : [...current, roleId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        pegawai_id: formData.pegawai?.id,
        username: formData.username,
        email: formData.email,
        role_ids: formData.role_ids || [],
        is_aktif: formData.is_aktif,
      };
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/konfigurasi-pengguna/${formData.id}`,
        dataToSend,
      );

      setFormData((prev) => ({
        ...prev,
        pegawai:
          pegawaiList.find((k) => k.id === updatedData.pegawai_id) || null,
        username: updatedData.username,
        email: updatedData.email,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError?.(error);
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          value={formData.pegawai?.nama_pegawai || ""}
          disabled
          className="col-span-3"
        />
      </div>

      {/* Username */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-center">
          Username <i className="text-red-500">*</i>
        </Label>
        <Input
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan username"
        />
      </div>

      {/* Email */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-center">
          Email <i className="text-red-500">*</i>
        </Label>
        <Input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan Email"
        />
      </div>

      {/* Role (Multi-select) */}
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-center pt-2">
          Role <i className="text-red-500">*</i>
        </Label>

        <div className="col-span-3 space-y-2">
          {roleLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Memuat role...
            </div>
          ) : (
            <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
              {roleList.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Tidak ada role tersedia
                </p>
              )}
              {roleList.map((role) => {
                const isSelected = (formData.role_ids || []).includes(role.id);
                return (
                  <label
                    key={role.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 rounded px-2 py-1.5"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{role.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {role.name}
                      </Badge>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-center">
          Status
        </Label>
        <Switch
          id="status"
          checked={formData.is_aktif || false}
          onCheckedChange={handleSwitchChange}
        />
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isChanged || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateKonfigurasiPenggunaForm;
