import type { UseFormReturn } from "react-hook-form";
import { FormSection, FormRow, InputIconField } from "./FormSection";
import type { ResumeFormData } from "@/lib/validation";
import { Link2, Linkedin, Mail, MapPin, Phone, User } from "lucide-react";

interface Props {
  form: UseFormReturn<ResumeFormData>;
}

export function PersonalInfoForm({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection title="Personal Information">
      <FormRow>
        <InputIconField
          label="Name"
          error={errors.personalInfo?.name?.message}
          icon={User}
          inputProps={{
            ...register("personalInfo.name"),
            placeholder: "John Doe",
          }}
        />
        <InputIconField
          label="Location"
          error={errors.personalInfo?.location?.message}
          icon={MapPin}
          inputProps={{
            ...register("personalInfo.location"),
            placeholder: "San Francisco, CA",
          }}
        />
      </FormRow>

      <FormRow>
        <InputIconField
          label="Phone"
          error={errors.personalInfo?.phone?.message}
          icon={Phone}
          inputProps={{
            ...register("personalInfo.phone"),
            placeholder: "+1 (555) 123-4567",
          }}
        />
        <InputIconField
          label="Email"
          error={errors.personalInfo?.email?.message}
          icon={Mail}
          inputProps={{
            ...register("personalInfo.email"),
            type: "email",
            placeholder: "john@example.com",
          }}
        />
      </FormRow>

      <FormRow>
        <InputIconField
          label="LinkedIn URL"
          error={errors.personalInfo?.linkedin?.url?.message}
          optional
          icon={Link2}
          inputProps={{
            ...register("personalInfo.linkedin.url"),
            placeholder: "https://linkedin.com/in/johndoe",
          }}
        />
        <InputIconField
          label="LinkedIn Display Text"
          error={errors.personalInfo?.linkedin?.displayText?.message}
          optional
          icon={Linkedin}
          inputProps={{
            ...register("personalInfo.linkedin.displayText"),
            placeholder: "john-doe",
          }}
        />
      </FormRow>
    </FormSection>
  );
}
