import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FormSection, FormRow, FormField } from "./FormSection";
import type { ResumeFormData } from "@/lib/validation";

interface Props {
  form: UseFormReturn<ResumeFormData>;
  fieldArray: UseFieldArrayReturn<ResumeFormData, "experience">;
  onAddExperience: () => void;
  onAddBullet: (index: number) => void;
  onRemoveBullet: (experienceIndex: number, bulletIndex: number) => void;
}

export function ExperienceForm({
  form,
  fieldArray,
  onAddExperience,
  onAddBullet,
  onRemoveBullet,
}: Props) {
  const { register, formState: { errors }, watch } = form;
  const { fields, remove } = fieldArray;

  return (
    <FormSection
      title="Work Experience"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddExperience}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="rb-experience-form__empty-state text-center text-gray-500 py-4">
          No experience added yet. Click "Add Experience" to get started.
        </p>
      ) : (
        <div className="rb-experience-form__list space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rb-experience-form__item rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
            >
              <div className="rb-experience-form__item-header flex items-center justify-between">
                <div className="rb-experience-form__item-label flex items-center gap-2 text-gray-400">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium text-gray-600">
                    Experience {index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="rb-experience-form__item-remove text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <FormRow>
                <FormField
                  label="Job Title"
                  error={errors.experience?.[index]?.title?.message}
                >
                  <Input
                    {...register(`experience.${index}.title`)}
                    placeholder="Software Engineer"
                  />
                </FormField>
                <FormField
                  label="Company"
                  error={errors.experience?.[index]?.company?.message}
                >
                  <Input
                    {...register(`experience.${index}.company`)}
                    placeholder="Acme Inc."
                  />
                </FormField>
              </FormRow>

              <FormRow>
                <FormField
                  label="Location"
                  error={errors.experience?.[index]?.location?.message}
                >
                  <Input
                    {...register(`experience.${index}.location`)}
                    placeholder="San Francisco, CA"
                  />
                </FormField>
                <FormField
                  label="Tech Stack"
                  optional
                  error={errors.experience?.[index]?.techStack?.message}
                >
                  <Input
                    {...register(`experience.${index}.techStack`)}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </FormField>
              </FormRow>

              <FormRow>
                <FormField
                  label="Start Date"
                  error={errors.experience?.[index]?.startDate?.message}
                >
                  <Input
                    {...register(`experience.${index}.startDate`)}
                    placeholder="Jan 2022"
                  />
                </FormField>
                <FormField
                  label="End Date"
                  error={errors.experience?.[index]?.endDate?.message}
                >
                  <Input
                    {...register(`experience.${index}.endDate`)}
                    placeholder="Present"
                  />
                </FormField>
              </FormRow>

              {/* Bullet Points */}
              <div className="rb-experience-form__bullets space-y-2">
                <div className="rb-experience-form__bullets-header flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Achievements / Responsibilities
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddBullet(index)}
                    className="rb-experience-form__add-bullet gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3" />
                    Add Bullet
                  </Button>
                </div>
                
                {watch(`experience.${index}.bullets`)?.map((_, bulletIndex) => (
                  <div key={bulletIndex} className="rb-experience-form__bullet-item flex items-start gap-2">
                    <span className="mt-2.5 text-gray-400">•</span>
                    <Textarea
                      {...register(`experience.${index}.bullets.${bulletIndex}`)}
                      placeholder="Describe your achievement or responsibility..."
                      className="rb-experience-form__bullet-textarea min-h-[60px] resize-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveBullet(index, bulletIndex)}
                      className="rb-experience-form__bullet-remove mt-1 text-gray-400 hover:text-red-500"
                      disabled={watch(`experience.${index}.bullets`)?.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
