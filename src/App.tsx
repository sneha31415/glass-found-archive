import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ItemsProvider } from "@/contexts/ItemsContext";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import ItemsList from "@/pages/ItemsList";
import ItemDetail from "@/pages/ItemDetail";
import ReportFound from "@/pages/ReportFound";
import ReportLost from "@/pages/ReportLost";
import ReviewClaims from "@/pages/ReviewClaims";
import MyClaims from "@/pages/MyClaims";
import About from "@/pages/About";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ItemsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="pt-16"> {/* Add padding to account for fixed navbar */}
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/items" element={<ItemsList />} />
                  <Route path="/items/:id" element={<ItemDetail />} />
                  <Route path="/report-found" element={<ReportFound />} />
                  <Route path="/report-lost" element={<ReportLost />} />
                  <Route path="/review-claims" element={<ReviewClaims />} />
                  <Route path="/my-claims" element={<MyClaims />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </ItemsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
