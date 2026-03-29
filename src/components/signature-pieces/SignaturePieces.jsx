"use client";

import publicApiRequest from "@/lib/publicApiRequest";
import { ArrowUpRight, PlayIcon, SquareChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SignaturePieces() {
  const [signaturePieces, setSignaturePieces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await publicApiRequest.get("/dashboard");

        setSignaturePieces(res.data.data.signaturePieces || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="mt-24">
      <h1 className="font-anton uppercase text-6xl">Signature Pieces</h1>

      <div className="grid grid-cols-3 border border-black -mt-px -ml-px">
        {signaturePieces.map((signaturePiece) => (
          <div key={signaturePiece.id} className="border border-black">
            <div className="relative w-full aspect-[4/5] border-b border-black">
              <Image
                src={signaturePiece.gambarProduks[0]?.url}
                alt={signaturePiece.nama_produk}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between px-8 py-5 border-t border-black font-anton uppercase">
              <h2 className="text-xl">{signaturePiece.nama_produk}</h2>
              <button className="flex items-center gap-2 bg-black text-white px-3 py-2">
                <span className="uppercase">details</span>
                <PlayIcon size={14} className="fill-white stroke-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button className="flex items-center gap-1 px-3 py-2 border-2 border-black uppercase hover:bg-black hover:text-white">
          <h1>Shop Now! </h1>
          <ArrowUpRight size={20} />
        </button>
      </div>
    </div>
  );
}
