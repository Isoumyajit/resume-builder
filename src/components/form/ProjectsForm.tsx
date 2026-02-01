import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FormSection, FormRow, FormField } from "./FormSection";
import type { ResumeFormData } from "@/lib/validation";

interface Props {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "projects">;
  onAddProject: () => void;
}

export function ProjectsForm({ form, fieldArray, onAddProject }: Props) {
  const { register, formState: { errors } } = form;
  const { fields, remove } = fieldArray;

  return (
    <FormSection
      title="Projects"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddProject}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="rb-projects-form__empty-state text-center text-gray-500 py-4">
          No projects added yet. Click "Add Project" to showcase your work.
        </p>
      ) : (
        <div className="rb-projects-form__list space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rb-projects-form__item rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
            >
              <div className="rb-projects-form__item-header flex items-center justify-between">
                <div className="rb-projects-form__item-label flex items-center gap-2 text-gray-400">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium text-gray-600">
                    Project {index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="rb-projects-form__item-remove text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <FormRow>
                <FormField
                  label="Project Name"
                  error={errors.projects?.[index]?.name?.message}
                >
                  <Input
                    {...register(`projects.${index}.name`)}
                    placeholder="E-commerce Platform"
                  />
                </FormField>
                <FormField
                  label="Project URL"
                  optional
                  error={errors.projects?.[index]?.url?.message}
                >
                  <div className="rb-projects-form__url-wrapper relative">
                    <Input
                      {...register(`projects.${index}.url`)}
                      placeholder="https://github.com/user/project"
                      className="pr-8"
                    />
                    <ExternalLink className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormField>
              </FormRow>

              <FormField
                label="Tech Stack"
                error={errors.projects?.[index]?.techStack?.message}
              >
                <Input
                  {...register(`projects.${index}.techStack`)}
                  placeholder="React, Node.js, MongoDB, Stripe"
                />
              </FormField>

              <FormField
                label="Description"
                error={errors.projects?.[index]?.description?.message}
              >
                <Textarea
                  {...register(`projects.${index}.description`)}
                  placeholder="Brief description of the project and your contributions..."
                  className="rb-projects-form__description min-h-[80px]"
                />
              </FormField>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
