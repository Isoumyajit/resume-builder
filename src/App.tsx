import { Routes, Route, useLocation } from "react-router-dom";
import { useResumeBuilder } from "@/hooks";
import { ResumeBuilderLayout } from "@/components/layout";
import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  ProtectedRoute,
  GuestRoute,
} from "@/components/auth";
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

  if (stateTemplateId) {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, stateTemplateId);
  }

  const resumeBuilderState = useResumeBuilder(templateId);
  return <ResumeBuilderLayout state={resumeBuilderState} />;
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/templates" element={<TemplateSelectionPage />} />
            <Route path="/build-resume" element={<ResumeBuilder />} />
          </Route>
        </Routes>
      </TooltipProvider>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
