import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import launchVideo from "@assets/tap4impact-launch-video.mp4";

export default function VideoSection() {

  return (
    <section id="impact-section" className="py-16 bg-background" data-testid="section-video">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Play className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-video-title">
                Tap4Impact Launch Video
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-video-subtitle">
              Watch how the Tap4Impact initiative is revolutionizing donation experiences for the 
              Agri Securitas Trust Fund. See the technology in action and learn about our mission 
              to protect South Africa's agricultural communities.
            </p>
          </div>

          {/* Video Container */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden" data-testid="card-video-container">
              {/* Responsive 16:9 Aspect Ratio Wrapper */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                <video
                  src={launchVideo}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster=""
                  data-testid="video-player"
                >
                  <p className="text-muted-foreground text-center p-4">
                    Your browser does not support the video tag. 
                    <a href={launchVideo} className="text-primary underline ml-1">
                      Download the video instead.
                    </a>
                  </p>
                </video>
              </div>
            </Card>
          </div>

          {/* Video Description */}
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-muted-foreground leading-relaxed" data-testid="text-video-description">
              This video showcases the innovative QR code tap-to-give technology that makes donating 
              to agricultural safety projects as simple as tapping your phone. Every contribution, 
              no matter the size, helps create safer rural environments for South African farming communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}