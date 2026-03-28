import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Palette, ChevronDown, Check } from "lucide-react";

interface AccentColorPickerProps {
  form: UseFormReturn<ResumeFormData>;
}

const PRESET_COLORS = [
  { value: "#1E3A5F", label: "Navy" },
  { value: "#0F5132", label: "Forest" },
  { value: "#5B2C6F", label: "Plum" },
  { value: "#7B341E", label: "Mahogany" },
  { value: "#1A5276", label: "Steel" },
] as const;

export function AccentColorPicker({ form }: AccentColorPickerProps) {
  const selected = form.watch("accentColor") ?? "";

  const handleSelect = useCallback(
    (color: string) => {
      const next = selected === color ? "" : color;
      form.setValue("accentColor", next, { shouldDirty: true });
    },
    [form, selected],
  );

  return (
    <div data-testid="accent-color-picker">
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300 cursor-pointer">
          <Palette className="h-4 w-4" />
          Accent Color
          <span className="ml-auto text-xs text-gray-400">(optional)</span>
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            {PRESET_COLORS.map(({ value, label }) => {
              const isActive = selected === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${label}${isActive ? " (selected)" : ""}`}
                  onClick={() => handleSelect(value)}
                  className="relative h-8 w-8 shrink-0 rounded-full border-2 transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: value,
                    borderColor: isActive ? value : "transparent",
                    boxShadow: isActive
                      ? `0 0 0 2px white, 0 0 0 4px ${value}`
                      : undefined,
                  }}
                  data-testid={`color-swatch-${label.toLowerCase()}`}
                >
                  {isActive && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
