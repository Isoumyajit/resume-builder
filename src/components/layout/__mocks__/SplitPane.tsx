/**
 * Manual mock for layout/SplitPane
 * Renders left and right panels so tests can verify placement.
 */
export function SplitPane(props: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}) {
  return (
    <div data-testid="split-pane">
      <div data-testid="split-pane-left">{props.leftPanel}</div>
      <div data-testid="split-pane-right">{props.rightPanel}</div>
    </div>
  );
}
