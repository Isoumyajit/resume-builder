import type {
  FormSectionProps,
  FormRowProps,
  FormFieldProps,
  CheckboxFieldProps,
} from "@/interfaces/components";
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DatePicker } from "@/components/ui/datepicker";
import { Checkbox } from "@/components/ui/checkbox";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

export function FormSection({ title, children, action }: FormSectionProps) {
  return (
    <FieldSet className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-6 pb-0">
        <FieldLegend className="text-lg font-semibold">{title}</FieldLegend>
        {action && <div className="flex items-center">{action}</div>}
      </div>
      <Separator />
      <div className="p-6 pt-0">
        <FieldGroup className="gap-4">{children}</FieldGroup>
      </div>
    </FieldSet>
  );
}

export function FormRow({ children, columns = 2 }: FormRowProps) {
  return (
    <FieldGroup
      className={`@container/field-group ${
        columns === 3
          ? "grid grid-cols-1 md:grid-cols-3 gap-4"
          : columns === 2
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : ""
      }`}
    >
      {children}
    </FieldGroup>
  );
}

export function FormField({
  label,
  error,
  children,
  optional,
}: FormFieldProps) {
  return (
    <Field className="w-full my-2">
      <FieldLabel>
        {label}
        {optional && (
          <span className="text-muted-foreground ml-1 font-normal">
            (optional)
          </span>
        )}
      </FieldLabel>
      <FieldContent>
        {children}
        <FieldError errors={error ? [{ message: error }] : []} />
      </FieldContent>
    </Field>
  );
}

// Component for fields with icons - same as FormField
export function IconField(props: FormFieldProps) {
  return <FormField {...props} />;
}

// Props for InputIconField
interface InputIconFieldProps extends Omit<FormFieldProps, "children"> {
  icon: LucideIcon;
  align?: "inline-start" | "inline-end";
  inputProps: ComponentProps<typeof InputGroupInput>;
}

// Component that handles InputGroup structure internally
export function InputIconField({
  label,
  error,
  optional,
  icon: Icon,
  align = "inline-start",
  inputProps,
}: InputIconFieldProps) {
  return (
    <Field>
      <FieldLabel>
        {label}
        {optional && (
          <span className="text-muted-foreground ml-1 font-normal">
            (optional)
          </span>
        )}
      </FieldLabel>
      <FieldContent>
        <InputGroup>
          <InputGroupAddon align={align}>
            <Icon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput {...inputProps} />
        </InputGroup>
        <FieldError errors={error ? [{ message: error }] : []} />
      </FieldContent>
    </Field>
  );
}

// Props for DateIconField
interface DateIconFieldProps extends Omit<FormFieldProps, "children"> {
  icon: LucideIcon;
  align?: "inline-start" | "inline-end";
  dateProps: {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
  };
}

// Component for date fields with icons (DatePicker already handles InputGroup internally)
export function DateIconField({
  label,
  error,
  optional,
  icon: Icon,
  align = "inline-end",
  dateProps,
}: DateIconFieldProps) {
  return (
    <Field>
      <FieldLabel>
        {label}
        {optional && (
          <span className="text-muted-foreground ml-1 font-normal">
            (optional)
          </span>
        )}
      </FieldLabel>
      <FieldContent>
        <DatePicker alignIcon={align} icon={Icon} {...dateProps} />
        <FieldError errors={error ? [{ message: error }] : []} />
      </FieldContent>
    </Field>
  );
}

export function CheckboxField({
  label,
  error,
  checked,
  onCheckedChange,
  disabled,
}: CheckboxFieldProps) {
  return (
    <Field>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="cursor-pointer"
        />
        <FieldLabel className="cursor-pointer">{label}</FieldLabel>
      </div>
      <FieldError errors={error ? [{ message: error }] : []} />
    </Field>
  );
}
