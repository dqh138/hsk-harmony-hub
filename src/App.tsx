import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HSKLevel from "./pages/HSKLevel";
import MockExams from "./pages/MockExams";
import MockExamPractice from "./pages/MockExamPractice";
import SavedWords from "./pages/SavedWords";
import NotFound from "./pages/NotFound";
import SelectionPopover from "./components/SelectionPopover";
import HighlightStyles from "./components/HighlightStyles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SelectionPopover />
        <HighlightStyles />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hsk/:level" element={<HSKLevel />} />
          <Route path="/mock-exams" element={<MockExams />} />
          <Route path="/mock-exam/:examId" element={<MockExamPractice />} />
          <Route path="/saved-words" element={<SavedWords />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
