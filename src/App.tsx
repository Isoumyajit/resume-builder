import { Routes, Route } from "react-router-dom";
import { useResumeBuilder } from "@/hooks";
import { ResumeBuilderLayout } from "@/components/layout";
import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  ProtectedRoute,
  GuestRoute,
} from "@/components/auth";
import "./App.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";

function ResumeBuilder() {
  const resumeBuilderState = useResumeBuilder();
  return <ResumeBuilderLayout state={resumeBuilderState} />;
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ResumeBuilder />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
