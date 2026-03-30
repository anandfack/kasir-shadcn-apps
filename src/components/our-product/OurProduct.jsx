"use client";

import publicApiRequest from "@/lib/publicApiRequest";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OurProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await publicApiRequest.get("/dashboard");

        setProducts(res.data.data.ourProducts || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="mt-10">
      <h1 className="font-anton uppercase text-6xl">new arrivals</h1>

      <div className="grid grid-cols-3 border border-black -mt-px -ml-px">
        {products.map((product) => (
          <div key={product.id} className="border border-black">
            <div className="relative h-[600px] w-full border-b border-black">
              <Image
                src={product.gambarProduks[0]?.url}
                alt={product.slug}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between px-8 py-5 border-t border-black font-anton uppercase">
              <h2 className="text-xl">{product.nama_produk}</h2>
              <button className="flex items-center gap-2 bg-black text-white px-3 py-2">
                <span className="uppercase">details</span>
                <PlayIcon size={14} className="fill-white stroke-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2 justify-center">
        <PlayIcon size={24} className="fill-black scale-x-[-1]" />
        <div className="font-anton text-xs p-2 border-[2px] border-black">
          1
        </div>
        <div className="font-anton text-xs p-2 border-[2px] border-black">
          2
        </div>
        <div className="font-anton text-xs p-2 border-[2px] border-black">
          3
        </div>
        <div className="font-anton text-xs p-2 border-[2px] border-black">
          4
        </div>
        <PlayIcon size={24} className="fill-black" />
      </div>
    </div>
  );
}
