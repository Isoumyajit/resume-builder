import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function FormSection({ title, children, action }: FormSectionProps) {
  return (
    <div className="rb-form-section rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="rb-form-section__header flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="rb-form-section__title text-lg font-semibold text-gray-900">{title}</h2>
        {action && <div className="rb-form-section__action">{action}</div>}
      </div>
      <div className="rb-form-section__content p-4 space-y-4">{children}</div>
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

  return <div className={`rb-form-row grid gap-4 ${gridCols[columns]}`}>{children}</div>;
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  optional?: boolean;
}

export function FormField({ label, error, children, optional }: FormFieldProps) {
  return (
    <div className="rb-form-field space-y-1.5">
      <label className="rb-form-field__label text-sm font-medium text-gray-700">
        {label}
        {optional && <span className="rb-form-field__optional text-gray-400 ml-1">(optional)</span>}
      </label>
      {children}
      {error && <p className="rb-form-field__error text-sm text-red-500">{error}</p>}
    </div>
  );
}
