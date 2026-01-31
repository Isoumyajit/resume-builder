import { useResumeForm, usePdfGeneration, useSaveShortcut } from "./hooks";
import { Header, SplitPane } from "./components/layout";
import {
  PersonalInfoForm,
  ExperienceForm,
  EducationForm,
  ProjectsForm,
  ProfileLinksForm,
  SkillsForm,
} from "./components/form";
import { PdfPreview } from "./components/preview";
import type { ResumeData } from "./types/resume";
import "./App.css";

function App() {
  const {
    form,
    experienceArray,
    educationArray,
    projectsArray,
    addExperience,
    addEducation,
    addProject,
    addBullet,
    removeBullet,
  } = useResumeForm();

  const { pdfUrl, isLoading, error, generate, downloadPdf } = usePdfGeneration();

  // Handle form submission (Ctrl+S or button click)
  const handleGenerate = () => {
    form.handleSubmit((data) => {
      // Transform form data to match API expectations
      const resumeData: ResumeData = {
        personalInfo: data.personalInfo,
        experience: data.experience,
        education: data.education,
        projects: data.projects,
        profileLinks: data.profileLinks,
        skills: data.skills,
      };
      generate(resumeData);
    })();
  };

  // Register Ctrl+S shortcut
  useSaveShortcut(handleGenerate);

  // Left panel: Form
  const formPanel = (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PersonalInfoForm form={form} />
      
      <ExperienceForm
        form={form}
        fieldArray={experienceArray}
        onAddExperience={addExperience}
        onAddBullet={addBullet}
        onRemoveBullet={removeBullet}
      />
      
      <EducationForm
        form={form}
        fieldArray={educationArray}
        onAddEducation={addEducation}
      />
      
      <ProjectsForm
        form={form}
        fieldArray={projectsArray}
        onAddProject={addProject}
      />
      
      <ProfileLinksForm form={form} />
      
      <SkillsForm form={form} />

      {/* Mobile: Generate button (visible on small screens) */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );

  // Right panel: PDF Preview
  const previewPanel = (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <PdfPreview pdfUrl={pdfUrl} isLoading={isLoading} error={error} />
      </div>
      
      {/* Hint text */}
      <div className="text-center text-sm text-gray-500 mt-4 hidden md:block">
        Press{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">
          Ctrl
        </kbd>
        {" + "}
        <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">
          S
        </kbd>
        {" "}to generate PDF
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onDownload={downloadPdf}
        canDownload={!!pdfUrl}
        isGenerating={isLoading}
      />
      
      <main className="flex-1 overflow-hidden">
        <SplitPane leftPanel={formPanel} rightPanel={previewPanel} />
      </main>
    </div>
  );
}

export default App;
