import { Group, Panel, Separator } from "react-resizable-panels";
import { GripVertical } from "lucide-react";
import type { SplitPaneProps } from "@/interfaces/components";

export function SplitPane({
  leftPanel,
  rightPanel,
  defaultLeftSize = 50,
  minLeftSize = 30,
  minRightSize = 30,
}: SplitPaneProps) {
  return (
    <Group
      orientation="horizontal"
      className="rb-split-pane h-full w-full flex"
    >
      <Panel
        id="left-panel"
        defaultSize={defaultLeftSize}
        minSize={minLeftSize}
        className="rb-split-pane__panel rb-split-pane__panel--left h-full"
      >
        <div className="rb-split-pane__content rb-split-pane__content--left h-full overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          {leftPanel}
        </div>
      </Panel>

      <Separator className="rb-split-pane__separator w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center">
        <GripVertical className="rb-split-pane__separator-icon h-4 w-4 text-gray-400 dark:text-gray-400" />
      </Separator>

      <Panel
        id="right-panel"
        defaultSize={100 - defaultLeftSize}
        minSize={minRightSize}
        className="rb-split-pane__panel rb-split-pane__panel--right h-full"
      >
        <div className="rb-split-pane__content rb-split-pane__content--right h-full overflow-auto bg-gray-100 dark:bg-gray-800 p-6">
          {rightPanel}
        </div>
      </Panel>
    </Group>
  );
}
