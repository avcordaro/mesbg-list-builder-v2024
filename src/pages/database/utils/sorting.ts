function getNestedValue<T>(obj: T, path: string) {
  return path
    .split(".")
    .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function descendingComparator<T>(a: T, b: T, orderBy: string) {
  const aValue = getNestedValue(a, orderBy);
  const bValue = getNestedValue(b, orderBy);

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

export function getComparator(
  order: Order,
  orderBy: string,
): (a: Record<string, unknown>, b: Record<string, unknown>) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
