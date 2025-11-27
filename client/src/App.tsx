import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { DifficultyProvider } from "@/contexts/difficulty-context";
import { AudioProvider } from "@/contexts/audio-context";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DifficultyProvider>
          <AudioProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AudioProvider>
        </DifficultyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
