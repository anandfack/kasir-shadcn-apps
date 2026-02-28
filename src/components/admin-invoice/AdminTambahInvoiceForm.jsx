"use client";

import { useState, useMemo, Fragment } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Listbox, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { formatTanggalTanpaJam } from "@/lib/formatTanggal";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

export default function AdminTambahInvoice({ open, onSuccess, onError }) {
  const [penerimaanPoList, setPenerimaanPoList] = useState([
    {
      penerimaanPo: null,
    },
  ]);
  const [tanggalInvoice, setTanggalInvoice] = useState(new Date());
  const [penerimaanPoOpen, setPenerimaanPoOpen] = useState(false);
  const [searchPenerimaanPo, setSearchPenerimaanPo] = useState("");

  const { data: penerimaanPoData, isLoading: penerimaanPoLoading } = useQuery({
    queryKey: ["penerimaan-po"],
    queryFn: () =>
      apiRequest(
        "GET",
        "/api/v1/admin/penerimaan-po?without_invoice_penerimaan=true",
      ),
    staleTime: 1000 * 60 * 5,
  });

  const penerimaanPoDataList = useMemo(() => {
    if (!penerimaanPoData) return [];

    if (Array.isArray(penerimaanPoData)) return penerimaanPoData;
    if (Array.isArray(penerimaanPoData.data)) return penerimaanPoData.data;
    if (Array.isArray(penerimaanPoData.data?.data))
      return penerimaanPoData.data.data;
  }, [penerimaanPoData]);

  const filteredPenerimaanPo = useMemo(() => {
    if (!penerimaanPoDataList) return [];
    if (!searchPenerimaanPo) return penerimaanPoDataList;
    return penerimaanPoDataList.filter((item) =>
      `${item.nomor_penerimaan}`
        .toLowerCase()
        .includes(searchPenerimaanPo.toLowerCase()),
    );
  }, [penerimaanPoDataList, searchPenerimaanPo]);

  useEffect(() => {
    if (open) {
      setTanggalInvoice("");
    }
  }, [open]);

  useEffect(() => {
    setSearchPenerimaanPo("");
  }, [penerimaanPoList.length]);

  const selectedPenerimaanPoIds = (penerimaanPoList, currentIndex) => {
    return penerimaanPoList
      .filter((_, i) => i !== currentIndex)
      .map((item) => item.penerimaanPo?.id)
      .filter(Boolean);
  };

  const tambahBarisPenerimaanPo = () => {
    setPenerimaanPoList([...penerimaanPoList, { penerimaanPo: null }]);
  };

  const hapusBarisPenerimaanPo = (index) => {
    setPenerimaanPoList(penerimaanPoList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        tanggal_invoice: tanggalInvoice.toISOString(),
        detail_items: penerimaanPoList.map((item) => {
          return {
            penerimaan_id: item.penerimaanPo?.id,
          };
        }),
      };
      await apiRequest("POST", `/api/v1/admin/invoice`, payload);
      onSuccess();
    } catch (error) {
      onError();
    }
  };

  return (
    <DialogContent className="sm:max-w-7xl h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Tambah Invoice</DialogTitle>
        <DialogDescription>
          Tambahkan Invoice ke Dalam Daftar.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 overflow-hidden"
      >
        {/* Tanggal Invoice */}
        <div className="flex flex-col gap-2 max-w-xs">
          <Label htmlFor="tanggal-invoice">
            Tanggal Invoice <i className="text-red-500">*</i>
          </Label>

          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" />
                {tanggalInvoice instanceof Date && !isNaN(tanggalInvoice)
                  ? format(tanggalInvoice, "dd MMMM yyyy", { locale: id })
                  : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={8}
              className="w-auto p-0"
              style={{ pointerEvents: "auto" }}
            >
              <Calendar
                mode="single"
                locale={id}
                selected={tanggalInvoice}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={new Date().getFullYear()}
                disabled={{ after: new Date() }}
                onSelect={(date) => {
                  if (date) {
                    const now = new Date();
                    date.setHours(
                      now.getHours(),
                      now.getMinutes(),
                      now.getSeconds(),
                      now.getMilliseconds(),
                    );
                    setTanggalInvoice(date);
                  }
                }}
                initialFocus
                className="rounded-lg border"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Label htmlFor="daftar-penerimaan" className="text-left py-4">
          Daftar Penerimaan Purchase Order<i className="text-red-500">*</i>
        </Label>

        <div className="flex flex-col flex-1 overflow-y-auto">
          {penerimaanPoList.map((item, index) => {
            return (
              <div key={index} className="flex gap-2 items-center mx-2">
                <div className="flex-1">
                  <Listbox
                    value={item.penerimaanPo}
                    onChange={(penerimaan) => {
                      const newList = [...penerimaanPoList];
                      newList[index].penerimaanPo = penerimaan;
                      setPenerimaanPoList(newList);
                    }}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button
                        className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                        onClick={() => setPenerimaanPoOpen(true)}
                      >
                        <span className="block truncate">
                          {item.penerimaanPo
                            ? `${item.penerimaanPo.nomor_penerimaan || ""}${" "} ${"-"} ${""} ${item.penerimaanPo?.purchaseOrder?.supplier?.nama_supplier || ""} ${" "} ${"-"} ${""} ${formatTanggalTanpaJam(item.penerimaanPo?.tanggal_penerimaan)}`
                            : "Pilih Penerimaan Purchase Order"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setPenerimaanPoOpen(false)}
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover pt-0 pb-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                          <div className="sticky top-0 z-20 bg-popover p-2 border-b">
                            <Input
                              placeholder="Cari penerimaan Purchase Order..."
                              value={searchPenerimaanPo}
                              onChange={(e) =>
                                setSearchPenerimaanPo(e.target.value)
                              }
                              onKeyDownCapture={(e) => {
                                if (e.key === " ") e.stopPropagation();
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                          {penerimaanPoLoading ? (
                            <div className="py-2 px-4 text-muted-foreground italic">
                              Loading...
                            </div>
                          ) : filteredPenerimaanPo &&
                            filteredPenerimaanPo.length > 0 ? (
                            filteredPenerimaanPo
                              .filter((penerimaan) => {
                                const selectedPenerimaanPoIds = penerimaanPoList
                                  .filter((_, i) => i !== index)
                                  .map((item) => item.penerimaanPo?.id)
                                  .filter(Boolean);

                                return !selectedPenerimaanPoIds.includes(
                                  penerimaan.id,
                                );
                              })
                              .map((penerimaan) => (
                                <Listbox.Option
                                  key={penerimaan.id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-accent text-accent-foreground"
                                        : "text-popover-foreground"
                                    }`
                                  }
                                  value={penerimaan}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {penerimaan.nomor_penerimaan} -{" "}
                                        {
                                          penerimaan.purchaseOrder?.supplier
                                            ?.nama_supplier
                                        }{" "}
                                        -{" "}
                                        {formatTanggalTanpaJam(
                                          penerimaan?.tanggal_penerimaan,
                                        )}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                          <CheckIcon className="h-5 w-5" />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))
                          ) : (
                            <div className="py-2 px-4 text-muted-foreground italic">
                              Tidak ada data
                            </div>
                          )}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => hapusBarisPenerimaanPo(index)}
                  className="col-span-1"
                  disabled={penerimaanPoList.length === 1}
                >
                  ✕
                </Button>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={tambahBarisPenerimaanPo}
            variant="secondary"
          >
            + Tambah Penerimaan Purchase Order
          </Button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </DialogContent>
  );
}
