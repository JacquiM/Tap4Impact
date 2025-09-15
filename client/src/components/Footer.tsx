import { Button } from "@/components/ui/button";
import { Heart, Mail, Globe, Shield } from "lucide-react";
import { SiFacebook, SiLinkedin, SiInstagram, SiTiktok } from "react-icons/si";

export default function Footer() {
  const handleContactClick = () => {
    console.log('Contact clicked');
    // todo: remove mock functionality - implement contact form
  };

  const handlePartnerClick = (partner: string) => {
    console.log('Partner clicked:', partner);
    // todo: remove mock functionality - navigate to partner website
  };

  const handleSocialClick = (platform: string, url: string) => {
    console.log('Social media clicked:', platform);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-card border-t border-card-border" data-testid="footer-main">
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tap4Impact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2" data-testid="text-footer-about-title">
                <Heart className="w-5 h-5 text-primary" />
                Tap4Impact
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-footer-about-desc">
                Supporting the Agri Securitas Trust Fund's mission to create safer rural environments 
                for South African agricultural communities.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground" data-testid="text-footer-contact-title">Contact</h4>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => window.open('mailto:info@tap4.co.za', '_self')}
                  data-testid="button-footer-contact"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  info@tap4.co.za
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => window.open('https://agrisecuritas.org', '_blank', 'noopener,noreferrer')}
                  data-testid="button-footer-website"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  agrisecuritas.org
                </Button>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="font-semibold text-foreground mb-2" data-testid="text-footer-social-title">Follow Tap4Impact</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => handleSocialClick('facebook', 'https://www.facebook.com/share/12KN9V3M6eL/?mibextid=wwXIfr')}
                    data-testid="button-social-facebook"
                  >
                    <SiFacebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => handleSocialClick('linkedin', 'https://www.linkedin.com/company/tap4impact/')}
                    data-testid="button-social-linkedin"
                  >
                    <SiLinkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/tap4impact?igsh=c2V4MDB2YTB3NXJw')}
                    data-testid="button-social-instagram"
                  >
                    <SiInstagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => handleSocialClick('tiktok', 'https://www.tiktok.com/@tap4impact?_t=ZM-8wIn3NTTrKH&_r=1')}
                    data-testid="button-social-tiktok"
                  >
                    <SiTiktok className="w-4 h-4 mr-2" />
                    TikTok
                  </Button>
                </div>
              </div>
            </div>


            {/* Partners */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground" data-testid="text-footer-partners-title">Partners</h4>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => handlePartnerClick('idalia')}
                  data-testid="button-partner-idalia"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Idalia Holdings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => handlePartnerClick('webuy-cars')}
                  data-testid="button-partner-webuy-cars"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  WeBuy Cars
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => handlePartnerClick('john-deere')}
                  data-testid="button-partner-john-deere"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  John Deere
                </Button>
              </div>
            </div>

            {/* Trust Fund */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground" data-testid="text-footer-legal-title">Trust Fund</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground" data-testid="text-footer-trust-reg">
                  Registered Trust Fund
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-footer-trust-patron">
                  Under patronage of Agri SA
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-footer-trust-mission">
                  Dedicated to rural safety and agricultural community support
                </p>
              </div>
            </div>
          </div>


          {/* Copyright */}
          <div className="border-t border-card-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
              © 2024 Agri Securitas Trust Fund. Making agricultural communities safer, one tap at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}