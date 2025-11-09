import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import DonationSuccess from "@/pages/DonationSuccess";
import DonationCancelled from "@/pages/DonationCancelled";

function IndexRedirect() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/");
  }, [setLocation]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/index.html" component={IndexRedirect} />
      <Route path="/donation/success" component={DonationSuccess} />
      <Route path="/donation/cancelled" component={DonationCancelled} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
