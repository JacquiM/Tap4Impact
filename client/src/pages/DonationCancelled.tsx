import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function DonationCancelled() {
  const [, setLocation] = useLocation();

  const handleReturnHome = () => {
    setLocation("/");
  };

  const handleTryAgain = () => {
    setLocation("/#donation-section");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="space-y-6">
          <XCircle className="w-16 h-16 text-orange-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Donation Cancelled
            </h2>
            <p className="text-muted-foreground">
              Your donation was cancelled. No charges have been made to your account.
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-md text-left">
            <p className="text-sm text-muted-foreground">
              If you experienced any issues or have questions, please don't hesitate to contact us.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={handleTryAgain}
              className="w-full"
              size="lg"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleReturnHome}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
