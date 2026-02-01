import { Header } from "./Header";
import { SplitPane } from "./SplitPane";
import { ResumeFormPanel } from "./ResumeFormPanel";
import { PreviewPanel } from "./PreviewPanel";
import type { ResumeBuilderLayoutProps } from "@/interfaces/components";

export function ResumeBuilderLayout({ state }: ResumeBuilderLayoutProps) {
  const { form, pdf, actions } = state;

  return (
    <div className="rb-app h-screen flex flex-col bg-gray-50">
      <Header
        onDownload={actions.downloadPdf}
        canDownload={!!pdf.url}
        isGenerating={pdf.isLoading}
      />

      <main className="rb-app__main flex-1 overflow-hidden">
        <SplitPane
          leftPanel={
            <ResumeFormPanel
              form={form.instance}
              experienceArray={form.experienceArray}
              educationArray={form.educationArray}
              projectsArray={form.projectsArray}
              addExperience={form.handlers.addExperience}
              addEducation={form.handlers.addEducation}
              addProject={form.handlers.addProject}
              addBullet={form.handlers.addBullet}
              removeBullet={form.handlers.removeBullet}
              toggleCurrentlyWorking={form.handlers.toggleCurrentlyWorking}
              onGenerate={actions.generatePdf}
              isGenerating={pdf.isLoading}
            />
          }
          rightPanel={
            <PreviewPanel
              pdfUrl={pdf.url}
              isLoading={pdf.isLoading}
              error={pdf.error}
            />
          }
        />
      </main>
    </div>
  );
}
