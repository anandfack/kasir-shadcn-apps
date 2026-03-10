"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTanggal, formatTanggalTanpaJam } from "@/lib/formatTanggal";

export default function DetailPegawai({ open, onOpenChange, data }) {
  const rows = data?.data || [];
  if (!rows) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-8">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{rows.nama_pegawai}</p>
              <p className="text-sm text-muted-foreground">
                {rows.jabatan_pegawai}
              </p>
            </div>
            <Badge
              className={`text-xs ${
                rows.is_aktif
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              {rows.is_aktif ? "Aktif" : "Tidak Aktif"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* IDENTITAS */}
        <Section title="Identitas Pegawai">
          <Item label="NIP" value={rows.nip_pegawai} />
          <Item
            label="Jenis Kelamin"
            value={
              rows.jenis_kelamin === "L"
                ? "Laki - Laki"
                : rows.jenis_kelamin === "P"
                  ? "Perempuan"
                  : "-"
            }
          />
          <Item
            label="Tanggal Lahir"
            value={formatTanggalTanpaJam(rows.tanggal_lahir)}
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
          <Item label="Dibuat" value={formatTanggal(rows.created_at)} />
          <Item
            label="Terakhir Diupdate"
            value={formatTanggal(rows.updated_at)}
          />
        </Section>
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
