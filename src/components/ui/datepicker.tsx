import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import type { DatePickerProps } from "@/interfaces";
import { useMemo, useState, type ComponentProps } from "react";

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePicker({
  value = "",
  onChange,
  placeholder = "Select date",
  disabled = false,
  alignIcon = "inline-end",
  icon: Icon = CalendarIcon,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  // Derive date from value prop instead of managing separate state
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const parsedDate = new Date(value);
    return isValidDate(parsedDate) ? parsedDate : undefined;
  }, [value]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setOpen(false);

    if (onChange) {
      if (newDate) {
        // Format as YYYY-MM for month/year inputs like "Jan 2022"
        const month = newDate.toLocaleDateString("en-US", { month: "short" });
        const year = newDate.getFullYear();
        onChange(`${month} ${year}`);
      } else {
        onChange("");
      }
    }
  };

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !disabled) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align={alignIcon}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
              disabled={disabled}
              className="cursor-pointer"
            >
              <Icon className="text-muted-foreground" />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              disabled={(date) => {
                return date > new Date();
              }}
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}

// Legacy component for backward compatibility
export function DatePickerInput({
  label,
  alignIcon = "inline-start",
  inputProps,
}: {
  label: string;
  alignIcon?: "inline-start" | "inline-end";
  inputProps?: Omit<
    ComponentProps<typeof InputGroupInput>,
    "value" | "onChange"
  >;
}) {
  const [value, setValue] = useState("");

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <DatePicker
        value={value}
        onChange={setValue}
        alignIcon={alignIcon}
        placeholder={inputProps?.placeholder}
        disabled={inputProps?.disabled}
      />
    </Field>
  );
}
