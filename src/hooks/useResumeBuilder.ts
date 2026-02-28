import { useCallback } from "react";
import { useResumeForm } from "./useResumeForm";
import { usePdfGeneration } from "./usePdfGeneration";
import { useSaveShortcut } from "./useKeyboardShortcut";

/**
 * Main business logic hook for the Resume Builder application.
 * Combines form management, PDF generation, and keyboard shortcuts.
 */
export function useResumeBuilder(templateId: string = "classic") {
  // Form state and handlers
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
  } = useResumeForm();

  // PDF generation state and handlers
  const { pdfUrl, isLoading, error, generate, downloadPdf } =
    usePdfGeneration();

  // Handle PDF generation from form data
  const handleGenerate = useCallback(() => {
    form.handleSubmit((data) => generate(data, templateId))();
  }, [form, generate, templateId]);

  // Register keyboard shortcut (Ctrl+S)
  useSaveShortcut(handleGenerate);

  return {
    // Form props
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
    // PDF props
    pdf: {
      url: pdfUrl,
      isLoading,
      error,
    },
    // Actions
    actions: {
      generatePdf: handleGenerate,
      downloadPdf,
    },
  };
}
