import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AIInsights from "./pages/AIInsights";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import Advisors from "./pages/Advisors";
import AdvisorDetail from "./pages/AdvisorDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          {/* Protected routes */}
          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/advisors" element={<Advisors />} />
            <Route path="/advisors/:id" element={<AdvisorDetail />} />
          </Route>
          {/* Demo mode routes — no auth */}
          <Route element={<AppLayout />}>
            <Route path="/demo/dashboard" element={<Dashboard />} />
            <Route path="/demo/transactions" element={<Transactions />} />
            <Route path="/demo/ai-insights" element={<AIInsights />} />
            <Route path="/demo/budgets" element={<Budgets />} />
            <Route path="/demo/reports" element={<Reports />} />
            <Route path="/demo/settings" element={<SettingsPage />} />
            <Route path="/demo/advisors" element={<Advisors />} />
            <Route path="/demo/advisors/:id" element={<AdvisorDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
