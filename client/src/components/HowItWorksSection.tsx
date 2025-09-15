import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, QrCode, Eye, TrendingUp } from "lucide-react";
import qrImage from "@assets/generated_images/QR_code_tap_payment_visual_f6eafc7c.png";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Smartphone,
      title: "Easy Tap-to-Donate",
      description: "Giving is as easy as tapping your bank card or phone. No forms. No hassle. Just one quick tap to make a difference - on the spot."
    },
    {
      icon: QrCode,
      title: "Scan and Explore",
      description: "Every screen features a unique QR code that connects directly to our TAP4IMPACT website for full transparency."
    },
    {
      icon: Eye,
      title: "Track Impact",
      description: "See exactly how your donation is being used, meet our partners, and learn about the projects you're helping to fund."
    },
    {
      icon: TrendingUp,
      title: "Real Results",
      description: "Track the real-world impact your support is making in agricultural communities across South Africa."
    }
  ];

  const handleQRClick = () => {
    console.log('QR code clicked');
    // Scroll to donation section
    const donationSection = document.getElementById('donation-section');
    if (donationSection) {
      donationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how-it-works-section" className="py-16 bg-background" data-testid="section-how-it-works">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-how-title">
              How TAP4IMPACT Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-subtitle">
              Making donations simple, transparent, and impactful through innovative technology
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card key={index} className="p-6 hover-elevate" data-testid={`card-step-${index}`}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <step.icon className="w-6 h-6 text-primary" data-testid={`icon-step-${index}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-step-title-${index}`}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-desc-${index}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* QR Code Visual */}
            <div className="text-center">
              <Card className="p-8 hover-elevate" data-testid="card-qr-demo">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground" data-testid="text-qr-title">
                    Try It Now
                  </h3>
                  <div className="flex justify-center">
                    <img 
                      src={qrImage} 
                      alt="QR Code for Tap4Impact donations" 
                      className="w-48 h-48 rounded-lg shadow-md"
                      data-testid="img-qr-code"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid="text-qr-instruction">
                    Scan with your phone camera or tap with your card
                  </p>
                  <Button 
                    onClick={handleQRClick} 
                    className="w-full" 
                    data-testid="button-try-qr"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Experience Tap-to-Donate
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}