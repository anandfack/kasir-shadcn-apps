import Campaign from "@/components/campaign/Campaign";
import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import OurProduct from "@/components/our-product/OurProduct";
import SignaturePieces from "@/components/signature-pieces/SignaturePieces";
// import Tagline from "@/components/tagline/Tagline";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="mx-5">
        <Hero />
        <OurProduct />
        <Campaign />
        {/* <Tagline /> */}
        <SignaturePieces />
        <Footer />
      </section>
    </>
  );
}
