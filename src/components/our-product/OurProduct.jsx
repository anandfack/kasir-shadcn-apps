"use client";

import publicApiRequest from "@/lib/publicApiRequest";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function OurProduct() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await publicApiRequest.get("/dashboard");

        setProducts(res.data.data.ourProducts || []);
        setFeaturedProducts(res.data.data.featuredProducts || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="mt-10">
        <h1 className="font-anton uppercase text-3xl md:text-6xl">
          new arrivals
        </h1>

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
      <div className="flex items-baseline justify-between mb-8 border-b-4 border-black pb-4 mt-20">
        <div>
          <h2 className="text-5xl md:text-7xl tracking-tighter font-anton">
            FEATURED PRODUCTS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Large Editorial Block */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="col-span-12 md:col-span-8 relative group cursor-pointer"
        >
          {/* <Link to={`/product/${featuredProducts[1].id}`}> */}
          <Link href="#">
            <div className="relative h-[400px] md:h-[600px] overflow-hidden border-4 border-black">
              {featuredProducts[0] && (
                <div className="relative w-full h-[400px] md:h-[600px]">
                  <Image
                    src={
                      featuredProducts[0]?.gambarProduks?.[0]?.url ||
                      "/fallback.jpg"
                    }
                    alt={featuredProducts[0]?.nama_produk}
                    fill
                    className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Magazine Title Overlay */}
              <div className="absolute top-0 left-0 right-0 bg-black text-white p-4 border-b-4 border-white">
                <p className="text-xs uppercase tracking-widest">
                  {/* {featuredProducts[1].kategori_id} */}
                  {featuredProducts[0] && (
                    <div>{featuredProducts[0].kategori?.nama_kategori}</div>
                  )}
                </p>
              </div>

              {/* Price Tag */}
              <div className="absolute top-6 right-6 bg-white px-6 py-3 border-4 border-black rotate-3 group-hover:rotate-0 transition-transform">
                {featuredProducts[0] && (
                  <p className="text-2xl font-anton">
                    ${featuredProducts[0]?.Harga[0]?.harga_jual}
                  </p>
                )}
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-6 border-t-4 border-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {featuredProducts[0] && (
                  <h3 className="text-2xl md:text-3xl tracking-tighter mb-2 font-anton">
                    {featuredProducts[0]?.nama_produk}
                  </h3>
                )}
                {featuredProducts[0] && (
                  <p className="text-sm">
                    {featuredProducts[0].deskripsi_produk.substring(0, 100)}...
                  </p>
                )}
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Vertical Editorial Blocks */}
        <div className="col-span-12 md:col-span-4 space-y-4 md:space-y-6">
          {featuredProducts.slice(1, 3).map((product, index) => {
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group cursor-pointer"
              >
                {/* <Link to={`/product/${product.id}`}> */}
                <Link href="#">
                  <div className="relative h-[285px] overflow-hidden border-4 border-black">
                    <Image
                      src={product.gambarProduks[0]?.url}
                      alt={product.slug}
                      className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500"
                      fill
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

                    {/* Magazine Number Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-black text-white border-4 border-white flex items-center justify-center">
                      <span className="text-2xl font-anton">{index + 2}</span>
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black text-white p-4 border-t-4 border-white">
                      <p className="text-xs uppercase tracking-widest mb-1 text-white/70">
                        {product.kategori_produk?.nama_kategori}
                      </p>
                      <h3 className="text-lg md:text-xl tracking-tighter mb-1 font-anton">
                        {product.nama_produk}
                      </h3>
                      <p className="text-lg">${product.Harga[0]?.harga_jual}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
