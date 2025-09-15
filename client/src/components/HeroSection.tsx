import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode } from "lucide-react";
import DonationStats from "./DonationStats";
import heroImage from "@assets/generated_images/South_African_agricultural_hero_image_ca68fc03.png";

interface HeroSectionProps {
  totalRaised: string;
  donorCount: number;
  impactMetric?: string;
}

export default function HeroSection({ totalRaised, donorCount, impactMetric }: HeroSectionProps) {
  const handleDonateClick = () => {
    console.log('Donate button clicked');
    // Scroll to donation section
    const donationSection = document.getElementById('donation-section');
    if (donationSection) {
      donationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMoreClick = () => {
    console.log('Learn more clicked');
    // Scroll to projects section
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-16 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight" data-testid="text-hero-title">
              Protecting South Africa's
              <span className="block text-primary"> Agricultural Heart</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
              Support the Agri Securitas Trust Fund's mission to create safer rural environments. 
              One tap can make a lasting difference for agricultural communities.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
              onClick={handleDonateClick}
              data-testid="button-donate"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Tap to Donate Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg"
              onClick={handleLearnMoreClick}
              data-testid="button-learn-more"
            >
              Learn Our Impact
            </Button>
          </div>

          {/* Donation Statistics */}
          <div className="pt-8">
            <DonationStats 
              totalRaised={totalRaised}
              donorCount={donorCount}
              impactMetric={impactMetric}
            />
          </div>
        </div>
      </div>
    </section>
  );
}