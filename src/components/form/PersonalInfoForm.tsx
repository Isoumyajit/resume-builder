import type { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { FormSection, FormRow, FormField } from "./FormSection";

interface Props {
  form: UseFormReturn<ResumeFormData>;
}

export function PersonalInfoForm({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Personal Information">
      <FormRow>
        <FormField 
          label="Full Name" 
          error={errors.personalInfo?.name?.message}
        >
          <Input
            {...register("personalInfo.name")}
            placeholder="John Doe"
          />
        </FormField>
        <FormField 
          label="Location"
          error={errors.personalInfo?.location?.message}
        >
          <Input
            {...register("personalInfo.location")}
            placeholder="San Francisco, CA"
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField 
          label="Phone"
          error={errors.personalInfo?.phone?.message}
        >
          <Input
            {...register("personalInfo.phone")}
            placeholder="+1 (555) 123-4567"
          />
        </FormField>
        <FormField 
          label="Email"
          error={errors.personalInfo?.email?.message}
        >
          <Input
            type="email"
            {...register("personalInfo.email")}
            placeholder="john@example.com"
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField 
          label="LinkedIn URL" 
          optional
          error={errors.personalInfo?.linkedin?.url?.message}
        >
          <Input
            {...register("personalInfo.linkedin.url")}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </FormField>
        <FormField 
          label="LinkedIn Display Text" 
          optional
          error={errors.personalInfo?.linkedin?.displayText?.message}
        >
          <Input
            {...register("personalInfo.linkedin.displayText")}
            placeholder="johndoe"
          />
        </FormField>
      </FormRow>
    </FormSection>
  );
}
