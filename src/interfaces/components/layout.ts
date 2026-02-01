/**
 * Component prop interfaces for Layout components
 */

import type { ReactNode } from "react";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import type { useResumeBuilder } from "@/hooks/useResumeBuilder";

// Header component props
export interface HeaderProps {
  onDownload: () => void;
  canDownload: boolean;
  isGenerating: boolean;
}

// SplitPane component props
export interface SplitPaneProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftSize?: number;
  minLeftSize?: number;
  minRightSize?: number;
}

// ResumeFormPanel component props
export interface ResumeFormPanelProps {
  form: UseFormReturn<ResumeFormData>;
  experienceArray: UseFieldArrayReturn<ResumeFormData, "experience">;
  educationArray: UseFieldArrayReturn<ResumeFormData, "education">;
  projectsArray: UseFieldArrayReturn<ResumeFormData, "projects">;
  addExperience: () => void;
  addEducation: () => void;
  addProject: () => void;
  addBullet: (experienceIndex: number) => void;
  removeBullet: (experienceIndex: number, bulletIndex: number) => void;
  toggleCurrentlyWorking: (
    experienceIndex: number,
    isCurrentlyWorking: boolean,
  ) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

// PreviewPanel component props
export interface PreviewPanelProps {
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

// ResumeBuilderLayout component props
export type ResumeBuilderState = ReturnType<typeof useResumeBuilder>;

export interface ResumeBuilderLayoutProps {
  state: ResumeBuilderState;
}
