"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";

const ResetPasswordForm = ({ initialData, onSubmit, isLoading, onError }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      return onError?.({
        message: "Password minimal 8 karakter",
      });
    }

    if (password !== confirmPassword) {
      return onError?.({
        message: "Konfirmasi password tidak cocok",
      });
    }

    try {
      setLoading(true);

      await apiRequest(
        "PUT",
        `/api/v1/admin/konfigurasi-pengguna/${initialData.id}/reset-password`,
        {
          password,
          confirm_password: confirmPassword,
        }
      );

      setPassword("");
      setConfirmPassword("");

      onSubmit?.();
    } catch (error) {
      console.error(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
      {/* Password */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-center">
          Passoword <i className="text-red-500">*</i>
        </Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="col-span-3"
          placeholder="Minimal 8 karakter"
        />
      </div>

      {/* Konfirmasi Password */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="konfirmasi-password" className="text-center">
          Konfirmasi Password <i className="text-red-500">*</i>
        </Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="col-span-3"
          placeholder="Ulangi password"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || isLoading}>
          {loading ? "Menyimpan..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
