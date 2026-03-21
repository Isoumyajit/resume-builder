import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useResumeBuilder } from "@/hooks";
import { ResumeBuilderLayout } from "@/components/layout";
import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  LoggedOutPage,
  NotFoundPage,
  ProtectedRoute,
  GuestRoute,
  ErrorBoundary,
} from "@/components/auth";
import { LandingPage } from "@/components/landing/LandingPage";
import { TemplateSelectionPage } from "@/components/templates";
import "./App.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Footer from "./components/layout/Footer";

const TEMPLATE_STORAGE_KEY = "rb-template-id";

function ResumeBuilder() {
  const location = useLocation();
  const stateTemplateId = (location.state as { templateId?: string } | null)
    ?.templateId;

  const templateId =
    stateTemplateId ?? localStorage.getItem(TEMPLATE_STORAGE_KEY) ?? "classic";

  useEffect(() => {
    if (stateTemplateId) {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, stateTemplateId);
    }
  }, [stateTemplateId]);

  const resumeBuilderState = useResumeBuilder(templateId);
  return <ResumeBuilderLayout state={resumeBuilderState} />;
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <TooltipProvider delayDuration={300}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/logged-out" element={<LoggedOutPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/templates" element={<TemplateSelectionPage />} />
              <Route path="/build-resume" element={<ResumeBuilder />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TooltipProvider>
        <Footer />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
