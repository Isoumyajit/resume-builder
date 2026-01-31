import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function FormSection({ title, children, action }: FormSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

interface FormRowProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export function FormRow({ children, columns = 2 }: FormRowProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  };

  return <div className={`grid gap-4 ${gridCols[columns]}`}>{children}</div>;
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  optional?: boolean;
}

export function FormField({ label, error, children, optional }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {optional && <span className="text-gray-400 ml-1">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
