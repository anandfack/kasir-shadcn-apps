"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiRequest";

export default function GambarProduk({
  open,
  onOpenChange,
  data,
  produk,
  onSubmit,
}) {
  const rows = data?.data || [];
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    try {
      if (files.length === 0) return;

      setLoading(true);

      const formData = new FormData();

      formData.append("produk_id", produk.id);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const uploadGambar = await apiRequest(
        "POST",
        "/api/v1/admin/upload-gambar-produk",
        formData,
      );

      setFiles([]);
      onSubmit && onSubmit(uploadGambar);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setFiles([]);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-5xl">
        <div className="text-sm space-y-4">
          {/* HEADER */}
          <DialogHeader>
            <DialogTitle>Gambar Produk</DialogTitle>
            <DialogDescription>{produk?.nama_produk || "-"}</DialogDescription>
          </DialogHeader>

          {/* UPLOAD AREA */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-medium">Upload Gambar</p>

              <input
                type="file"
                multiple
                accept="image/webp,.webp"
                onChange={handleSelectFile}
                className="text-xs"
              />
              {files.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {files.map((file, index) => (
                    <Image
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </CardContent>
            {files.length > 0 && (
              <CardFooter>
                <Button
                  // type="submit"
                  onClick={handleUpload}
                  disabled={loading}
                  className="bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="w-2 h-2 animate-spin" />
                      Loading ...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-2 h-2" />
                      Upload
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>

          <div className="max-h-[400px] overflow-auto border rounded">
            {/* LIST GAMBAR */}
            <table className="w-full text-xs">
              <thead className="text-left">
                <tr>
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">Url</th>
                  <th className="p-2 border">Preview</th>
                </tr>
              </thead>

              <tbody>
                {rows.length > 0 ? (
                  rows.map((item, index) => (
                    <tr key={item.id}>
                      <td className="p-2 border align-top">{index + 1}</td>

                      <td className="p-2 border align-top break-all">
                        {item.url}
                      </td>

                      <td className="p-2 border align-top">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={item.url}
                            alt={item.url}
                            width={80}
                            height={80}
                            className="object-cover rounded border cursor-pointer"
                          />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-6 text-center text-sm text-muted-foreground"
                    >
                      📭 Data Tidak Ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
