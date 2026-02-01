import { useResumeBuilder } from "@/hooks";
import { ResumeBuilderLayout } from "@/components/layout";
import "./App.css";

function App() {
  const resumeBuilderState = useResumeBuilder();
  return <ResumeBuilderLayout state={resumeBuilderState} />;
}

export default App;
