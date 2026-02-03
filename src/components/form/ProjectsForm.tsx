import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  FolderOpen,
  Code,
  Sparkles,
} from "lucide-react";
import { LoadingDots } from "../ui/loading-dots";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FormSection, FormRow, FormField, InputIconField } from "./FormSection";
import type { ProjectsFormProps } from "@/interfaces/components";
import { Skeleton } from "../ui/skeleton";
import { useAiService } from "@/hooks";

export function ProjectsForm({
  form,
  fieldArray,
  onAddProject,
}: ProjectsFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = form;
  const { fields, remove } = fieldArray;
  const { generateDescription, isGenerating } = useAiService({
    setValue,
  });
  return (
    <FormSection
      title="Projects"
      action={
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onAddProject}
          className="gap-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No projects added yet. Click "Add Project" to showcase your work.
        </p>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border bg-muted/30 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Project {index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <FormRow>
                <InputIconField
                  label="Project Name"
                  error={errors.projects?.[index]?.name?.message}
                  icon={FolderOpen}
                  inputProps={{
                    ...register(`projects.${index}.name`),
                    placeholder: "E-commerce Platform",
                  }}
                />
                <InputIconField
                  label="Project URL"
                  optional
                  error={errors.projects?.[index]?.url?.message}
                  icon={ExternalLink}
                  align="inline-end"
                  inputProps={{
                    ...register(`projects.${index}.url`),
                    placeholder: "https://github.com/user/project",
                  }}
                />
              </FormRow>

              <InputIconField
                label="Tech Stack"
                error={errors.projects?.[index]?.techStack?.message}
                icon={Code}
                inputProps={{
                  ...register(`projects.${index}.techStack`),
                  placeholder: "React, Node.js, MongoDB, Stripe",
                }}
              />

              <FormField
                label="Description"
                error={errors.projects?.[index]?.description?.message}
                action={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      generateDescription({
                        index,
                        projectName: form.watch(`projects.${index}.name`),
                        techStack: form.watch(`projects.${index}.techStack`),
                        url: form.watch(`projects.${index}.url`),
                      })
                    }
                    className="text-primary hover:text-primary cursor-pointer self-end mt-1"
                    disabled={
                      isGenerating.includes(index as never) ||
                      form.watch(`projects.${index}.name`).length === 0 ||
                      form.watch(`projects.${index}.techStack`).length === 0
                    }
                    title="Generate with AI"
                  >
                    {isGenerating.includes(index as never) ? (
                      <LoadingDots />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate with AI</span>
                      </div>
                    )}
                  </Button>
                }
              >
                {isGenerating.includes(index as never) ? (
                  <Skeleton className="h-[80px]" />
                ) : (
                  <Textarea
                    {...register(`projects.${index}.description`)}
                    placeholder="Brief description of the project and your contributions..."
                    className="min-h-[80px] whitespace-pre-wrap"
                  />
                )}
              </FormField>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
