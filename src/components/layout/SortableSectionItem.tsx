import type { ReactNode, RefObject } from "react";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { cn } from "@/lib/utils/utils";
import { useSortable } from "@/hooks/useSortable";

interface SortableSectionItemProps {
  sectionKey: string;
  index: number;
  children: (dragHandleRef: RefObject<HTMLDivElement | null>) => ReactNode;
}

export function SortableSectionItem({
  sectionKey,
  index,
  children,
}: SortableSectionItemProps) {
  const { dropTargetRef, dragHandleRef, dragState, closestEdge } = useSortable({
    sectionKey,
    index,
  });

  return (
    <div
      ref={dropTargetRef}
      className={cn(
        "relative transition-opacity duration-200",
        dragState === "dragging" && "opacity-40",
      )}
    >
      {children(dragHandleRef)}
      {closestEdge && <DropIndicator edge={closestEdge} gap="24px" />}
    </div>
  );
}
