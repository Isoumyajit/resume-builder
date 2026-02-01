import { useResumeBuilder } from "@/hooks";
import { ResumeBuilderLayout } from "@/components/layout";
import "./App.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  const resumeBuilderState = useResumeBuilder();
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ResumeBuilderLayout state={resumeBuilderState} />
    </ThemeProvider>
  );
}

export default App;
