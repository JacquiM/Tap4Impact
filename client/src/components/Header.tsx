import { Button } from "@/components/ui/button";
import { QrCode, Menu, X } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/agri-securitas-tap4impact-logo.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDonateClick = () => {
    console.log('Header donate clicked');
    // Scroll to donation section
    const donationSection = document.getElementById('donation-section');
    if (donationSection) {
      donationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigationClick = (section: string) => {
    console.log('Navigate to section:', section);
    
    // Map navigation items to section IDs
    const sectionMap: { [key: string]: string } = {
      'about': 'about-section',
      'how-it-works': 'how-it-works-section', 
      'projects': 'projects-section',
      'impact': 'impact-section'
    };
    
    const targetId = sectionMap[section];
    if (targetId) {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header-main">
      <div className="container mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3" data-testid="header-logo-section">
            <img 
              src={logoImage} 
              alt="Agri Securitas Tap4Impact Official Logo"
              className="h-10 w-auto object-contain rounded-md"
              data-testid="img-logo"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="nav-desktop">
            <button
              onClick={() => handleNavigationClick('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="button-nav-about"
            >
              About
            </button>
            <button
              onClick={() => handleNavigationClick('how-it-works')}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="button-nav-how-it-works"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavigationClick('projects')}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="button-nav-projects"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavigationClick('impact')}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="button-nav-impact"
            >
              Impact
            </button>
          </nav>

          {/* Desktop Donate Button */}
          <div className="hidden md:flex items-center">
            <Button
              onClick={handleDonateClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              data-testid="button-header-donate"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Tap to Donate
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            data-testid="button-mobile-menu"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background" data-testid="nav-mobile">
            <nav className="py-4 space-y-2">
              <button
                onClick={() => handleNavigationClick('about')}
                className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 transition-colors font-medium"
                data-testid="button-mobile-nav-about"
              >
                About
              </button>
              <button
                onClick={() => handleNavigationClick('how-it-works')}
                className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 transition-colors font-medium"
                data-testid="button-mobile-nav-how-it-works"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavigationClick('projects')}
                className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 transition-colors font-medium"
                data-testid="button-mobile-nav-projects"
              >
                Projects
              </button>
              <button
                onClick={() => handleNavigationClick('impact')}
                className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 transition-colors font-medium"
                data-testid="button-mobile-nav-impact"
              >
                Impact
              </button>
              
              {/* Mobile Donate Button */}
              <div className="px-4 pt-2">
                <Button
                  onClick={handleDonateClick}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  data-testid="button-mobile-donate"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Tap to Donate
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}