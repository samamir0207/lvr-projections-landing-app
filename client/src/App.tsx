import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProjectionPage from "@/pages/ProjectionPage";
import AdminRunsPage from "@/pages/AdminRunsPage";

function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#f7f4f0] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <img 
          src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/logo02.png" 
          alt="LocalVR Logo" 
          className="mx-auto w-[120px] mb-8"
        />
        <h1 className="text-2xl font-bold text-[#333333] mb-4">We Ran Into an Issue</h1>
        <p className="text-[#333333]/70 mb-6">
          Sorry, we couldn't load this page. Please reach out to your LocalVR representative for assistance.
        </p>
      </div>
    </div>
  );
}

function HomeRedirect() {
  if (import.meta.env.PROD) {
    window.location.href = "https://www.golocalvr.com/contact";
    return null;
  }
  return <ErrorPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/admin">
        <AdminRunsPage />
      </Route>
      <Route path="/:aeSlug/:slug">
        <ProjectionPage />
      </Route>
      <Route component={ErrorPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
