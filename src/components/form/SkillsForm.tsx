import type { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { FormSection, FormField } from "./FormSection";
import type { ResumeFormData } from "@/lib/validation";

interface Props {
  form: UseFormReturn<ResumeFormData>;
}

export function SkillsForm({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Technical Skills">
      <div className="rb-skills-form">
        <FormField
          label="Programming Languages"
          optional
          error={errors.skills?.languages?.message}
        >
          <Textarea
            {...register("skills.languages")}
            placeholder="JavaScript, TypeScript, Python, Java, C++"
            className="rb-skills-form__textarea min-h-[60px] resize-none"
          />
        </FormField>

        <FormField
          label="Technologies / Frameworks / Libraries"
          optional
          error={errors.skills?.technologies?.message}
        >
          <Textarea
            {...register("skills.technologies")}
            placeholder="React, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS, Git"
            className="rb-skills-form__textarea min-h-[60px] resize-none"
          />
        </FormField>

        <FormField
          label="Other Skills"
          optional
          error={errors.skills?.other?.message}
        >
          <Textarea
            {...register("skills.other")}
            placeholder="Data Structures & Algorithms, System Design, Agile/Scrum"
            className="rb-skills-form__textarea min-h-[60px] resize-none"
          />
        </FormField>
      </div>
    </FormSection>
  );
}
