import {
  Plus,
  Trash2,
  GripVertical,
  Briefcase,
  Building,
  MapPin,
  Code,
  Calendar,
  CircleSmall,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  FormSection,
  FormRow,
  InputIconField,
  DateIconField,
  CheckboxField,
} from "./FormSection";
import type { ExperienceFormProps } from "@/interfaces/components";

export function ExperienceForm({
  form,
  fieldArray,
  onAddExperience,
  onAddBullet,
  onRemoveBullet,
  onToggleCurrentlyWorking,
}: ExperienceFormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;
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
          className="gap-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No experience added yet. Click "Add Experience" to get started.
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
                    Experience {index + 1}
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
                  label="Job Title"
                  error={errors.experience?.[index]?.title?.message}
                  icon={Briefcase}
                  inputProps={{
                    ...register(`experience.${index}.title`),
                    placeholder: "Software Engineer",
                  }}
                />
                <InputIconField
                  label="Company"
                  error={errors.experience?.[index]?.company?.message}
                  icon={Building}
                  inputProps={{
                    ...register(`experience.${index}.company`),
                    placeholder: "Acme Inc.",
                  }}
                />
              </FormRow>

              <FormRow>
                <InputIconField
                  label="Location"
                  error={errors.experience?.[index]?.location?.message}
                  icon={MapPin}
                  inputProps={{
                    ...register(`experience.${index}.location`),
                    placeholder: "San Francisco, CA",
                  }}
                />
                <InputIconField
                  label="Tech Stack"
                  optional
                  error={errors.experience?.[index]?.techStack?.message}
                  icon={Code}
                  inputProps={{
                    ...register(`experience.${index}.techStack`),
                    placeholder: "React, Node.js, PostgreSQL",
                  }}
                />
              </FormRow>

              <FormRow>
                <CheckboxField
                  label="Currently Working Here"
                  checked={watch(`experience.${index}.currentlyWorking`)}
                  onCheckedChange={(checked: boolean) =>
                    onToggleCurrentlyWorking(index, checked)
                  }
                />
              </FormRow>

              <FormRow>
                <DateIconField
                  label="Start Date"
                  error={errors.experience?.[index]?.startDate?.message}
                  icon={Calendar}
                  align="inline-start"
                  dateProps={{
                    value: watch(`experience.${index}.startDate`),
                    onChange: (value) =>
                      form.setValue(`experience.${index}.startDate`, value),
                    placeholder: "Jan 2022",
                  }}
                />
                <DateIconField
                  label="End Date"
                  error={errors.experience?.[index]?.endDate?.message}
                  icon={Calendar}
                  align="inline-end"
                  dateProps={{
                    value: watch(`experience.${index}.endDate`),
                    onChange: (value) =>
                      form.setValue(`experience.${index}.endDate`, value),
                    placeholder: watch(`experience.${index}.currentlyWorking`)
                      ? "Present"
                      : "Jan 2026",
                    disabled: watch(`experience.${index}.currentlyWorking`),
                  }}
                />
              </FormRow>

              {/* Bullet Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Achievements / Responsibilities
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddBullet(index)}
                    className="gap-1 text-primary hover:text-primary cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Bullet
                  </Button>
                </div>

                {watch(`experience.${index}.bullets`)?.map((_, bulletIndex) => (
                  <div key={bulletIndex} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="mt-2.5 text-muted-foreground">
                        <CircleSmall />
                      </span>
                      <div className="flex items-center gap-2 min-w-[calc(100%-20px)]">
                        <Textarea
                          {...register(
                            `experience.${index}.bullets.${bulletIndex}`,
                          )}
                          placeholder="Describe your achievement or responsibility..."
                          className="min-h-[60px] resize-none"
                          maxLength={300}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveBullet(index, bulletIndex)}
                          className="mt-1 text-muted-foreground hover:text-destructive cursor-pointer"
                          disabled={
                            watch(`experience.${index}.bullets`)?.length === 1
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground self-end mr-10">
                      {`${form.watch(`experience.${index}.bullets.${bulletIndex}`).length}/300`}{" "}
                    </span>
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
