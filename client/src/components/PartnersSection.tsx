import { Button } from "@/components/ui/button";

export default function PartnersSection() {
  const partners = [
    {
      name: "John Deere",
      logo: "/logos/John_Deere_logo.svg.png",
      url: "https://www.deere.com/sub-saharan/en"
    },
    {
      name: "Idalia Holdings",
      logo: "/logos/Idalia Holdings Logo.png",
      url: "#"
    },
    {
      name: "WeBuyCars",
      logo: "/logos/We Buy Cars Logo.png",
      url: "https://www.webuycars.co.za"
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center max-w-4xl mx-auto">
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