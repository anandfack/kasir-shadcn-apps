import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import OurProducts from "@/components/our-products/OurProducts";

export default function Home() {
  return (
    <section>
      <Navbar />
      <Hero />
      <OurProducts />
    </section>
  );
}
