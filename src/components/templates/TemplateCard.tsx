import { useState } from "react";
import { Check, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TemplateConfig } from "./templateConfig";

interface TemplateCardProps {
  template: TemplateConfig;
  onSelect: (id: string) => void;
  isSelected?: boolean;
}

export function TemplateCard({
  template,
  onSelect,
  isSelected,
}: TemplateCardProps) {
  const [enlarged, setEnlarged] = useState(false);
  const Preview = template.Preview;

  return (
    <>
      <div
        className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-indigo-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600"
        onClick={() => onSelect(template.id)}
        role="button"
        tabIndex={0}
        aria-label={`Select ${template.name} template`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(template.id);
          }
        }}
      >
        <div className="relative overflow-hidden rounded-t-lg border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-center py-3 px-3">
            <div className="overflow-hidden rounded shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
              <Preview />
            </div>
          </div>

          <button
            type="button"
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-gray-500 opacity-0 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-gray-900 group-hover:opacity-100 dark:bg-gray-800/90 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEnlarged(true);
            }}
            aria-label={`Enlarge ${template.name} preview`}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <div
            className={`absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition-opacity duration-200 dark:bg-indigo-500 ${
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Check className="h-3 w-3" />
          </div>
        </div>

        <div className="px-3 py-2.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {template.name}
          </h3>
        </div>
      </div>

      <Dialog open={enlarged} onOpenChange={setEnlarged}>
        <DialogContent className="max-w-[580px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
            <DialogTitle>{template.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center px-4 py-5">
            <div className="rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
              <Preview scale={1.7} />
            </div>
          </div>
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-950">
            <Button
              className="w-full cursor-pointer"
              onClick={() => {
                setEnlarged(false);
                onSelect(template.id);
              }}
            >
              Use {template.name}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
