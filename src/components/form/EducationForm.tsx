import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSection, FormRow, FormField } from "./FormSection";
import type { ResumeFormData } from "../../lib/validation";

interface Props {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "education">;
  onAddEducation: () => void;
}

export function EducationForm({ form, fieldArray, onAddEducation }: Props) {
  const { register, formState: { errors } } = form;
  const { fields, remove } = fieldArray;

  return (
    <FormSection
      title="Education"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddEducation}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No education added yet. Click "Add Education" to get started.
        </p>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium text-gray-600">
                    Education {index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <FormRow>
                <FormField
                  label="Institution"
                  error={errors.education?.[index]?.institution?.message}
                >
                  <Input
                    {...register(`education.${index}.institution`)}
                    placeholder="University of California, Berkeley"
                  />
                </FormField>
                <FormField
                  label="Degree"
                  error={errors.education?.[index]?.degree?.message}
                >
                  <Input
                    {...register(`education.${index}.degree`)}
                    placeholder="B.S. Computer Science (GPA: 3.8)"
                  />
                </FormField>
              </FormRow>

              <FormRow>
                <FormField
                  label="Location"
                  error={errors.education?.[index]?.location?.message}
                >
                  <Input
                    {...register(`education.${index}.location`)}
                    placeholder="Berkeley, CA"
                  />
                </FormField>
              </FormRow>

              <FormRow>
                <FormField
                  label="Start Year"
                  error={errors.education?.[index]?.startYear?.message}
                >
                  <Input
                    {...register(`education.${index}.startYear`)}
                    placeholder="2017"
                  />
                </FormField>
                <FormField
                  label="End Year"
                  error={errors.education?.[index]?.endYear?.message}
                >
                  <Input
                    {...register(`education.${index}.endYear`)}
                    placeholder="2021"
                  />
                </FormField>
              </FormRow>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
