/**
 * Component prop interfaces for Form components
 */

import type { ComponentProps, ReactNode } from "react";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import type { LucideIcon } from "lucide-react";
import type { InputGroupInput } from "@/components/ui/input-group";

// FormSection component props
export interface FormSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

// FormRow component props
export interface FormRowProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  orientation?: "vertical" | "horizontal";
}

export interface FormGroupFieldProps {
  labels: string[];
  inputs: ReactNode[];
  optional?: boolean;
  errors?: string[];
}

// FormField component props
export interface FormFieldProps {
  label: string;
  error?: string;
  children?: ReactNode;
  optional?: boolean;
}

// PersonalInfoForm component props
export interface PersonalInfoFormProps {
  form: UseFormReturn<ResumeFormData>;
}

// ExperienceForm component props
export interface ExperienceFormProps {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "experience">;
  onAddExperience: () => void;
  onAddBullet: (experienceIndex: number) => void;
  onRemoveBullet: (experienceIndex: number, bulletIndex: number) => void;
  onToggleCurrentlyWorking: (
    experienceIndex: number,
    isCurrentlyWorking: boolean,
  ) => void;
}

// EducationForm component props
export interface EducationFormProps {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "education">;
  onAddEducation: () => void;
}

// ProjectsForm component props
export interface ProjectsFormProps {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "projects">;
  onAddProject: () => void;
}

// ProfileLinksForm component props
export interface ProfileLinksFormProps {
  form: UseFormReturn<ResumeFormData>;
}

// SkillsForm component props
export interface SkillsFormProps {
  form: UseFormReturn<ResumeFormData>;
}

// AchievementsForm component props
export interface AchievementsFormProps {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "achievements">;
  onAddAchievement: () => void;
}

// Props for InputIconField
export interface InputIconFieldProps extends Omit<FormFieldProps, "children"> {
  icon: LucideIcon;
  align?: "inline-start" | "inline-end";
  inputProps: ComponentProps<typeof InputGroupInput>;
}

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  alignIcon?: "inline-start" | "inline-end";
  icon?: LucideIcon;
}

export interface CheckboxFieldProps {
  label: string;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}
