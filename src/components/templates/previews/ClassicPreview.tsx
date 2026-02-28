import { cn } from "@/lib/utils/utils";

export function ClassicPreview() {
  return (
    <div className="flex flex-col items-center px-6 py-5">
      <div className="h-3 w-28 rounded bg-gray-800 dark:bg-gray-200" />
      <div className="mt-1.5 h-2 w-44 rounded bg-gray-300 dark:bg-gray-600" />
      <div className="mt-1 h-2 w-36 rounded bg-gray-300 dark:bg-gray-600" />

      <div className="mt-4 w-full border-t border-gray-200 dark:border-gray-600" />

      <div className="mt-3 w-full space-y-3">
        <SectionBlock />
        <BodyLines widths={["w-full", "w-5/6", "w-4/6"]} />
        <SectionBlock />
        <BodyLines widths={["w-full", "w-3/4"]} />
      </div>
    </div>
  );
}

function SectionBlock() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-2.5 w-20 rounded bg-gray-800 dark:bg-gray-200" />
    </div>
  );
}

function BodyLines({ widths }: { widths: string[] }) {
  return (
    <div className="space-y-1.5">
      {widths.map((w, i) => (
        <div
          key={i}
          className={cn("h-2 rounded bg-gray-200 dark:bg-gray-600", w)}
        />
      ))}
    </div>
  );
}
