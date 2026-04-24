import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import HSKLevel from "./pages/HSKLevel";
import Grammar from "./pages/Grammar";
import MockExams from "./pages/MockExams";
import MockExamPractice from "./pages/MockExamPractice";
import SavedWords from "./pages/SavedWords";
import Flashcards from "./pages/Flashcards";
import VocabularyLevel from "./pages/VocabularyLevel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudyToolsLayer from "./components/StudyToolsLayer";
import { ChineseDecorBackdrop } from "./components/ChineseDecor";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { initSavedWords } from "./lib/savedWords";

const queryClient = new QueryClient();

const SavedWordsBootstrap = () => {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    initSavedWords(user?.id ?? null);
  }, [user, loading]);
  return null;
};

const PreviewTokenBridge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const currentToken = url.searchParams.get("__lovable_token");
    const storedToken = sessionStorage.getItem("hskhub:preview-token");

    if (currentToken) {
      sessionStorage.setItem("hskhub:preview-token", currentToken);
      return;
    }

    if (!storedToken) return;

    const params = new URLSearchParams(location.search);
    if (params.get("__lovable_token") === storedToken) return;

    params.set("__lovable_token", storedToken);
    navigate(
      {
        pathname: location.pathname,
        search: `?${params.toString()}`,
        hash: location.hash,
      },
      { replace: true }
    );
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ChineseDecorBackdrop />
      <BrowserRouter>
        <AuthProvider>
          <SavedWordsBootstrap />
          <StudyToolsLayer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/hsk/:level" element={<HSKLevel />} />
            <Route path="/vocabulary/:level" element={<VocabularyLevel />} />
            <Route path="/mock-exams" element={<MockExams />} />
            <Route path="/mock-exam/:examId" element={<MockExamPractice />} />
            <Route path="/saved-words" element={<SavedWords />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
