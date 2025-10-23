import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProjectsSection from "@/components/ProjectsSection";
import DonationSection from "@/components/DonationSection";
import VideoSection from "@/components/VideoSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Updated with realistic totals based on actual project funding
  const donationData = {
    totalRaised: "R 12,432.00",
    donorCount: 47,
    impactMetric: "800+"
  };

  return (
    <main className="min-h-screen" data-testid="page-home">
      <HeroSection 
        totalRaised={donationData.totalRaised}
        donorCount={donationData.donorCount}
        impactMetric={donationData.impactMetric}
      />
      <AboutSection />
      <HowItWorksSection />
      <DonationSection />
      <ProjectsSection />
      <VideoSection />
      <PartnersSection />
      <Footer />
    </main>
  );
}