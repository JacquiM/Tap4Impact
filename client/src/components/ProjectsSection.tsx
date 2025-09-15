import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import projectImage from "@assets/agricultural-tractor-impact.jpg";

export default function ProjectsSection() {
  // Real project data from Agri Securitas Trust Fund
  const projects = [
    {
      id: 1,
      title: "East London Western District Camera System",
      description: "Camera systems installed to monitor livestock theft, cable theft, and infrastructure theft in an area known as a hotspot for hijacking of business people.",
      location: "East London, Eastern Cape",
      status: "Active",
      impact: "Area monitoring established",
      year: "2024"
    },
    {
      id: 2,
      title: "Jansenville Agricultural Association Security",
      description: "Camera systems set up along main access routes to address stock theft, game poaching and farm attacks in the area.",
      location: "Jansenville, Eastern Cape",
      status: "Active", 
      impact: "Access route monitoring",
      year: "2024"
    },
    {
      id: 3,
      title: "Sandveld Agricultural Association Multi-Project",
      description: "Comprehensive funding for drone batteries, bulletproof vests and camera systems to combat cable theft, solar panel theft and stock theft.",
      location: "Sandveld, Western Cape",
      status: "Active",
      impact: "Multi-threat security response",
      year: "2024"
    }
  ];

  const handleViewAllProjects = () => {
    console.log('View all projects clicked');
    // Navigate to full projects page
    window.open('https://agrisecuritas.org/projects/eastern-cape', '_blank', 'noopener,noreferrer');
  };

  const handleProjectClick = (projectId: number) => {
    console.log('Project clicked:', projectId);
    // todo: remove mock functionality - show project details
  };

  return (
    <section id="projects-section" className="py-16 bg-muted/30" data-testid="section-projects">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-projects-title">
              Projects Making a Difference
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-projects-subtitle">
              See how your contributions are creating safer environments for agricultural communities
            </p>
          </div>

          {/* Featured Project */}
          <Card className="mb-12 overflow-hidden hover-elevate" data-testid="card-featured-project">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img 
                  src={projectImage} 
                  alt="Agricultural safety project in action" 
                  className="w-full h-full object-cover"
                  data-testid="img-featured-project"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground" data-testid="badge-featured">
                    Featured Project
                  </Badge>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground" data-testid="text-featured-title">
                    Agri Eastern Cape Coordination Centre
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-featured-desc">
                    The organisation has established a coordination centre through which more than 800 cameras 
                    are monitored on behalf of their farmers' associations across the province. Funds have been 
                    approved for camera system batteries to replace obsolete batteries across farmers' associations.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span data-testid="text-featured-location">Eastern Cape Province</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span data-testid="text-featured-date">2024</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleViewAllProjects} 
                    className="w-fit"
                    data-testid="button-view-featured"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Project Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="p-6 hover-elevate cursor-pointer" 
                onClick={() => handleProjectClick(project.id)}
                data-testid={`card-project-${project.id}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge 
                      variant={project.status === 'Active' ? 'default' : project.status === 'Completed' ? 'secondary' : 'outline'}
                      data-testid={`badge-status-${project.id}`}
                    >
                      {project.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary" data-testid={`text-year-${project.id}`}>
                        {project.year}
                      </p>
                      <p className="text-xs text-muted-foreground">Year</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2" data-testid={`text-project-title-${project.id}`}>
                      {project.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-project-desc-${project.id}`}>
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span data-testid={`text-location-${project.id}`}>{project.location}</span>
                    </div>
                    <p className="text-sm font-medium text-chart-3" data-testid={`text-impact-${project.id}`}>
                      {project.impact}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleViewAllProjects}
              data-testid="button-view-all-projects"
            >
              View All Projects
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}