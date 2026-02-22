import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { FormSection, FormField } from "./FormSection";
import type { AchievementsFormProps } from "@/interfaces/components";
import { Textarea } from "../ui/textarea";

export function AchievementsForm({
  form,
  fieldArray,
  onAddAchievement,
  dragHandleRef,
}: AchievementsFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const { fields, remove } = fieldArray;

  // Helper to count characters without spaces
  const getCharCountWithoutSpaces = (text: string) => {
    return text?.replace(/\s/g, "").length || 0;
  };

  return (
    <FormSection
      title="Achievements"
      dragHandleRef={dragHandleRef}
      action={
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onAddAchievement}
          className="gap-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No achievements added yet. Click "Add Achievement" to highlight your
          accomplishments.
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const bulletValue = watch(`achievements.${index}.bullet`) || "";
            const charCount = getCharCountWithoutSpaces(bulletValue);
            const isOverLimit = charCount > 100;

            return (
              <div
                key={field.id}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <div className="flex-1 space-y-1">
                  <FormField
                    label=""
                    error={errors.achievements?.[index]?.bullet?.message}
                  >
                    <Textarea
                      {...register(`achievements.${index}.bullet`)}
                      placeholder="Codeforces rating 2200"
                      className="min-h-[60px] resize-none"
                      maxLength={100}
                    />
                  </FormField>
                  <div
                    className={`text-xs ${
                      isOverLimit ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {charCount}/100
                  </div>
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
            );
          })}
        </div>
      )}
    </FormSection>
  );
}
