/**
 * Central export for all interfaces in the Resume Builder application
 */

// Domain interfaces
export type {
  PersonalInfo,
  Experience,
  Education,
  Project,
  ProfileLinks,
  Skills,
  ResumeData,
} from "./domain";

// Component interfaces
export type {
  // Form components
  FormSectionProps,
  FormRowProps,
  FormFieldProps,
  PersonalInfoFormProps,
  ExperienceFormProps,
  EducationFormProps,
  DatePickerProps,
  ProjectsFormProps,
  ProfileLinksFormProps,
  SkillsFormProps,
  CheckboxFieldProps,
  // Layout components
  HeaderProps,
  SplitPaneProps,
  ResumeFormPanelProps,
  PreviewPanelProps,
  ResumeBuilderLayoutProps,
  ResumeBuilderState,
  // Preview components
  PdfPreviewProps,
} from "./components";

// API interfaces
export type { GeneratePdfResponse, ApiErrorInterface } from "./api";

// Hook interfaces
export type { ShortcutOptions } from "./hooks";
