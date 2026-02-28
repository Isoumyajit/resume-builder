/**
 * Component prop interfaces for Layout components
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import type { useResumeBuilder } from "@/hooks/useResumeBuilder";
import type { LucideIcon } from "lucide-react";

// Header component props
export interface HeaderProps {
  subtitle?: string;
  onDownload?: () => void;
  canDownload?: boolean;
  isGenerating?: boolean;
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
  achievementsArray: UseFieldArrayReturn<ResumeFormData, "achievements">;
  addExperience: () => void;
  addEducation: () => void;
  addProject: () => void;
  addAchievement: () => void;
  addBullet: (experienceIndex: number) => void;
  removeBullet: (experienceIndex: number, bulletIndex: number) => void;
  toggleCurrentlyWorking: (
    experienceIndex: number,
    isCurrentlyWorking: boolean,
  ) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  sectionOrder: string[];
  onReorderSections: (newOrder: string[]) => void;
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

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
}
