import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { Web3Provider } from "@/contexts/Web3Context";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import AlertsPage from "@/pages/AlertsPage";
import ContactsPage from "@/pages/ContactsPage";
import MapPage from "@/pages/MapPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Web3Provider>
        <UserProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner position="top-right" />
        </UserProvider>
      </Web3Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
