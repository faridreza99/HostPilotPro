import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Layout from "./components/Layout";
import { useAuth } from "./hooks/useAuth";

// Core pages
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import Properties from "./pages/Properties";
import Tasks from "./pages/Tasks";
import Bookings from "./pages/Bookings";
import SimpleFinances from "./pages/SimpleFinances";
import QuickLogin from "./pages/QuickLogin";
import NotFound from "./pages/not-found";

// AI ROI Predictions page
import AiRoiPredictionsManagement from "./pages/admin/AiRoiPredictionsManagement";

function AppRoutes() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show login page
  if (!user) {
    return <QuickLogin />;
  }

  // User is authenticated, show the main app
  return (
    <Layout>
      <Switch>
        <Route path="/" component={RoleBasedDashboard} />
        <Route path="/properties" component={Properties} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/finances" component={SimpleFinances} />
        
        {/* AI ROI Predictions Management */}
        <Route path="/admin/ai-roi-predictions" component={AiRoiPredictionsManagement} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRoutes />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}