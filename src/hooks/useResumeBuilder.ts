import { useCallback } from "react";
import { useResumeForm } from "./useResumeForm";
import { usePdfGeneration } from "./usePdfGeneration";
import { useSaveShortcut } from "./useKeyboardShortcut";
import { useTemplate } from "@/contexts/TemplateContext";

/**
 * Main business logic hook for the Resume Builder application.
 * Combines form management, PDF generation, and keyboard shortcuts.
 */
export function useResumeBuilder() {
  const { templateId } = useTemplate();

  const {
    form,
    experienceArray,
    educationArray,
    projectsArray,
    achievementsArray,
    addExperience,
    addEducation,
    addProject,
    addAchievement,
    addBullet,
    removeBullet,
    toggleCurrentlyWorking,
    sectionOrder,
    reorderSections,
    autoSaveStatus,
  } = useResumeForm();

  const { pdfUrl, isLoading, error, generate, downloadPdf } =
    usePdfGeneration();

  const handleGenerate = useCallback(() => {
    form.handleSubmit((data) => generate(data, templateId))();
  }, [form, generate, templateId]);

  useSaveShortcut(handleGenerate);

  return {
    form: {
      instance: form,
      experienceArray,
      educationArray,
      projectsArray,
      achievementsArray,
      sectionOrder,
      handlers: {
        addExperience,
        addEducation,
        addProject,
        addAchievement,
        addBullet,
        removeBullet,
        toggleCurrentlyWorking,
        reorderSections,
      },
    },
    pdf: {
      url: pdfUrl,
      isLoading,
      error,
    },
    actions: {
      generatePdf: handleGenerate,
      downloadPdf,
    },
    templateId,
    autoSaveStatus,
  };
}
