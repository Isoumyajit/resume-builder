import { useCallback } from "react";
import { useResumeForm } from "./useResumeForm";
import { usePdfGeneration } from "./usePdfGeneration";
import { useSaveShortcut } from "./useKeyboardShortcut";

/**
 * Main business logic hook for the Resume Builder application.
 * Combines form management, PDF generation, and keyboard shortcuts.
 */
export function useResumeBuilder() {
  // Form state and handlers
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
    toggleCurrentlyWorking,
  } = useResumeForm();

  // PDF generation state and handlers
  const { pdfUrl, isLoading, error, generate, downloadPdf } =
    usePdfGeneration();

  // Handle PDF generation from form data
  const handleGenerate = useCallback(() => {
    console.log("Generating PDF", form.formState.errors);
    form.handleSubmit((data) => generate(data))();
  }, [form, generate]);

  // Register keyboard shortcut (Ctrl+S)
  useSaveShortcut(handleGenerate);

  return {
    // Form props
    form: {
      instance: form,
      experienceArray,
      educationArray,
      projectsArray,
      handlers: {
        addExperience,
        addEducation,
        addProject,
        addBullet,
        removeBullet,
        toggleCurrentlyWorking,
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
