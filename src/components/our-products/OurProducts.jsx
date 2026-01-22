import { PlayIcon } from "lucide-react";
import Image from "next/image";

const products = [
  { id: 1, title: "Product 1", image: "/image/collection-image.webp" },
  { id: 2, title: "Product 2", image: "/image/collection-image.webp" },
  { id: 3, title: "Product 3", image: "/image/collection-image.webp" },
  { id: 4, title: "Product 4", image: "/image/collection-image.webp" },
  { id: 5, title: "Product 5", image: "/image/collection-image.webp" },
  { id: 6, title: "Product 6", image: "/image/collection-image.webp" },
];

export default function OurProducts() {
  return (
    <div className="mt-10">
      <h1 className="font-anton uppercase text-8xl">our product</h1>

      <div className="grid grid-cols-3 border border-black -mt-px -ml-px">
        {products.map((product) => (
          <div key={product.id} className="border border-black">
            <div className="relative w-full aspect-[4/5] border-b border-black">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between px-8 py-5 border-t border-black font-anton uppercase">
              <h2 className="text-xl">{product.title}</h2>
              <button className="flex items-center gap-2 bg-black text-white px-3 py-2">
                <span className="uppercase">details</span>
                <PlayIcon size={14} className="fill-white stroke-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
