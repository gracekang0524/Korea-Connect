import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/Home";
import JobsPage from "@/pages/Jobs";
import HousingPage from "@/pages/Housing";
import MarketplacePage from "@/pages/Marketplace";
import GuidesPage from "@/pages/Guides";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navigation />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/jobs" component={JobsPage} />
          <Route path="/housing" component={HousingPage} />
          <Route path="/marketplace" component={MarketplacePage} />
          <Route path="/guides" component={GuidesPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="py-12 bg-secondary border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} KoreaLife. Built for the community.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
