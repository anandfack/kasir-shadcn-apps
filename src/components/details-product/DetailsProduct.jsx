"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import publicApiRequest from "@/lib/publicApiRequest";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/store/features/cart/cartSlice";
// import { useState } from "react";
// import ImageWithFallback from "@/components/ImageWithFallback";

export default function DetailsProduct() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug;
  //   const products =

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState(null); // FIX: jadi object

  const [mainImage, setMainImage] = useState(""); // FIX

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await publicApiRequest.get(`/produk/${slug}`);
        setProducts(res.data.data || null); // FIX
      } catch (error) {
        console.error(error);
      }
    }

    if (slug) fetchData(); // FIX
  }, [slug]);

  useEffect(() => {
    if (products?.gambarProduks?.[0]?.url) {
      setMainImage(products.gambarProduks[0].url);
    }
  }, [products]);

  // ✅ TAMBAHKAN DI SINI (untuk debug Redux)
  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  const sizes = [
    ...new Set(
      (products?.produkVariants || []).map((v) => v.ukuran).filter(Boolean),
    ),
  ];

  if (!products) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // cara gunakan redux
    const productData = {
      id: products.id,
      name: products.nama_produk,
      price: products?.Harga?.[0]?.harga_jual,
      size: selectedSize,
      quantity: quantity, 
    };

    dispatch(addToCart(productData));
  };

  return (
    <>
      <div className="flex justify-center items-center mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] overflow-hidden border-4 border-black"
            >
              {products && (
                <div className="relative w-full h-[400px] md:h-[600px]">
                  <Image
                    src={mainImage} // FIX pakai state
                    alt={products?.nama_produk}
                    fill
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {products?.gambarProduks.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setMainImage(products?.gambarProduks?.[0]?.url)
                  }
                  className={`aspect-square border-2 overflow-hidden ${
                    mainImage === products?.gambarProduks?.[0]?.url
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  {products && (
                    <div className="relative w-full h-[400px] md:h-[600px]">
                      <Image
                        src={products?.gambarProduks?.[0]?.url}
                        alt={products?.nama_produk}
                        fill
                        className="w-full h-full object-cover grayscale hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </button>
                <button
                  onClick={() =>
                    setMainImage(products?.gambarProduks?.[1]?.url)
                  }
                  className={`aspect-square border-2 overflow-hidden ${
                    mainImage === products?.gambarProduks?.[1]?.url
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  <div className="relative w-full h-[400px] md:h-[600px]">
                    <Image
                      src={products?.gambarProduks?.[1]?.url}
                      alt={products?.nama_produk}
                      fill
                      className="w-full h-full object-cover grayscale hover:scale-105 transition-transform"
                    />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title and Price */}
            {/* <div className="absolute top-6 right-6 bg-white px-6 py-3 border-4 border-black rotate-3 group-hover:rotate-0 transition-transform">
                {featuredproducts && (
                  <p className="text-2xl font-anton">
                    ${featuredproducts?.Harga[0]?.harga_jual}
                  </p>
                )}
              </div> */}

            <div className="space-y-4 border-b-2 border-black pb-8">
              <p className="text-sm uppercase tracking-widest text-gray-600">
                {products?.kategori?.nama_kategori}
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-anton">
                {products?.nama_produk}
              </h1>

              <p className="text-3xl">${products?.Harga?.[0]?.harga_jual}</p>
            </div>

            {/* Description */}
            <div className="space-y-4 border-b-2 border-black pb-8">
              <h3 className="text-xl tracking-tighter font-anton">
                DESCRIPTION
              </h3>

              <p className="text-base leading-relaxed">
                {products?.deskripsi_produk}
              </p>
            </div>

            {/* Size Selector */}
            {/* <div className="space-y-4 border-b-2 border-black pb-8">
              <h3 className="text-xl tracking-tighter font-anton">
                SELECT SIZE
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border-2 transition-colors uppercase ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-black hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button className="text-sm underline hover:opacity-60 transition-opacity">
                SIZE GUIDE
              </button>
            </div> */}
            <div className="space-y-4 border-b-2 border-black pb-8">
              <h3 className="text-xl tracking-tighter font-anton">
                SELECT SIZE
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border-2 transition-colors uppercase ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-black hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button className="text-sm underline hover:opacity-60 transition-opacity">
                SIZE GUIDE
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4 border-b-2 border-black pb-8">
              <h3 className="text-xl tracking-tighter">QUANTITY</h3>
              <div className="flex items-center gap-4 w-fit border-2 border-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <span className="px-6 text-lg">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-5 hover:bg-white hover:text-black border-2 border-black transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ADD TO CART
            </button>

            {/* Product Details */}
            {/* <div className="space-y-4 pt-4">
              <h3 className="text-xl tracking-tighter">PRODUCT DETAILS</h3> */}
            {/* <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul> */}
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
