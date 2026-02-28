import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TemplateConfig } from "./templateConfig";

interface TemplateCardProps {
  template: TemplateConfig;
  onSelect: (id: string) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const Icon = template.icon;
  const Preview = template.Preview;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700"
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-indigo-500">
            <Check className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="mt-1">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Preview />
        </div>
        <Button
          className="mt-4 w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template.id);
          }}
        >
          Use {template.name}
        </Button>
      </CardContent>
    </Card>
  );
}
