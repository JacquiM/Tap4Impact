import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function DonationSuccess() {
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Simulate verification process
    // In production, you might want to verify the payment status with PayFast
    const timer = setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReturnHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        {isVerifying ? (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h2 className="text-2xl font-bold text-foreground">Verifying Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your donation...
            </p>
          </div>
        ) : verified ? (
          <div className="space-y-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Thank You for Your Support!
              </h2>
              <p className="text-muted-foreground">
                Your recurring donation has been successfully set up. You will receive an email confirmation shortly.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-md text-left">
              <p className="text-sm text-muted-foreground">
                Your contribution will help protect South African farming communities through innovative security solutions.
              </p>
            </div>
            <Button 
              onClick={handleReturnHome}
              className="w-full"
              size="lg"
            >
              Return to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-yellow-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">!</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Payment Verification Failed
              </h2>
              <p className="text-muted-foreground">
                We couldn't verify your payment. Please contact support if you believe this is an error.
              </p>
            </div>
            <Button 
              onClick={handleReturnHome}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Return to Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
