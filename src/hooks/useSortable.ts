import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

type DragState = "idle" | "dragging" | "over";

interface UseSortableArgs {
  sectionKey: string;
  index: number;
}

export function useSortable({ sectionKey, index }: UseSortableArgs) {
  const dropTargetRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] = useState<DragState>("idle");
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = dropTargetRef.current;
    const handle = dragHandleRef.current;
    if (!element || !handle) return;

    const cleanupDraggable = draggable({
      element,
      dragHandle: handle,
      getInitialData: () => ({ sectionKey, index }),
      onDragStart: () => setDragState("dragging"),
      onDrop: () => setDragState("idle"),
    });

    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: ({ input, element: el }) =>
        attachClosestEdge(
          { sectionKey, index },
          { input, element: el, allowedEdges: ["top", "bottom"] },
        ),
      canDrop: ({ source }) => source.data.sectionKey !== sectionKey,
      onDragEnter: ({ self }) => {
        setDragState("over");
        setClosestEdge(extractClosestEdge(self.data));
      },
      onDrag: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data));
      },
      onDragLeave: () => {
        setDragState("idle");
        setClosestEdge(null);
      },
      onDrop: () => {
        setDragState("idle");
        setClosestEdge(null);
      },
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [sectionKey, index]);

  return { dropTargetRef, dragHandleRef, dragState, closestEdge };
}
