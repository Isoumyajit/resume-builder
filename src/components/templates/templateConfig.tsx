import type { ComponentType } from "react";
import { FileText, Palette } from "lucide-react";
import { ClassicPreview, ModernAccentPreview } from "./previews";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  Preview: ComponentType;
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
];
