import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ActionPanel from "@/components/sections/ActionPanel";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import Destinations from "@/components/sections/Destinations";
import Testimonials from "@/components/sections/Testimonials";
import Support from "@/components/sections/Support";
import Footer from "@/components/sections/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <ActionPanel />
      <Services />
      <HowItWorks />
      <Destinations />
      <Testimonials />
      <Support />
      <Footer />
      <ChatWidget />
    </main>
  );
}