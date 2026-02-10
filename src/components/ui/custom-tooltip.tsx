import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function CustomTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="pr-1.5">
        <div className="flex items-center gap-2 text-sm max-w-[270px] wrap-break-word">
          {content}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
