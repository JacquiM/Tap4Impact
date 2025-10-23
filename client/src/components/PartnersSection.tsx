import { Button } from "@/components/ui/button";

export default function PartnersSection() {
  const partners = [
    {
      name: "Agri Securitas",
      logo: "/logos/agri-securitas-logo.png",
      url: "https://agrisecuritas.org"
    },
    // Add more partners here
  ];

  return (
    <section className="py-16 bg-white" data-testid="section-partners">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-partners-title">
              Our Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-partners-subtitle">
              Working together to create safer agricultural communities
            </p>
          </div>

          {/* Partners Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner) => (
              <Button
                key={partner.name}
                variant="ghost"
                className="p-4 hover:bg-muted transition-colors duration-200 w-full h-auto aspect-[3/2] relative"
                onClick={() => window.open(partner.url, '_blank', 'noopener,noreferrer')}
                data-testid={`button-partner-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-contain"
                  data-testid={`img-partner-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}