import { useState } from "react";
import { Sparkles, Briefcase, Clock, Code } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { LoadingDots } from "../ui/loading-dots";
import { Skeleton } from "../ui/skeleton";
import { FormSection, FormField } from "./FormSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Field, FieldLabel, FieldContent } from "../ui/field";
import type { SummaryFormProps } from "@/interfaces/components";
import { useAiService } from "@/hooks";

export function SummaryForm({ form, dragHandleRef }: SummaryFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { generateSummary, isGeneratingSummary } = useAiService({
    setValue: form.setValue,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [keySkills, setKeySkills] = useState("");

  const canGenerate =
    jobTitle.trim().length > 0 && yearsOfExperience.trim().length > 0;

  const handleGenerate = () => {
    generateSummary({ jobTitle, yearsOfExperience, keySkills });
    setDialogOpen(false);
  };

  return (
    <>
      <FormSection title="Professional Summary" dragHandleRef={dragHandleRef}>
        <div className="rb-summary-form -mt-1">
          <FormField
            label="A brief overview of your profile"
            optional
            error={errors.summary?.text?.message}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="text-primary hover:text-primary cursor-pointer self-end mt-1"
              >
                {isGeneratingSummary ? (
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
            {isGeneratingSummary ? (
              <Skeleton className="h-[60px]" />
            ) : (
              <Textarea
                {...register("summary.text")}
                placeholder="Experienced software engineer with 5+ years of expertise in building scalable web applications..."
                className="rb-summary-form__textarea min-h-[60px] resize-none text-sm"
                maxLength={400}
              />
            )}
          </FormField>
        </div>
      </FormSection>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Summary with AI</DialogTitle>
            <DialogDescription>
              Provide a few details and we'll craft a professional summary for
              your resume.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <Field>
              <FieldLabel>Job Title</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Briefcase className="text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior Software Engineer"
                  />
                </InputGroup>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Years of Experience</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Clock className="text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="5"
                  />
                </InputGroup>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                Key Skills
                <span className="text-muted-foreground ml-1 font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Code className="text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={keySkills}
                    onChange={(e) => setKeySkills(e.target.value)}
                    placeholder="React, Node.js, System Design"
                  />
                </InputGroup>
              </FieldContent>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
