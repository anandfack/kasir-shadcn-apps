"use client";

import publicApiRequest from "@/lib/publicApiRequest";
import { ArrowUpRight, PlayIcon, SquareChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    <div className="mt-10">
      <h1 className="font-anton uppercase text-3xl md:text-6xl">
        Signature Pieces
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 border border-black -mt-px -ml-px">
        {signaturePieces.map((signaturePiece) => (
          <div key={signaturePiece.id} className="border border-black">
            <div className="relative h-72 md:h-[600px] w-full border-b border-black">
              <Image
                src={signaturePiece.gambarProduks[0]?.url}
                alt={signaturePiece.nama_produk}
                fill
                className="object-cover grayscale"
              />
            </div>

            <div className="flex items-center justify-between p-2 md:px-8 md:py-5 border-t border-black font-anton uppercase">
              <h2 className="text-xs md:text-xl">
                {signaturePiece.nama_produk}
              </h2>
              <Link
                className="flex items-center gap-2 bg-black text-white px-2 py-1 md:px-3 md:py-2"
                href={`/products/${signaturePiece.slug}`}
              >
                <span className="uppercase text-xs">details</span>
                <PlayIcon className="w-3 h-3 md:w-6 md:h-6 fill-white stroke-white" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button className="flex items-center text-xs md:text-base gap-1 px-3 py-2 border-2 border-black uppercase hover:bg-black hover:text-white">
          <h1>Shop Now! </h1>
          <ArrowUpRight className="h-3 w-3 md:h-6 md:w-6" size={20} />
        </button>
      </div>
    </div>
  );
}
