import type { UseFormReturn } from "react-hook-form";
import { Github, Globe, Code2 } from "lucide-react";
import { Input } from "../ui/input";
import { FormSection, FormRow, FormField } from "./FormSection";
import type { ResumeFormData } from "@/lib/validation";

interface Props {
  form: UseFormReturn<ResumeFormData>;
}

export function ProfileLinksForm({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Profile Links">
      <div className="rb-profile-links-form">
        <FormRow columns={3}>
          <FormField
            label="GitHub"
            optional
            error={errors.profileLinks?.github?.message}
          >
            <div className="rb-profile-links-form__input-wrapper relative">
              <Input
                {...register("profileLinks.github")}
                placeholder="https://github.com/username"
                className="pl-9"
              />
              <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </FormField>

          <FormField
            label="LeetCode"
            optional
            error={errors.profileLinks?.leetcode?.message}
          >
            <div className="rb-profile-links-form__input-wrapper relative">
              <Input
                {...register("profileLinks.leetcode")}
                placeholder="https://leetcode.com/username"
                className="pl-9"
              />
              <Code2 className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </FormField>

          <FormField
            label="Portfolio"
            optional
            error={errors.profileLinks?.portfolio?.message}
          >
            <div className="rb-profile-links-form__input-wrapper relative">
              <Input
                {...register("profileLinks.portfolio")}
                placeholder="https://yourportfolio.com"
                className="pl-9"
              />
              <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </FormField>
        </FormRow>
      </div>
    </FormSection>
  );
}
