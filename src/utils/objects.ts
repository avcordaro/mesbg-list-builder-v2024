export function deepEqual(x, y) {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
}

export function hasValue(value: string | number | unknown) {
  return (
    (typeof value === "string" && value.trim() !== "") ||
    typeof value === "number"
  );
}

export function isAboveZero(value: number) {
  return hasValue(value) && value > 0;
}

export function isPositiveInteger(value: number) {
  return hasValue(value) && value >= 0 && value % 1 == 0;
}
