import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CourseManager from "./pages/CourseManager";
import CourseForm from "./pages/CourseForm";
import PageManager from "./pages/PageManager";
import PageForm from "./pages/PageForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Navbar />
            <main className="p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<CourseManager />} />
                <Route path="/courses/new" element={<CourseForm />} />
                <Route path="/courses/:id" element={<CourseForm />} />
                <Route path="/pages" element={<PageManager />} />
                <Route path="/pages/new" element={<PageForm />} />
                <Route path="/pages/:id" element={<PageForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
