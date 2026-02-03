import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
  dotClassName?: string;
}

export function LoadingDots({ className, dotClassName }: LoadingDotsProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current animate-bounce",
          dotClassName,
        )}
        style={{ animationDelay: "0ms" }}
      />
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current animate-bounce",
          dotClassName,
        )}
        style={{ animationDelay: "150ms" }}
      />
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current animate-bounce",
          dotClassName,
        )}
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}
