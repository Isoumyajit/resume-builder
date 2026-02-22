export function reorderByEdge(
  order: string[],
  sourceKey: string,
  targetKey: string,
  edge: "top" | "bottom",
): string[] {
  const without = order.filter((k) => k !== sourceKey);
  const targetIndex = without.indexOf(targetKey);
  const insertAt = edge === "top" ? targetIndex : targetIndex + 1;
  without.splice(insertAt, 0, sourceKey);
  return without;
}
