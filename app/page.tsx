import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Provider from "@/components/provider";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Provider />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
