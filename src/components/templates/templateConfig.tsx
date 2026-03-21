import type { ComponentType } from "react";
import { Briefcase, FileText, Palette } from "lucide-react";
import {
  ClassicPreview,
  ExecutivePreview,
  ModernAccentPreview,
} from "./previews";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  Preview: ComponentType<{ scale?: number }>;
}

export const templates: TemplateConfig[] = [
  {
    id: "classic",
    name: "Classic",
    description:
      "Left aligned layout with Montserrat typography and balanced spacing",
    icon: FileText,
    Preview: ClassicPreview,
  },
  {
    id: "modern-accent",
    name: "Modern Accent",
    description:
      "Bold accent colors with modern typography and left-aligned sections",
    icon: Palette,
    Preview: ModernAccentPreview,
  },
  {
    id: "executive",
    name: "Executive",
    description:
      "Centered section titles with teal accents and professional styling",
    icon: Briefcase,
    Preview: ExecutivePreview,
  },
];
