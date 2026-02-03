import { useResumeBuilder } from "@/hooks";
import { ResumeBuilderLayout } from "@/components/layout";
import "./App.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const resumeBuilderState = useResumeBuilder();
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={300}>
        <ResumeBuilderLayout state={resumeBuilderState} />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
