import {
  Plus,
  Trash2,
  GripVertical,
  GraduationCap,
  Award,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "../ui/button";
import { FormSection, FormRow, InputIconField } from "./FormSection";
import type { EducationFormProps } from "@/interfaces/components";

export function EducationForm({
  form,
  fieldArray,
  onAddEducation,
}: EducationFormProps) {
  const {
    register,
    formState: { errors },
  } = form;
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
          className="gap-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No education added yet. Click "Add Education" to get started.
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
                    Education {index + 1}
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
                  label="Institution"
                  error={errors.education?.[index]?.institution?.message}
                  icon={GraduationCap}
                  inputProps={{
                    ...register(`education.${index}.institution`),
                    placeholder: "University of California, Berkeley",
                  }}
                />
                <InputIconField
                  label="Degree"
                  error={errors.education?.[index]?.degree?.message}
                  icon={Award}
                  inputProps={{
                    ...register(`education.${index}.degree`),
                    placeholder: "B.S. Computer Science (GPA: 3.8)",
                  }}
                />
              </FormRow>

              <FormRow>
                <InputIconField
                  label="Location"
                  error={errors.education?.[index]?.location?.message}
                  icon={MapPin}
                  inputProps={{
                    ...register(`education.${index}.location`),
                    placeholder: "Berkeley, CA",
                  }}
                />
              </FormRow>

              <FormRow>
                <InputIconField
                  label="Start Year"
                  error={errors.education?.[index]?.startYear?.message}
                  icon={Calendar}
                  inputProps={{
                    ...register(`education.${index}.startYear`),
                    placeholder: "2017",
                  }}
                />
                <InputIconField
                  label="End Year"
                  error={errors.education?.[index]?.endYear?.message}
                  icon={Calendar}
                  inputProps={{
                    ...register(`education.${index}.endYear`),
                    placeholder: "2021",
                  }}
                />
              </FormRow>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
