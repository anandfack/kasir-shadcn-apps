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
      <h1 className="font-anton uppercase text-3xl md:text-6xl">new arrivals</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 border border-black -mt-px -ml-px">
        {products.map((product) => (
          <div key={product.id} className="border border-black">
            <div className="relative h-72 md:h-[600px] w-full border-b border-black">
              <Image
                src={product.gambarProduks[0]?.url}
                alt={product.slug}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between p-2 md:px-8 md:py-5 border-t border-black font-anton uppercase">
              <h2 className="text-xs md:text-xl">{product.nama_produk}</h2>
              <button className="flex items-center gap-2 bg-black text-white px-2 py-1 md:px-3 md:py-2">
                <span className="uppercase text-xs">details</span>
                <PlayIcon className="w-3 h-3 md:w-6 md:h-6 fill-white stroke-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2 justify-center">
        <PlayIcon className="fill-black scale-x-[-1] w-4 h-4 md:w-6 md:h-6" />
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
        <PlayIcon className="fill-black w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
  );
}
