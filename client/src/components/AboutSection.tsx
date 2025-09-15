import { Card } from "@/components/ui/card";
import { Shield, Users, Wheat, Target } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: "Rural Safety",
      description: "Creating safer environments for agricultural communities across South Africa"
    },
    {
      icon: Wheat,
      title: "Food Security",
      description: "Protecting those who feed our nation and ensuring sustainable agriculture"
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Supporting farming families and rural communities with targeted initiatives"
    },
    {
      icon: Target,
      title: "Strategic Impact",
      description: "Funding innovative projects that make real, measurable differences"
    }
  ];

  return (
    <section id="about-section" className="py-16 bg-muted/30" data-testid="section-about">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-about-title">
              About Agri Securitas Trust Fund
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-about-subtitle">
              Inspired by the landmark Rural Safety Summit of October 10, 1998, our Trust Fund was founded 
              under the valued patronage of Agri SA to confront agricultural challenges with purpose and determination.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-mission-title">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-mission-content">
                  South Africa's agricultural communities are the heart of our nation. Yet these communities 
                  face mounting complex challenges, particularly concerning safety and sustainability. By funding 
                  strategically targeted, innovative projects, the Trust Fund plays a vital role in creating 
                  safer rural environments.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-funding-title">
                  Sustainable Funding
                </h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-funding-content">
                  While regular fundraising events provide essential funding, long-term success relies on broader 
                  participation from individuals, businesses, and communities. In partnership with Idalia Holdings (Pty) Ltd, 
                  we've introduced an exciting new initiative to ensure more stable, sustainable income streams.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover-elevate" data-testid={`card-feature-${index}`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <feature.icon className="w-6 h-6 text-primary" data-testid={`icon-feature-${index}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2" data-testid={`text-feature-title-${index}`}>
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-feature-desc-${index}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}