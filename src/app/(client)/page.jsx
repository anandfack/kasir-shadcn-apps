import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import OurProduct from "@/components/our-product/OurProduct";
import SignaturePieces from "@/components/signature-pieces/SignaturePieces";
import Tagline from "@/components/tagline/Tagline";

export default function Home() {
  return (
    <section>
      <Navbar />
      <Hero />
      <OurProduct />
      <Tagline />
      <SignaturePieces />
    </section>
  );
}
