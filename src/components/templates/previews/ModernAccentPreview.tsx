import { cn } from "@/lib/utils/utils";

export function ModernAccentPreview() {
  return (
    <div className="px-6 py-5">
      <div className="h-3 w-28 rounded bg-blue-600" />
      <div className="mt-1 h-0.5 w-16 rounded bg-blue-600" />
      <div className="mt-1.5 h-2 w-44 rounded bg-gray-300 dark:bg-gray-600" />
      <div className="mt-1 h-2 w-36 rounded bg-gray-300 dark:bg-gray-600" />

      <div className="mt-4 w-full space-y-3">
        <SectionHeader width="w-20" />
        <BodyLines widths={["w-full", "w-5/6", "w-4/6"]} />
        <SectionHeader width="w-24" />
        <BodyLines widths={["w-full", "w-3/4"]} />
      </div>
    </div>
  );
}

function SectionHeader({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-0.5 rounded bg-blue-600" />
      <div
        className={cn("h-2.5 rounded bg-gray-800 dark:bg-gray-200", width)}
      />
    </div>
  );
}

function BodyLines({ widths }: { widths: string[] }) {
  return (
    <div className="ml-2.5 space-y-1.5 border-l-2 border-gray-100 pl-3 dark:border-gray-700">
      {widths.map((w, i) => (
        <div
          key={i}
          className={cn("h-2 rounded bg-gray-200 dark:bg-gray-600", w)}
        />
      ))}
    </div>
  );
}
