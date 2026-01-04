"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";

export default function DetailPegawai({ open, onOpenChange, data }) {
  const rows = data?.data || [];
  if (!rows) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{rows.nama_pegawai}</p>
              <p className="text-sm text-muted-foreground">
                {rows.jabatan_pegawai}
              </p>
            </div>

            <Badge variant={rows.is_aktif ? "default" : "destructive"}>
              {rows.is_aktif ? "Aktif" : "Nonaktif"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* IDENTITAS */}
        <Section title="Identitas Pegawai">
          <Item label="NIP" value={rows.nip_pegawai} />
          <Item label="Jenis Kelamin" value={rows.jenis_kelamin} />
          <Item
            label="Tanggal Lahir"
            value={new Date(rows.tanggal_lahir).toLocaleDateString()}
          />
        </Section>

        {/* KONTAK */}
        <Section title="Kontak & Alamat">
          <Item label="Email" value={rows.email_pegawai} />
          <Item label="No Telepon" value={rows.nomor_telepon_pegawai} />
          <Item label="Alamat" value={rows.alamat_pegawai} />
        </Section>

        {/* SISTEM */}
        <Section title="Informasi Sistem">
          <Item
            label="Dibuat"
            value={new Date(rows.created_at).toLocaleString()}
          />
          <Item
            label="Terakhir Diupdate"
            value={new Date(rows.updated_at).toLocaleString()}
          />
        </Section>

        {/* AKSI */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Reset Password</Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* === Helper Components === */

function Section({ title, children }) {
  return (
    <div className="space-y-2 border rounded-lg p-4">
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}
